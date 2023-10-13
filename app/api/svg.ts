import { fetchAvatar, fetchRepos } from "./github"
import { GhUser, GhUserUse } from "./types"

export function getHead(rows: number, cols: number) {
  const width = 5 + cols * 69
  const height = 5 + rows * 69
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}">
  <style>.link { cursor: pointer; } .avatar { border-radius: 50%; }</style>`
}

const foot = `\n</svg>`

export function getUser(
  row: number,
  col: number,
  user: GhUser,
  avatar: string
) {
  const x = 5 + col * 69
  const y = 5 + row * 69
  return `<a xlink:href="https://github.com/${user.login}" class="link" target="_blank">
  <defs>
    <clipPath id="${user.login}">
      <rect width="64" height="64" x="${x}" y="${y}" rx="32" />
    </clipPath>
  </defs>
  <image class="avatar" clip-path="url(#${user.login})" x="${x}" y="${y}" width="64" height="64" xlink:href="data:image/png;base64,${avatar}" />
</a>`
}

export async function generateSVG(conf: { repos: string[]; cols: number }) {
  const users = (await fetchRepos(conf.repos)) as GhUser[]
  const avatars = await Promise.all(
    users.map(async (user: GhUserUse) => await fetchAvatar(user.avatar_url))
  )
  const rows = Math.ceil(users.length / conf.cols)
  let svg = getHead(rows, conf.cols)
  for (let i = 0; i < users.length; i++) {
    svg += getUser(
      Math.floor(i / conf.cols),
      i % conf.cols,
      users[i],
      avatars[i]
    )
  }
  svg += foot
  return svg
}
