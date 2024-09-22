export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full bg-transparent">
      <body className="h-full bg-transparent">{children}</body>
    </html>
  )
}
