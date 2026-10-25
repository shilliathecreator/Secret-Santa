import { ImageResponse } from "next/og";
export const alt =
  "bir küçük mucize · Küçük bir hediye. Kocaman bir mutluluk. Ücretsiz yılbaşı hediye çekilişi.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "70px 78px",
        background: "#faf8f2",
        color: "#293e35",
        fontFamily: "sans-serif",
        border: "18px solid #e9eddf",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", width: 730 }}>
        <div style={{ display: "flex", fontSize: 29, marginBottom: 46 }}>
          bir küçük mucize.
        </div>
        <div style={{ display: "flex", fontSize: 60, letterSpacing: -2 }}>
          Küçük bir hediye.
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 60,
            letterSpacing: -2,
            color: "#ad473c",
          }}
        >
          Kocaman bir mutluluk.
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 25,
            marginTop: 40,
            color: "#53634e",
          }}
        >
          Ücretsiz yılbaşı hediye çekilişi
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 22,
            marginTop: 12,
            color: "#53634e",
          }}
        >
          Odanı kur. Davet et. Sırrını keşfet.
        </div>
      </div>
      <svg width="240" height="310" viewBox="0 0 240 310">
        <circle cx="120" cy="155" r="118" fill="#e9eddf" />
        <path
          d="M120 120C40 110 47 35 94 65L120 120C200 110 193 35 146 65Z"
          fill="none"
          stroke="#b8975c"
          strokeWidth="13"
        />
        <rect x="37" y="142" width="168" height="130" rx="9" fill="#b54e40" />
        <rect x="27" y="118" width="188" height="34" rx="5" fill="#bd5145" />
        <rect x="106" y="118" width="32" height="154" fill="#dfc39b" />
      </svg>
    </div>,
    size,
  );
}
