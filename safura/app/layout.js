import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata = {
  title: 'Safura — তাজা বাজার',
  description: 'সেরা মানের গ্রোসারি অনলাইনে অর্ডার করুন',
}

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <body>
        <Navbar />
        <main style={{ paddingBottom: 40 }}>
          {children}
        </main>
      </body>
    </html>
  )
}
