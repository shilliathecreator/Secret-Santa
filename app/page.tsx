"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "motion/react";
import { MotionScene } from "@/components/motion/scene";
import {
  AnimatedButton,
  AnimatedHeader,
  Ambient,
  HeroTitle,
  Participant,
  SoftPanel,
  Toast,
  FooterStar,
} from "@/components/motion/primitives";
import { GiftArt } from "@/components/motion/gift-art";
import { AnimatedSteps } from "@/components/motion/steps";
const Shuffle = dynamic(
  () => import("@/components/motion/room-effects").then((m) => m.Shuffle),
  { ssr: false },
);
const Reveal = dynamic(
  () => import("@/components/motion/room-effects").then((m) => m.Reveal),
  { ssr: false, loading: () => <div className="reveal-loading" /> },
);
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowRight,
  Gift,
  Sparkles,
  AudioLines,
  Music2,
  VolumeX,
  X,
  Copy,
  Check,
  Users,
  LockKeyhole,
  Heart,
  ChevronRight,
  LoaderCircle,
} from "lucide-react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { RoomPreview, LandingDetails } from "@/components/landing-details";
type Room = {
  id: string;
  name: string;
  code: string;
  drawn: boolean;
  isOwner: boolean;
  members: { id: string; nickname: string }[];
  result: { nickname: string; note: string } | null;
};
export default function Home() {
  return (
    <MotionScene>
      <HomeContent />
    </MotionScene>
  );
}
function HomeContent() {
  const [modal, setModal] = useState<"create" | "join" | null>(null),
    [room, setRoom] = useState<Room | null>(null),
    [busy, setBusy] = useState(false),
    [drawing, setDrawing] = useState(false),
    [error, setError] = useState(""),
    [opened, setOpened] = useState(false),
    [copied, setCopied] = useState(false),
    [music, setMusic] = useState(false),
    [invite, setInvite] = useState("");
  const audioRef = useRef<AudioContext | null>(null);
  const clientRef = useRef<SupabaseClient | null>(null);
  const modalTrigger = useRef<HTMLElement | null>(null);
  const load = useCallback(async (code: string) => {
    const supabase = clientRef.current;
    if (!supabase) return;
    const { data, error } = await supabase.rpc("room_state", { p_code: code });
    if (error) throw error;
    setRoom(data as Room);
  }, []);
  useEffect(() => {
    const code =
      new URLSearchParams(location.search).get("room") ||
      localStorage.getItem("santa-room");
    if (code) {
      setInvite(code);
      setModal("join");
    }
  }, []);
  useEffect(() => {
    if (room?.id) void import("@/components/motion/room-effects");
  }, [room?.id]);
  useEffect(() => {
    if (!room || !clientRef.current) return;
    const client = clientRef.current;
    let active = true;
    const refresh = () => {
      load(room.code).catch((e) => {
        if (active) setError(e.message);
      });
    };
    const channel = client
      .channel(`room-${room.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "room_events",
          filter: `room_id=eq.${room.id}`,
        },
        refresh,
      )
      .subscribe();
    const timer = setInterval(refresh, 10000);
    return () => {
      active = false;
      clearInterval(timer);
      void client.removeChannel(channel);
    };
  }, [room?.id, room?.code, load]);
  useEffect(() => {
    if (!music) return;
    const ctx = new AudioContext();
    audioRef.current = ctx;
    let cursor = 0;
    const melody = [
      659, 659, 659, 659, 659, 659, 659, 784, 523, 587, 659, 698, 698, 698, 698,
      698, 659, 659, 659, 659, 587, 587, 659, 587, 784,
    ];
    const play = () => {
      const osc = ctx.createOscillator(),
        gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = melody[cursor++ % melody.length];
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.055, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    };
    void ctx.resume();
    play();
    const timer = setInterval(play, 460);
    return () => {
      clearInterval(timer);
      void ctx.close();
      audioRef.current = null;
    };
  }, [music]);
  useEffect(() => {
    if (!modal) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) setModal(null);
      if (e.key === "Tab") {
        const items = Array.from(
          document.querySelectorAll<HTMLElement>(
            ".modal button:not(:disabled), .modal input, .modal textarea",
          ),
        );
        const first = items[0],
          last = items.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, [modal, busy]);
  useEffect(() => {
    if (!modal) return;
    const trigger = modalTrigger.current;
    return () => trigger?.focus();
  }, [modal]);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    setBusy(true);
    try {
      const { supabase: client } = await import("@/lib/supabase");
      if (!client) {
        setError(
          "Supabase bağlantısı henüz yapılandırılmadı. Kurulum için README dosyasındaki adımları izle.",
        );
        return;
      }
      clientRef.current = client;
      const { data: session, error: sessionError } =
        await client.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session.session) {
        const { error } = await client.auth.signInAnonymously();
        if (error) throw error;
      }
      const args = {
        p_nickname: String(form.get("nickname")).trim(),
        p_note: String(form.get("note")).trim(),
      };
      const { data, error } =
        modal === "create"
          ? await client.rpc("create_room", {
              ...args,
              p_name: String(form.get("name")).trim(),
            })
          : await client.rpc("join_room", {
              ...args,
              p_code: String(form.get("code")).trim(),
            });
      if (error) throw error;
      await load(data);
      localStorage.setItem("santa-room", data);
      history.replaceState(null, "", `?room=${encodeURIComponent(data)}`);
      setOpened(false);
      setModal(null);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : (e as { message?: string }).message ||
              "İşlem tamamlanamadı. Tekrar dene.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function draw() {
    const supabase = clientRef.current;
    if (!supabase || !room) return;
    setBusy(true);
    setDrawing(true);
    setError("");
    try {
      const { error } = await supabase.rpc("draw_room", { p_code: room.code });
      if (error) throw error;
      await load(room.code);
    } catch (e) {
      setError((e as { message: string }).message);
    } finally {
      setBusy(false);
      setDrawing(false);
    }
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(
        `${location.origin}?room=${room?.code}`,
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setError(
        "Davet bağlantısını tarayıcının adres çubuğundan kopyalayabilirsin.",
      );
    }
  }
  function open(mode: "create" | "join") {
    modalTrigger.current = document.activeElement as HTMLElement | null;
    setError("");
    setModal(mode);
  }
  return (
    <main id="icerik">
      <a className="skip-link" href="#sayfa-basligi">
        İçeriğe geç
      </a>
      <Ambient />
      <AnimatedHeader>
        <a className="brand" href="/" aria-label="Bir Küçük Mucize ana sayfa">
          <span className="brand-icon">
            <Gift aria-hidden="true" size={22} />
          </span>{" "}
          bir küçük <em>mucize.</em>
        </a>
        <nav aria-label="Ana gezinme">
          <a href="#nasil">Nasıl çalışır?</a>
          <button
            className="music"
            onClick={() => setMusic(!music)}
            aria-pressed={music}
            aria-label={
              music ? "Yılbaşı müziğini kapat" : "Yılbaşı müziğini aç"
            }
          >
            {music ? (
              <Music2 aria-hidden="true" size={15} />
            ) : (
              <VolumeX aria-hidden="true" size={15} />
            )}
            <span>
              {music ? "Yılbaşı melodisi açık" : "Biraz yılbaşı ruhu"}
            </span>
            <AudioLines
              className={music ? "sound playing" : "sound"}
              size={17}
              aria-hidden="true"
            />
          </button>
        </nav>
      </AnimatedHeader>
      {room ? (
        <SoftPanel className="room-panel">
          <div className="eyebrow">
            <span /> SENİN KÜÇÜK YILBAŞI DÜNYAN
          </div>
          <h1 id="sayfa-basligi" tabIndex={-1}>
            {room.name}
            <span className="red">.</span>
          </h1>
          <p className="subtitle">
            {room.drawn
              ? "Sırlar yerini buldu. Şimdi birini mutlu etme zamanı."
              : "Herkes geldiğinde sihir başlasın."}
          </p>
          <div className="room-grid">
            <article className="panel">
              <div className="panel-top">
                <h2>Hediye ekibi</h2>
                <span className="count">{room.members.length} kişi</span>
              </div>
              <div className="members">
                {room.members.map((m, i) => (
                  <Participant key={m.id}>
                    <span
                      aria-hidden="true"
                      className="avatar"
                      style={{
                        background: [
                          "#f7e4dc",
                          "#e0e8db",
                          "#eee3cd",
                          "#e5dfee",
                        ][i % 4],
                      }}
                    >
                      {m.nickname.slice(0, 1).toLocaleUpperCase("tr")}
                    </span>
                    <strong>{m.nickname}</strong>
                    <Check aria-hidden="true" size={16} />
                  </Participant>
                ))}
              </div>
              {!room.drawn && (
                <AnimatedButton
                  kind="outline"
                  className="wide copy-button"
                  onClick={copy}
                >
                  {copied ? (
                    <Check aria-hidden="true" size={16} />
                  ) : (
                    <Copy aria-hidden="true" size={16} />
                  )}{" "}
                  {copied
                    ? "Bağlantı kopyalandı"
                    : "Davet bağlantısını kopyala"}
                </AnimatedButton>
              )}
              <p className="fine">
                Davet bağlantısı özeldir. Yalnızca arkadaşlarınla paylaş.
              </p>
            </article>
            <article className="panel result-panel">
              {room.drawn ? (
                <>
                  <span className="eyebrow">SANA ÖZEL BİR SIR</span>
                  <button
                    className={`gift-box ${opened ? "unwrapped" : ""}`}
                    onClick={() => setOpened(true)}
                    aria-label={
                      opened
                        ? "Eşleşmen açıldı"
                        : "Dokun ve öğren: gizli eşleşmeni aç"
                    }
                    aria-expanded={opened}
                  >
                    <span className="gift-lid" aria-hidden="true" />
                    <span className="gift-body" aria-hidden="true" />
                    <span className="bow" aria-hidden="true" />
                  </button>
                  {!opened && <span className="tap-hint">Dokun ve öğren</span>}
                  {opened && room.result ? (
                    <Reveal>
                      <p>Bu yıl gülümseteceğin kişi</p>
                      <h2>{room.result.nickname}</h2>
                      <blockquote>
                        {room.result.note || "Bu kişi hediye notu bırakmadı."}
                      </blockquote>
                      <span className="fine">
                        <LockKeyhole aria-hidden="true" size={12} /> Bu sonucu
                        yalnızca sen görebilirsin.
                      </span>
                    </Reveal>
                  ) : (
                    <>
                      <h2>Bir sır seni bekliyor!</h2>
                      <p>
                        Kutuna dokun, kimin yılbaşını güzelleştireceğini öğren.
                      </p>
                    </>
                  )}
                </>
              ) : (
                <>
                  {drawing ? (
                    <Shuffle />
                  ) : (
                    <div className="waiting-icon">
                      <Gift aria-hidden="true" size={45} />
                    </div>
                  )}
                  <h2>Biraz heyecan, biraz sabır.</h2>
                  <p>
                    En az iki kişiyle kura çekilebilir. Kura çekildikten sonra
                    yeni katılımcı eklenemez.
                  </p>
                  {room.isOwner ? (
                    <button
                      className="primary"
                      disabled={busy || room.members.length < 2}
                      onClick={draw}
                    >
                      {busy ? (
                        <LoaderCircle
                          aria-hidden="true"
                          className="spin"
                          size={18}
                        />
                      ) : (
                        <Sparkles aria-hidden="true" size={18} />
                      )}{" "}
                      Kurayı çek
                    </button>
                  ) : (
                    <span className="count">Oda sahibi bekleniyor…</span>
                  )}
                  <p className="fine">
                    Eşleşmeler gizlidir ve kura tekrar çekilemez.
                  </p>
                </>
              )}
            </article>
          </div>
          <button
            className="text-button"
            onClick={() => {
              setRoom(null);
              history.replaceState(null, "", "/");
            }}
          >
            <ArrowLeft size={15} aria-hidden="true" /> Ana sayfaya dön
          </button>
          {error && (
            <p role="alert" className="error">
              {error}
            </p>
          )}
        </SoftPanel>
      ) : (
        <>
          <section className="hero">
            <div className="hero-copy">
              <div className="eyebrow">
                <span /> YILIN EN TATLI SIRRI
              </div>
              <HeroTitle />
              <p className="subtitle">
                Ücretsiz, kısa bir başlangıç: odanı kur, davet bağlantını
                paylaş.
                <br className="desktop" /> Arkadaşların katılsın, herkes gizli
                hediye arkadaşını keşfetsin.
              </p>
              <div className="hero-actions">
                <AnimatedButton onClick={() => open("create")}>
                  <Gift aria-hidden="true" size={19} /> Bir oda oluştur{" "}
                  <ArrowUpRight
                    aria-hidden="true"
                    size={18}
                    className="cta-arrow"
                  />
                </AnimatedButton>
                <AnimatedButton kind="outline" onClick={() => open("join")}>
                  Odaya katıl{" "}
                  <ArrowRight
                    aria-hidden="true"
                    size={18}
                    className="cta-arrow"
                  />
                </AnimatedButton>
              </div>
            </div>
            <GiftArt />
          </section>
          <RoomPreview />
          <AnimatedSteps />
          <LandingDetails />
        </>
      )}
      <footer>
        <a className="brand" href="/">
          bir küçük <em>mucize.</em>
        </a>
        <span>
          Sevgiyle hazırlandı. Paylaştıkça çoğalsın. <FooterStar />
        </span>
      </footer>
      <Toast show={copied} />
      <AnimatePresence>
        {modal && (
          <SoftPanel
            className="overlay"
            instantExit
            onClick={(e) => {
              if (e.target === e.currentTarget && !busy) setModal(null);
            }}
          >
            <section
              className="modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
            >
              <button
                className="close"
                aria-label="Kapat"
                onClick={() => setModal(null)}
                disabled={busy}
              >
                <X aria-hidden="true" size={21} />
              </button>
              <span className="modal-icon">
                <Gift aria-hidden="true" size={28} />
              </span>
              <span className="eyebrow">KÜÇÜK BİR BAŞLANGIÇ</span>
              <h2 id="modal-title">
                {modal === "create"
                  ? "Mutluluğa bir oda aç."
                  : "Ekibine katıl."}
              </h2>
              <p>Sihir, bir araya geldiğimizde başlar.</p>
              <form onSubmit={submit}>
                {modal === "create" ? (
                  <label>
                    Odanın adı
                    <input
                      autoFocus
                      name="name"
                      required
                      minLength={2}
                      maxLength={60}
                      autoComplete="off"
                    />
                  </label>
                ) : (
                  <label>
                    Davet kodu
                    <input
                      autoFocus
                      name="code"
                      defaultValue={invite}
                      required
                      pattern="[a-fA-F0-9]{24}"
                      title="Davet bağlantısındaki 24 karakterlik kod"
                      autoComplete="off"
                    />
                  </label>
                )}
                <label>
                  Takma adın
                  <input
                    name="nickname"
                    required
                    minLength={2}
                    maxLength={30}
                    autoComplete="nickname"
                  />
                </label>
                <label>
                  Hediye notun <span>(isteğe bağlı)</span>
                  <textarea name="note" maxLength={500} rows={3} />
                </label>
                <p className="fine">
                  Sevdiğin şeyler, küçük dileklerin… Notunu sadece sana hediye
                  alacak kişi görür.
                </p>
                {error && (
                  <p className="error" role="alert">
                    {error}
                  </p>
                )}
                <button className="primary wide" disabled={busy}>
                  {busy ? (
                    <LoaderCircle
                      aria-hidden="true"
                      className="spin"
                      size={18}
                    />
                  ) : (
                    <Sparkles aria-hidden="true" size={18} />
                  )}{" "}
                  {busy
                    ? "Biraz sihir hazırlanıyor…"
                    : modal === "create"
                      ? "Odamı oluştur"
                      : "Odaya katıl"}
                  <ChevronRight aria-hidden="true" size={18} />
                </button>
                <p className="fine">
                  Oturumun bu tarayıcıda saklanır. Odaya dönebilmek için
                  tarayıcı verilerini silme.
                </p>
              </form>
            </section>
          </SoftPanel>
        )}
      </AnimatePresence>
    </main>
  );
}
