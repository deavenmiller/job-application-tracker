import './globals.css'

export const metadata = {
  title: 'Job Search Organization',
  description: 'Track your job applications and interview progress',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

