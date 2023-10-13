"use client"

import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarItem,
  Button,
  Link,
} from "@nextui-org/react"
import { siteConfig } from "@/config/site"
import { ThemeSwitch } from "@/components/theme-switch"
import { GithubIcon, HeartFilledIcon } from "@/components/icons"

export const Navbar = () => {
  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="flex basis-full" justify="center">
        <NavbarItem className="flex gap-2">
          <Link isExternal href={siteConfig.links.github} aria-label="Github">
            <GithubIcon className="text-default-500" />
          </Link>
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="flex">
          <Button
            isExternal
            as={Link}
            className="text-sm font-normal text-default-600 bg-default-100"
            href={siteConfig.links.sponsor}
            startContent={<HeartFilledIcon className="text-danger" />}
            variant="flat"
          >
            Sponsor
          </Button>
        </NavbarItem>
      </NavbarContent>
    </NextUINavbar>
  )
}
