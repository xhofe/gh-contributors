import { calParams, calParamsArg, calParamsResult } from "@/utils"
import { fetchAvatar, fetchRepos } from "./github"
import { GhUser, GhUserUse } from "./types"
import sharp from "sharp"

export function getHead(params: calParamsResult) {
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${params.totalWidth}" height="${params.totalHeight}">
  <style>.link { cursor: pointer; } .avatar { border-radius: 50%; }</style>`
}

const foot = `\n</svg>`

export function getUser(
  row: number,
  col: number,
  user: GhUserUse,
  avatar: string,
  params: calParamsResult
) {
  const x = params.x(col)
  const y = params.y(row)
  return `<a xlink:href="https://github.com/${user.login}" class="link" target="_blank">
  <defs>
    <clipPath id="${user.login}">
      <rect width="${params.width}" height="${params.height}" x="${x}" y="${y}" rx="${params.radius}" />
    </clipPath>
  </defs>
  <image class="avatar" clip-path="url(#${user.login})" x="${x}" y="${y}" width="${params.width}" height="${params.height}" xlink:href="data:image/png;base64,${avatar}" />
</a>`
}

export async function generateSVG(
  conf: { repos: string[]; maxPages?: number } & Omit<calParamsArg, "users">
) {
  const users = (await fetchRepos(conf.repos, conf.maxPages)) as GhUser[]
  const params = calParams({ ...conf, users: users })
  function compress(img: Buffer) {
    if (!params.compressSize) {
      return img
    }
    return sharp(img)
      .resize(params.compressSize, params.compressSize)
      .toBuffer()
  }
  const avatars = await Promise.all(
    params.users.map(async (user: GhUserUse) => {
      const buf = await fetchAvatar(user.avatar_url)
      const compressed = await compress(buf)
      return compressed.toString("base64")
    })
  )
  let svg = getHead(params)
  for (let i = 0; i < params.total; i++) {
    svg += getUser(
      Math.floor(i / params.cols),
      i % params.cols,
      params.users[i],
      avatars[i],
      params
    )
  }
  svg += foot
  return svg
}
