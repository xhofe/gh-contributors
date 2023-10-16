"use client"

import { Divider, Link, link } from "@nextui-org/react"
import NextLink from "next/link"

export function Footer() {
  return (
    <footer className="w-full flex items-center justify-center py-3">
      <div className="flex items-center gap-1 text-current">
        <span className="text-default-600">Built with ❤ and&nbsp;</span>
        <Link isExternal href="https://nextjs.org/" className="text-primary">
          NextJS
        </Link>
        <Divider orientation="vertical" className="h-5" />
        <NextLink className={link()} href="/used_by">
          Used by
        </NextLink>
      </div>
    </footer>
  )
}
