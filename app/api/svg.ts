import { calParams, calParamsArg, calParamsResult } from "@/utils"
import { fetchAvatar, fetchRepos } from "./github"
import { GhUser, GhUserUse } from "./types"

export function getHead(params: calParamsResult) {
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${params.totalWidth}" height="${params.totalHeight}">
  <style>.link { cursor: pointer; } .avatar { border-radius: 50%; }</style>`
}

const foot = `\n</svg>`

export function getUser(
  row: number,
  col: number,
  user: GhUser,
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
  const avatars = await Promise.all(
    users.map(async (user: GhUserUse) => await fetchAvatar(user.avatar_url))
  )
  const params = calParams({ ...conf, users: users })
  let svg = getHead(params)
  for (let i = 0; i < users.length; i++) {
    svg += getUser(
      Math.floor(i / params.cols),
      i % params.cols,
      users[i],
      avatars[i],
      params
    )
  }
  svg += foot
  return svg
}
