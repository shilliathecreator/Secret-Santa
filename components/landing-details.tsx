import { LazySketch } from "./motion/steps";
import {
  Gift,
  Link,
  LockKeyhole,
  NotebookPen,
  ChevronDown,
  Check,
} from "lucide-react";

export function RoomPreview() {
  return (
    <section
      className="room-preview content-section"
      aria-labelledby="preview-title"
    >
      <div className="section-heading">
        <div>
          <span className="eyebrow">ODANA KÜÇÜK BİR BAKIŞ</span>
          <h2 id="preview-title">Herkes bir arada. Sırrın sana özel.</h2>
        </div>
        <span className="sample-label">
          Örnek oda görünümü · canlı oda değildir
        </span>
      </div>
      <div className="preview-window">
        <div className="preview-toolbar">
          <span className="window-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>Yeni yıl ekibi</span>
          <LockKeyhole size={16} aria-hidden="true" />
        </div>
        <div className="preview-columns">
          <div>
            <h3>
              Hediye ekibi <span className="count">3 kişi</span>
            </h3>
            <ul className="preview-members">
              {["Deniz", "Ece", "Mert"].map((name, i) => (
                <li key={name}>
                  <span
                    className={`avatar sample-avatar-${i}`}
                    aria-hidden="true"
                  >
                    {name[0]}
                  </span>
                  <span>{name}</span>
                  <Check size={16} aria-hidden="true" />
                </li>
              ))}
            </ul>
            <p className="fine">
              Davet bağlantını paylaş, ekibin burada buluşsun.
            </p>
          </div>
          <div className="preview-result">
            <span className="step-icon peach">
              <Gift size={25} aria-hidden="true" />
            </span>
            <span className="eyebrow">ÖRNEK KİŞİSEL SONUÇ</span>
            <p>Bu yıl gülümseteceğin kişi</p>
            <h3>Ece</h3>
            <blockquote>
              “Kahveyi ve kış akşamlarında kitap okumayı çok severim.”
            </blockquote>
            <p className="fine">
              <LockKeyhole size={13} aria-hidden="true" /> Gerçek odanda burada
              yalnızca kendi alıcını görürsün.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LandingDetails() {
  const features = [
    {
      Icon: NotebookPen,
      title: "Hediye notu",
      text: "Sevdiğin şeyleri ve dileklerini 500 karaktere kadar anlat. Notun, sana hediye alacak kişiye ulaşsın.",
    },
    {
      Icon: Link,
      title: "Özel davet bağlantısı",
      text: "Odanın bağlantısını arkadaşlarınla paylaş. Kura çekilmeden önce herkes kendi takma adıyla katılsın.",
    },
    {
      Icon: Gift,
      title: "Gizli eşleştirme",
      text: "En az iki kişiyle kura çek. Herkes bir kişiye hediye alsın; kimse kendine çıkmasın.",
    },
  ];
  const faq = [
    [
      "Eşleşmeyi kim görür?",
      "Uygulamada herkes yalnızca kendi hediye alacağı kişiyi ve onun notunu görür. Oda kurucusunun diğer eşleşmelere özel erişimi yoktur. İki kişilik odada sonuçlar doğal olarak çıkarılabilir. Veritabanı yöneticileri teknik olarak verilere erişebilir.",
    ],
    [
      "Kaç kişi katılabilir?",
      "Bir odada en fazla 100 kişi olabilir. Kura için en az iki kişi gerekir. Kurayı yalnızca oda sahibi çeker; ardından yeni katılım ve tekrar kura kapatılır.",
    ],
    [
      "Ücretsiz mi? Hesap açmam gerekiyor mu?",
      "Uygulamada ücret veya ödeme adımı yok. E-posta ve şifreyle kayıt olman gerekmez; katılırken otomatik anonim bir oturum oluşturulur ve bu tarayıcıda saklanır.",
    ],
    [
      "Davet bağlantısını kaybedersem ne yapmalıyım?",
      "Aynı tarayıcıda son odanın kodu hatırlanır; “Odaya katıl” ile dönebilirsin. Bağlantıyı bir oda arkadaşından da yeniden isteyebilirsin. Tarayıcı verilerini silersen veya cihaz değiştirirsen eski anonim kimliğin ve eşleşmen geri alınamaz.",
    ],
    [
      "Eşleşme nasıl yapılır?",
      "Sunucu katılımcıları kriptografik rastgelelikle karıştırır; kendine eşleşen bir kişi varsa karıştırmayı tekrarlar. Herkes bir kişiye hediye verir ve bir kişiden hediye alır. Özel hariç tutma kuralları bulunmaz.",
    ],
    [
      "Verilerim saklanıyor mu?",
      "Evet. Oda, takma ad, hediye notu ve eşleşmeler Supabase veritabanında saklanır. Otomatik silme süresi ve uygulama içi silme özelliği henüz yoktur. Anonim oturumun ve son oda kodun da tarayıcında tutulur. Notuna hassas kişisel bilgi yazma.",
    ],
  ];
  return (
    <>
      <section className="content-section" aria-labelledby="features-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">KÜÇÜK AMA İŞE YARAYAN ŞEYLER</span>
            <h2 id="features-title">Neler var?</h2>
          </div>
        </div>
        <div className="feature-grid">
          {features.map(({ Icon, title, text }) => (
            <article key={title}>
              <span className="step-icon green">
                <Icon size={23} aria-hidden="true" />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section
        className="privacy-section content-section"
        aria-labelledby="privacy-title"
      >
        <LazySketch kind="envelope" />
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              <LockKeyhole size={14} aria-hidden="true" /> GİZLİLİK, AÇIKÇA
            </span>
            <h2 id="privacy-title">Sırrını kim görebilir?</h2>
          </div>
        </div>
        <ul className="privacy-list">
          <li>
            <strong>Kurucuya özel bir sonuç listesi yok.</strong> Oda sahibi de
            yalnızca kendi alıcısını ve onun notunu görür.
          </li>
          <li>
            <strong>Başkasının sonucunu açamazsın.</strong> Uygulama yalnızca
            sana ait eşleşmeyi getirir. İki kişilik odada diğer sonuç tahmin
            edilebilir.
          </li>
          <li>
            <strong>Kayıt formu yok, anonim oturum var.</strong> E-posta veya
            şifre gerekmez. Geri dönebilmek için aynı tarayıcıyı ve oturum
            verilerini korumalısın.
          </li>
          <li>
            <strong>Veriler otomatik silinmiyor.</strong> Oda, takma adlar,
            notlar ve eşleşmeler veritabanında saklanır; tanımlı bir otomatik
            silme süresi yoktur.
          </li>
        </ul>
        <p className="fine">
          Veritabanı yöneticilerinin teknik erişimi vardır. Davet bağlantısı
          katılım yetkisi verir; yalnızca grubunla paylaş.
        </p>
      </section>
      <section
        className="faq-section content-section"
        aria-labelledby="faq-title"
      >
        <div className="section-heading">
          <div>
            <span className="eyebrow">AKLINDA KALMASIN</span>
            <h2 id="faq-title">Küçük sorular, açık cevaplar.</h2>
          </div>
        </div>
        <div className="faq-list">
          {faq.map(([question, answer]) => (
            <details key={question}>
              <summary>
                {question}
                <ChevronDown size={18} aria-hidden="true" />
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
