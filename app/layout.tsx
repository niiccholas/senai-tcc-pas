import { ReactNode } from 'react'
import { FiltrosProvider } from './context/FiltroContext'
import { ThemeProvider } from './context/ThemeContext'
import Header from './components/Header'
import './global.css'

export const metadata = {
  title: 'PAS',
  description: 'Painel de Acesso à Saúde (PAS)',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
        <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Rubik:wght@100;200;300;400;500;600;700&display=swap"></link>
        </head>
        
      <ThemeProvider>
        <FiltrosProvider>
          <body className="rubik.className">
            <Header />

            {children}

          </body>
        </FiltrosProvider>
      </ThemeProvider>
    </html>
  )
}