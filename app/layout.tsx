import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Bir Küçük Mucize · Secret Santa', description: 'Arkadaşlarınla yılın en tatlı sırrını paylaş. Özel odalar, gizli eşleşmeler ve küçük mutluluklar.' };
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="tr"><body>{children}</body></html>}
