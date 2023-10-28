import { LRUCache } from "lru-cache"
import { GhUser, GhUserUse } from "./types"
import { UsedRepoInfo } from "@/types"
import fs from "node:fs/promises"
import path from "node:path"
import { throttle } from "@/utils"

const repoCache = new LRUCache<string, GhUserUse[]>({
  max: 500,
  ttl: 1000 * 60 * 60 * 24,
})

const cache_file_path = "./data/cache.json"

async function saveCache() {
  try {
    console.log("--- saving cache ---")
    const items = repoCache.dump()
    await fs.writeFile(cache_file_path, JSON.stringify(items))
    console.log("--- cache saved ---")
  } catch (e) {
    console.log("--- failed to save cache ---", e)
  }
}

async function loadCache() {
  console.log(`--- PAT: ${process.env.PAT} ---`)
  try {
    await fs.mkdir(path.dirname(cache_file_path), { recursive: true })
    const items = JSON.parse(await fs.readFile(cache_file_path, "utf-8"))
    repoCache.load(items)
    console.log("--- cache loaded ---")
  } catch (e) {
    console.log("--- no cache found ---", e)
  }
}

loadCache()
const throttleSaveCache = throttle(saveCache, 1000 * 60)

const repoNotFoundCache = new LRUCache<string, boolean>({
  max: 100,
  ttl: 1000 * 60 * 60 * 12,
})

const avatarCache = new LRUCache<string, Buffer>({
  max: 2000,
  ttl: 1000 * 60 * 60 * 24,
})

export function usedBy(per_page: number, page: number) {
  let all = [] as UsedRepoInfo[]
  repoCache.forEach((value, key) => {
    all.push({
      name: key,
      count: value.length,
    })
  })
  all = all.sort((a, b) => b.count - a.count)
  const res = all.slice((page - 1) * per_page, page * per_page)
  return {
    data: res,
    total: all.length,
  }
}

export async function fetchRepo(repo: string, maxPages: number = 1) {
  // validate repo
  const repoRegex = /^[\w-]+\/[\w-]+$/
  if (!repoRegex.test(repo)) {
    throw new Error(`invalid repo: ${repo}`)
  }
  if (repoCache.has(repo)) {
    return repoCache.get(repo)!
  }
  if (repoNotFoundCache.has(repo)) {
    throw new Error(`repo ${repo} not found`)
  }
  console.log(`fetching ${repo}`)
  const users = []
  let page = 1
  let fetchInit: Parameters<typeof fetch>[1]
  if (process.env.PAT) {
    fetchInit = {
      headers: {
        Authorization: `Bearer ${process.env.PAT}`,
      },
    }
  }
  while (page <= maxPages) {
    const res = await fetch(
      `https://api.github.com/repos/${repo}/contributors?per_page=100&page=${page}`,
      fetchInit
    )
    const usersPage = await res.json()
    if (usersPage.message) {
      if (usersPage.message === "Not Found") {
        repoNotFoundCache.set(repo, true)
        throw new Error(`repo ${repo} not found`)
      }
      throw new Error(`failed to fetch repo ${repo}: ${usersPage.message}`)
    }
    if (usersPage.length === 0) {
      break
    }
    users.push(...usersPage)
    page++
  }
  const usersUse = (users as GhUser[]).map((user): GhUserUse => {
    return {
      login: user.login,
      avatar_url: user.avatar_url,
      type: user.type,
      contributions: user.contributions,
    }
  })
  repoCache.set(repo, usersUse)
  throttleSaveCache()
  return usersUse
}

export async function fetchRepos(repos: string[], maxPages?: number) {
  const users = (
    await Promise.all(
      repos.map(async (repo) => {
        const users = await fetchRepo(repo, maxPages)
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
  if (avatarCache.has(url)) {
    return avatarCache.get(url)!
  }
  const response = await fetch(url)
  const res = Buffer.from(await response.arrayBuffer())
  avatarCache.set(url, res)
  return res
}
