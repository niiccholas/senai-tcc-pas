import { ReactNode } from 'react'
import './global.css'
import { Rubik } from 'next/font/google';

export const metadata = {
  title: 'PAS',
  description: 'Painel de Acesso à Saúde (PAS)',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
        <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Rubik:wght@100;200;300;400;700&display=swap"></link>
        </head>
      <body  className="rubik.className">
        {children}
      </body>
    </html>
  )
}
