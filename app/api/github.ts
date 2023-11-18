import { LRUCache } from "lru-cache"
import { GhUser, GhUserUse } from "./types"
import fs from "node:fs/promises"
import path from "node:path"
import { throttle } from "@/utils"

const repoCache = new LRUCache<string, GhUserUse[]>({
  max: 500,
  ttl: 1000 * 60 * 60 * 24,
})

const repo_cache_file_path = "./data/cache.json"
const repo_exists_file_path = "./data/repo_exists.json"

async function loadByPath<K extends {}, V extends {}>(
  cache: LRUCache<K, V>,
  filePath: string
) {
  try {
    const items = JSON.parse(await fs.readFile(filePath, "utf-8"))
    cache.load(items)
    console.log(`--- ${filePath} cache loaded ---`)
  } catch (e) {
    console.log(`--- ${filePath} no cache found ---`, e)
  }
}

async function saveByPath<K extends {}, V extends {}>(
  cache: LRUCache<K, V>,
  filePath: string
) {
  try {
    console.log(`--- ${filePath} saving cache ---`)
    const items = cache.dump()
    await fs.writeFile(filePath, JSON.stringify(items))
    console.log(`--- ${filePath} cache saved ---`)
  } catch (e) {
    console.log(`--- ${filePath} failed to save cache ---`, e)
  }
}

async function loadCache() {
  console.log(`--- PAT: ${process.env.PAT} ---`)
  try {
    await fs.mkdir(path.dirname(repo_cache_file_path), { recursive: true })
    loadByPath(repoCache, repo_cache_file_path)
    loadByPath(repoExists, repo_exists_file_path)
  } catch (e) {
    console.log(e)
  }
}

loadCache()
const throttleSaveRepoCache = throttle(() => {
  saveByPath(repoCache, repo_cache_file_path)
}, 1000 * 60)
const throttleSaveRepoExists = throttle(() => {
  saveByPath(repoExists, repo_exists_file_path)
}, 1000 * 60)

const repoExists = new LRUCache<string, number>({
  max: 100,
  ttl: 1000 * 60 * 60 * 24 * 10,
})

const repoNotExists = new LRUCache<string, boolean>({
  max: 100,
  ttl: 1000 * 60 * 60 * 24 * 10,
})

const avatarCache = new LRUCache<string, Buffer>({
  max: 2000,
  ttl: 1000 * 60 * 60 * 24,
})

export function usedBy(per_page: number, page: number) {
  let repos = [] as { name: string; pages: number }[]
  repoExists.forEach((value, key) => {
    if (value) {
      repos.push({
        name: key,
        pages: value,
      })
    }
  })
  const res = repos.slice((page - 1) * per_page, page * per_page)
  return {
    data: res,
    total: repos.length,
  }
}

async function fetchRepoOnePage(repo: string, page: number) {
  const cacheKey = `${repo}-${page}`
  if (repoCache.has(cacheKey)) {
    return repoCache.get(cacheKey)!
  }
  console.log(`fetching ${cacheKey}`)
  let fetchInit: Parameters<typeof fetch>[1]
  if (process.env.PAT) {
    fetchInit = {
      headers: {
        Authorization: `Bearer ${process.env.PAT}`,
      },
    }
  }
  const res = await fetch(
    `https://api.github.com/repos/${repo}/contributors?per_page=100&page=${page}`,
    fetchInit
  )
  const usersPage = await res.json()
  if (usersPage.message) {
    if (usersPage.message === "Not Found") {
      repoNotExists.set(repo, true)
      throw new Error(`repo ${repo} not found`)
    }
    throw new Error(`failed to fetch repo ${cacheKey}: ${usersPage.message}`)
  }
  const usersUse = (usersPage as GhUser[]).map((user): GhUserUse => {
    return {
      login: user.login,
      avatar_url: user.avatar_url,
      type: user.type,
      contributions: user.contributions,
    }
  })
  repoCache.set(cacheKey, usersUse)
  throttleSaveRepoCache()
  repoExists.set(repo, page)
  throttleSaveRepoExists()
  return usersUse
}

export async function fetchRepo(repo: string, maxPages: number = 1) {
  // validate repo
  const repoRegex = /^[\w-]+\/[\w-]+$/
  if (!repoRegex.test(repo)) {
    throw new Error(`invalid repo: ${repo}`)
  }
  if (repoNotExists.get(repo)) {
    throw new Error(`repo ${repo} not found`)
  }
  console.log(`fetching ${repo}`)
  const users = [] as GhUserUse[]
  let page = 1
  while (page <= maxPages) {
    const usersPage = await fetchRepoOnePage(repo, page)
    if (usersPage.length === 0) {
      break
    }
    users.push(...usersPage)
    page++
  }
  return users
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
