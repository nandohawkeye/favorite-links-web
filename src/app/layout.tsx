import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Favorite Links',
  description: 'Organize seus links favoritos',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
