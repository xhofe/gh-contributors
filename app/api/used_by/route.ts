import { NextRequest, NextResponse } from "next/server"
import { usedBy } from "../github"

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const per_page = parseInt(searchParams.get("per_page") || "12")
    const page = parseInt(searchParams.get("page") || "1")
    const users = usedBy(per_page, page)
    return NextResponse.json(users)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
