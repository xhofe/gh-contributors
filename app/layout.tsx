import "@/styles/globals.css"
import { Metadata } from "next"
import { siteConfig } from "@/config/site"
import { fontSans } from "@/config/fonts"
import { Providers } from "./providers"
import { Navbar } from "@/components/navbar"
import { Link } from "@nextui-org/link"
import clsx from "clsx"

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "https://jsd.nn.ci/gh/xhofe/xhofe/avatar/avatar.svg",
    shortcut: "https://jsd.nn.ci/gh/xhofe/xhofe/avatar/avatar.svg",
    apple: "https://jsd.nn.ci/gh/xhofe/xhofe/avatar/avatar.svg",
  },
  viewport: "width=device-width, initial-scale=1",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div className="relative flex flex-col h-screen">
            <Navbar />
            <main className="container mx-auto max-w-7xl pt-4 px-6 flex-grow">
              {children}
            </main>
            <footer className="w-full flex items-center justify-center py-3">
              <div className="flex items-center gap-1 text-current">
                <span className="text-default-600">Built with ❤ and&nbsp;</span>
                <Link
                  isExternal
                  href="https://nextjs.org/"
                  className="text-primary"
                >
                  NextJS
                </Link>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  )
}
