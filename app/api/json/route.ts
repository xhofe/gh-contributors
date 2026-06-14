import { NextRequest, NextResponse } from "next/server"
import { fetchOrgRepos, fetchRepos } from "../github"

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    let repos = searchParams.getAll("repo")
    const org = searchParams.get("org")
    const maxPages = parseInt(searchParams.get("pages") || "1")

    if (org) {
      const orgRepos = await fetchOrgRepos(org, maxPages)
      repos = [...repos, ...orgRepos]
    }

    if (repos.length === 0) {
      throw new Error("repo or org is required")
    }

    const users = await fetchRepos(repos, maxPages)
    return NextResponse.json(users)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
