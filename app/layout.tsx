import "@/styles/globals.css"
import { Metadata } from "next"
import { siteConfig } from "@/config/site"

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
  return <>{children}</>
}
