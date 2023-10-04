import './globals.css'
import { Inter } from 'next/font/google'

import Footer from './components/Footer/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Playlist 124',
  description: 'Some additional Spotify playlist features',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Footer />
      </body>
    </html>
  )
}
