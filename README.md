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

## Paylaşım ve içerik doğruluğu

Canonical ve Open Graph origin varsayılanı `https://secretsanta-beta.vercel.app` adresidir. Farklı bir yayında `NEXT_PUBLIC_SITE_URL` değişkenini tam HTTPS origin olarak tanımlayıp yeniden derle. Davet kodları canonical veya paylaşım görseline eklenmez. `app/opengraph-image.tsx`, Next.js ile derleme sırasında 1200×630 PNG üretir; hem Open Graph hem Twitter büyük kartı bu görseli kullanır. `app/icon.svg` favicon olarak sunulur, belge dili `tr` olarak ayarlıdır.

Ana sayfadaki oda önizlemesi etiketli bir HTML/CSS örneğidir; gerçek kullanıcı veya canlı oda verisi değildir. Gösterilen özellikler hediye notu, özel davet bağlantısı ve gizli kuradır. Bütçe, özel eşleşme hariç tutma kuralı ve ayrı istek listesi mevcut değildir. Veriler için otomatik silme süresi yoktur. Oda sahibi diğer sonuçlara erişemez; iki kişilik odada karşı sonuç çıkarılabilir. Veritabanı yöneticisinin teknik erişimi vardır. SSS ve gizlilik bölümü bu sınırları açıkça belirtir.

## Hareket ve illüstrasyon katmanı

Tek yeni uygulama bağımlılığı `motion` paketidir (Framer Motion). `components/motion/scene.tsx`, MotionConfig/LazyMotion üzerinden azaltılmış hareket tercihini, ince imleç desteğini ve sekme görünürlüğünü merkezi yönetir. İşletim sistemi tercihi sayfa açıkken değiştirilirse de uygulanır. İlk sunucu çıktısı okunabilir kalır; JavaScript olmadan içerik kaybolmaz.

- `primitives.tsx`: maskeli başlık, spring/manyetik CTA, scroll ile belirginleşen navbar, katılımcı girişi, yumuşak paneller, kopyalama toast'u ve SVG footer yıldızı.
- `gift-art.tsx`: inline, hafif düzensiz SVG hediye çizimi; CSS kontur/fill girişi, hover/dokunma ile Motion kapak açılışı ve yıldız/kalp parçacıkları.
- `steps.tsx` + `sketches.tsx`: useInView ile sıralı adımlar, useScroll/pathLength bağlantısı, görünürken lazy yüklenen ev/not/kura/zarf illüstrasyonları.
- `room-effects.tsx`: yalnızca oda akışında lazy yüklenen karıştırma ve gizli sonuç kartı. Sonuç metni kullanıcı açmadan DOM'a eklenmez.
- `features.ts`: asenkron yüklenen hafif domAnimation özellik paketi; drag, Three.js ve scroll-jacking yoktur.

Kar katmanında 12 öğe bulunur; sekme gizliyken CSS hareketleri durur. Mobilde manyetik hareket ve adımların bağlantı yolu kapalıdır, giriş mesafeleri azaltılır. Ana hareketler transform/opacity, çizim efektleri yalnızca SVG stroke üzerinden yürür. Lazy illüstrasyonlar sabit boyutlu yuvalara yerleşir. Supabase istemcisi ana sayfanın ilk yüklemesine dahil edilmez; ilk oda işleminde yüklenir. Veritabanı ve kura gizlilik mantığı değiştirilmemiştir.

Yerel doğrulama: üretim derlemesi ve mevcut algoritma testleri geçti. Chromium'da 360/390/768/1440 px taşma, axe WCAG AA, klavye odağı, hareket tercihinin canlı değişimi, görünürlükte durdurma, SVG hediye etkileşimi ve lazy illüstrasyon yükleme kontrolleri geçti. Kontrollü API yanıtlarıyla anonim oturum, oda kurma, yeni katılımcının görünmesi, kopyalama toast'u, bekleyen kura ve yalnızca dokununca açılan sonuç/konfeti test edildi. Bu test canlı Supabase entegrasyonu olarak değerlendirilmez.

Aynı ayarlarda ardışık yerel Lighthouse karşılaştırmasında önceki sürüm 95, yeni sürüm 98 performance puanı aldı; her ikisinde CLS 0. Başlangıç script transferi yaklaşık 205 KiB olarak kaldı (Supabase'in ertelenmesi Motion maliyetini dengeledi). Bunlar yerel laboratuvar ölçümleridir; Vercel yayını üzerinde ölçüm yapılmadı.
