import { Inter, Montserrat, Play, Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google'

// Self-hosted at build time by next/font — no request to Google from visitors.
export const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-jakarta',
  display: 'swap',
})

export const inter = Inter({ subsets: ['latin'], weight: ['400', '600'], variable: '--font-inter', display: 'swap' })

export const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

export const montserrat = Montserrat({ subsets: ['latin'], weight: ['500'], variable: '--font-montserrat', display: 'swap' })

export const play = Play({ subsets: ['latin'], weight: ['400'], variable: '--font-play', display: 'swap' })

export const fontVariables = [jakarta, inter, playfair, montserrat, play].map((f) => f.variable).join(' ')
