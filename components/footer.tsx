"use client"

import { Link } from "@nextui-org/react"

export function Footer() {
  return (
    <footer className="w-full flex items-center justify-center py-3">
      <div className="flex items-center gap-1 text-current">
        <span className="text-default-600">Built with ❤ and&nbsp;</span>
        <Link isExternal href="https://nextjs.org/" className="text-primary">
          NextJS
        </Link>
      </div>
    </footer>
  )
}
