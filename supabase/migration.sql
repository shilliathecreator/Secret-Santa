-- Run once in Supabase SQL Editor. Enable Authentication > Providers > Anonymous sign-ins.
create extension if not exists pgcrypto with schema extensions;
create table public.rooms (
 id uuid primary key default gen_random_uuid(),
 code text unique not null default encode(extensions.gen_random_bytes(12),'hex'),
 name text not null check (char_length(name) between 2 and 60),
 owner_id uuid not null references auth.users(id),
 drawn boolean not null default false,
 created_at timestamptz not null default now()
);
create table public.members (
 room_id uuid not null references public.rooms(id) on delete cascade,
 user_id uuid not null references auth.users(id),
 nickname text not null check(char_length(nickname) between 2 and 30),
 note text not null default '' check(char_length(note)<=500),
 joined_at timestamptz not null default now(),
 primary key(room_id,user_id), unique(room_id,nickname)
);
create table public.matches (
 room_id uuid not null references public.rooms(id),
 giver_id uuid not null,
 recipient_id uuid not null,
 primary key(room_id,giver_id), unique(room_id,recipient_id),
 foreign key(room_id,giver_id) references public.members(room_id,user_id),
 foreign key(room_id,recipient_id) references public.members(room_id,user_id),
 check(giver_id<>recipient_id)
);
create table public.room_events (
 room_id uuid primary key references public.rooms(id) on delete cascade,
 version uuid not null default gen_random_uuid()
);
alter table public.rooms enable row level security;
alter table public.members enable row level security;
alter table public.matches enable row level security;
alter table public.room_events enable row level security;
-- Only the membership predicate is exposed; notes and all pairings remain inaccessible.
create function public.is_room_member(p_room uuid) returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.members where room_id=p_room and user_id=auth.uid());
$$;
create policy event_members on public.room_events for select to authenticated using(public.is_room_member(room_id));
revoke all on public.rooms,public.members,public.matches,public.room_events from anon,authenticated;
grant select on public.room_events to authenticated;
alter publication supabase_realtime add table public.room_events;

create function public.create_room(p_name text,p_nickname text,p_note text) returns text
language plpgsql security definer set search_path='' as $$
declare r public.rooms;
begin
 if auth.uid() is null then raise exception 'Önce oturum açmalısın.'; end if;
 if (select count(*) from public.rooms where owner_id=auth.uid() and created_at>now()-interval '1 day')>=20 then raise exception 'Günlük oda limitine ulaştın.'; end if;
 insert into public.rooms(name,owner_id) values(trim(p_name),auth.uid()) returning * into r;
 insert into public.members values(r.id,auth.uid(),trim(p_nickname),trim(p_note),now());
 insert into public.room_events(room_id) values(r.id);
 return r.code;
end $$;

create function public.join_room(p_code text,p_nickname text,p_note text) returns text
language plpgsql security definer set search_path='' as $$
declare r public.rooms;
begin
 if auth.uid() is null then raise exception 'Önce oturum açmalısın.'; end if;
 select * into r from public.rooms where code=lower(trim(p_code)) for update;
 if not found then raise exception 'Davet kodu bulunamadı.'; end if;
 if exists(select 1 from public.members where room_id=r.id and user_id=auth.uid()) then return r.code; end if;
 if r.drawn then raise exception 'Bu odanın kurası zaten çekildi.'; end if;
 if (select count(*) from public.members where room_id=r.id)>=100 then raise exception 'Oda dolu (100 kişi).'; end if;
 insert into public.members values(r.id,auth.uid(),trim(p_nickname),trim(p_note),now());
 update public.room_events set version=gen_random_uuid() where room_id=r.id;
 return r.code;
exception when unique_violation then raise exception 'Bu takma ad odada kullanılıyor.';
end $$;

create function public.room_state(p_code text) returns jsonb
language plpgsql security definer set search_path='' as $$
declare r public.rooms; result jsonb;
begin
 select * into r from public.rooms where code=lower(trim(p_code));
 if not found or not public.is_room_member(r.id) then raise exception 'Oda bulunamadı veya erişimin yok.'; end if;
 select jsonb_build_object('id',r.id,'name',r.name,'code',r.code,'drawn',r.drawn,'isOwner',r.owner_id=auth.uid(),
 'members',(select jsonb_agg(jsonb_build_object('id',user_id,'nickname',nickname) order by joined_at) from public.members where room_id=r.id),
 'result',(select jsonb_build_object('nickname',m.nickname,'note',m.note) from public.matches x join public.members m on m.room_id=x.room_id and m.user_id=x.recipient_id where x.room_id=r.id and x.giver_id=auth.uid())) into result;
 return result;
end $$;

create function public.draw_room(p_code text) returns void
language plpgsql security definer set search_path='' as $$
declare r public.rooms; ids uuid[]; recipients uuid[]; n int; i int; j int; tmp uuid; valid boolean; random_bytes bytea; value bigint; lim bigint;
begin
 select * into r from public.rooms where code=lower(trim(p_code)) for update;
 if not found or r.owner_id<>auth.uid() or auth.uid() is null then raise exception 'Sadece oda sahibi kura çekebilir.'; end if;
 if r.drawn then raise exception 'Kura zaten çekildi.'; end if;
 select array_agg(user_id order by joined_at) into ids from public.members where room_id=r.id;
 n:=array_length(ids,1);
 if n is null or n<2 then raise exception 'En az iki katılımcı gerekli.'; end if;
 -- Cryptographic Fisher–Yates + rejection sampling: uniform derangements.
 loop
  recipients:=ids;
  for i in reverse n..2 loop
   lim:=floor(4294967296::numeric/i)*i;
   loop
    random_bytes:=extensions.gen_random_bytes(4);
    value:=get_byte(random_bytes,0)::bigint*16777216+get_byte(random_bytes,1)::bigint*65536+get_byte(random_bytes,2)::bigint*256+get_byte(random_bytes,3);
    exit when value<lim;
   end loop;
   j:=(value%i)::int+1; tmp:=recipients[i]; recipients[i]:=recipients[j]; recipients[j]:=tmp;
  end loop;
  valid:=true;
  for i in 1..n loop if ids[i]=recipients[i] then valid:=false; exit; end if; end loop;
  exit when valid;
 end loop;
 for i in 1..n loop insert into public.matches values(r.id,ids[i],recipients[i]); end loop;
 update public.rooms set drawn=true where id=r.id;
 update public.room_events set version=gen_random_uuid() where room_id=r.id;
end $$;
revoke all on function public.is_room_member(uuid),public.create_room(text,text,text),public.join_room(text,text,text),public.room_state(text),public.draw_room(text) from public,anon;
grant execute on function public.is_room_member(uuid),public.create_room(text,text,text),public.join_room(text,text,text),public.room_state(text),public.draw_room(text) to authenticated;
