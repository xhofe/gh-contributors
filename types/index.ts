import { SVGProps } from "react"

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number
}

export type UsedRepoInfo = {
  name: string
  count: number
}
