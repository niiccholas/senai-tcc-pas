import { ReactNode } from 'react';

export const metadata = {
  title: 'PAS',
  description: 'Painel de Acesso à Saúde (PAS)',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body style={{ fontFamily: 'Arial, sans-serif', margin: 0, padding: 0 }}>
        <header style={{ background: '#0070f3', color: 'white', padding: '1rem' }}>
          <h1>Meu Site Next.js</h1>
        </header>
      </body>
    </html>
  );
}
