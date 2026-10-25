import type { Metadata } from "next";
import "./globals.css";

// The default production origin was supplied by the project owner.
const configuredSite =
  process.env.NEXT_PUBLIC_SITE_URL || "https://secretsanta-beta.vercel.app";
const siteUrl = configuredSite ? new URL(configuredSite) : undefined;
const title = "Bir Küçük Mucize · Ücretsiz Secret Santa";
const description =
  "Yılbaşı hediye çekilişini birlikte hazırlayın. Ücretsiz oda kurun, davet bağlantısını paylaşın; herkes yalnızca kendi hediye arkadaşını ve notunu görsün.";
export const metadata: Metadata = {
  metadataBase: siteUrl,
  title,
  description,
  ...(siteUrl ? { alternates: { canonical: "/" } } : {}),
  openGraph: {
    title,
    description,
    locale: "tr_TR",
    type: "website",
    siteName: "bir küçük mucize",
    ...(siteUrl ? { url: siteUrl } : {}),
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/opengraph-image"],
  },
  referrer: "no-referrer",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
