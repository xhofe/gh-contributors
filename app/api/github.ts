import { LRUCache } from "lru-cache"
import { GhUser, GhUserUse } from "./types"

const userCache = new LRUCache<string, GhUserUse[]>({
  max: 500,
  ttl: 1000 * 60 * 60 * 24,
})

const avatarCache = new LRUCache<string, string>({
  max: 2000,
  ttl: 1000 * 60 * 60 * 24,
})

export async function fetchRepo(repo: string) {
  // validate repo
  const repoRegex = /^[\w-]+\/[\w-]+$/
  if (!repoRegex.test(repo)) {
    throw new Error(`invalid repo: ${repo}`)
  }
  if (userCache.has(repo)) {
    return userCache.get(repo)!
  }
  console.log(`fetching ${repo}`)
  const users = []
  let page = 1
  while (true) {
    const res = await fetch(
      `https://api.github.com/repos/${repo}/contributors?per_page=100&page=${page}`
    )
    const usersPage = await res.json()
    if (usersPage.message) {
      throw new Error(`failed to fetch repo ${repo}: ${usersPage.message}`)
    }
    if (usersPage.length === 0) {
      break
    }
    users.push(...usersPage)
    page++
  }
  const usersUse = (users as GhUser[]).map((user) => {
    return {
      login: user.login,
      avatar_url: user.avatar_url,
    }
  })
  userCache.set(repo, usersUse)
  return usersUse
}

export async function fetchRepos(repos: string[]) {
  const users = (
    await Promise.all(
      repos.map(async (repo) => {
        const users = await fetchRepo(repo)
        return users
      })
    )
  )
    .flat()
    .filter((item, index, arr) => {
      return arr.findIndex((t) => t.login === item.login) === index
    })
  return users
}

export async function fetchAvatar(url: string) {
  if (!url.startsWith("http")) {
    return url
  }
  if (avatarCache.has(url)) {
    return avatarCache.get(url)!
  }
  const response = await fetch(url)
  const res = Buffer.from(await response.arrayBuffer()).toString("base64")
  avatarCache.set(url, res)
  return res
}
