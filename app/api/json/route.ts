import { NextRequest, NextResponse } from "next/server"
import { fetchRepos } from "../github"

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const repos = searchParams.getAll("repo")
    const maxPages = parseInt(searchParams.get("pages") || "1")

    if (repos.length === 0) {
      throw new Error("repo is required")
    }

    const users = await fetchRepos(repos, maxPages)
    return NextResponse.json(users)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
