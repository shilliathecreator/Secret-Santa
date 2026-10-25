# Bir Küçük Mucize · Secret Santa

Next.js App Router, React, TypeScript, Tailwind CSS ve Supabase ile özel yılbaşı hediye çekilişi. Türkçe, responsive arayüz; CSS kar efekti; hediye açma animasyonu; kullanıcı etkileşimiyle açılan, Web Audio ile üretilen yılbaşı melodisi. Harici ses dosyası veya görsel servisi gerektirmez.

## Kurulum

Node.js 24 ve npm kullanılır.

```bash
npm ci --cache /workspace/.npm-cache
cp .env.example .env.local
```

1. Bir Supabase projesi oluştur. SQL Editor'da `supabase/migration.sql` dosyasını **bir kez** çalıştır.
2. Authentication → Providers → Anonymous sign-ins özelliğini aç. Üretimde Supabase Auth rate limitlerini ve CAPTCHA korumasını yapılandır. Anonim oturum cihaz/tarayıcı bazlıdır; tarayıcı verileri silinirse erişim geri alınamaz. Kalıcı hesap/cihazlar arası kurtarma bu sürümde yoktur.
3. Project Settings → API bölümünden proje URL'sini ve publishable anahtarını al. `.env.local` içinde `NEXT_PUBLIC_SUPABASE_URL` ve `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` değerlerini doldur. **Service-role anahtarı kullanma.** Bu iki değer herkese açık istemci yapılandırmasıdır; erişim güvenliği veritabanı fonksiyonları ve RLS ile sağlanır.
4. Sunucuyu başlat:

```bash
npm run dev
```

Üretim: `npm run build` ardından `npm start`. Ortam değişkenleri Next.js derlemesine gömüldüğünden değiştiklerinde yeniden derle. Sağlayıcı yönetimli HTTPS kullan. Supabase anahtarları yokken ana sayfa çalışır ve formlar açık kurulum hatası verir; sahte oda/sonuç üretilmez.

## Kod haritası

- `app/page.tsx`: oda kurma/katılma, durum yönetimi, katılımcılar, davet paylaşımı, kura, kişisel sonuç, Realtime aboneliği, 10 saniyelik bağlantı yedeği, müzik.
- `app/globals.css`: responsive tema, CSS hediyeler/çam ağaçları, kar ve kutu animasyonu; reduced-motion desteği.
- `supabase/schema.json`: odalar, kullanıcılar, üyelikler, eşleşmeler ve erişim modeli JSON şeması.
- `supabase/migration.sql`: tablolar, RLS ve gerçek sunucu kura uygulaması.
- `lib/draw.mjs`: bağımsız, tam JavaScript kura fonksiyonu. Yalnızca güvenilir sunucu ortamında kullan; tüm sonuçları istemciye gönderme. Uygulamanın gerçek kurası veritabanında aynı algoritma ile yürütülür.

## Gizlilik ve eşzamanlılık

Davet kodları 96 bit kriptografik rastgelelik içerir. Davet bağlantısı bir katılım yetkisidir: sadece grubunla paylaş. Bir odada en fazla 100 üye bulunabilir. Takma adlar oda içinde benzersizdir. Katılım ve kura aynı oda satırını kilitler; son anda katılan kişinin kuranın dışında kalması veya iki kez kura çekilmesi önlenir. Kura sonrası katılım kapanır.

Fisher–Yates karıştırması kriptografik rastgelelik ve modulo yanlılığını önleyen rejection sampling kullanır; kendine eşleşen permütasyonlar tamamen reddedilir. Herkes tam bir kişiye hediye verir ve tam bir kişiden hediye alır. İki kişi desteklenir; tek kişi desteklenmez.

İstemcinin `rooms`, `members` ve `matches` tablolarına doğrudan erişimi yoktur. SECURITY DEFINER fonksiyonları sabit search_path ve açık oturum/üyelik/sahiplik kontrolleri kullanır. `room_state` yalnızca takma adları ve çağıranın alıcısı ile alıcının notunu döndürür. Realtime sadece kişisel bilgi içermeyen sürüm olaylarını yayınlar; olaylar da üyelik RLS kontrolüne tabidir. Veritabanı yöneticisi tüm verilere erişebilir. Anonim kullanıcılar için proje çapındaki kötüye kullanım koruması, dağıtım öncesi operatör sorumluluğudur.

## Doğrulama

```bash
npm test
npm run typecheck
npm run build
```

Algoritma testleri 2–50 kişilik gruplarda 1.470 kura, tekil alıcılar, kendine çıkmama ve geçersiz girdileri kontrol eder.

Canlı Supabase kabul kontrolü (proje yapılandırıldıktan sonra):

1. İki ayrı tarayıcı profiliyle oda kur ve davetle katıl; katılımcı listesinin otomatik yenilendiğini doğrula.
2. Üye olmayan üçüncü bir oturumdan `room_state` çağrısının reddedildiğini doğrula.
3. Oda sahibi olmayanın `draw_room` çağrısının reddedildiğini doğrula.
4. Sahip olarak kurayı çek; iki oturumda yalnızca karşı tarafın adı ve notu görünmeli.
5. Aynı kurayı tekrar çekmek ve yeni kullanıcıyla katılmak reddedilmeli.
6. REST üzerinden özel tablolara doğrudan SELECT/INSERT/UPDATE denemeleri reddedilmeli; bir üye diğer verenin eşleşmesini sorgulayamamalı.
7. Sayfayı yenile, aynı davet koduyla tekrar katıl; mevcut oturumun aynı sonucuna dönmeli.

Supabase projesi sağlanmadan canlı veritabanı, Auth ve Realtime kontrolleri yapılmış sayılmaz.
