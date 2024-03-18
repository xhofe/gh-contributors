import { NextRequest, NextResponse } from "next/server"
import { generateSVG } from "./svg"

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = req.nextUrl.searchParams
    const repos = searchParams.getAll("repo")

    if (repos.length === 0) {
      throw new Error("repo is required")
    }
    const maxPages = parseInt(searchParams.get("pages") || "1")
    const svg = await generateSVG({
      repos,
      maxPages,
      cols: searchParams.get("cols"),
      radius: searchParams.get("radius"),
      space: searchParams.get("space"),
      no_bot: searchParams.getAll("no_bot").length > 0,
      min_contributions: searchParams.get("min_contributions"),
      compress: searchParams.get("compress"),
    })
    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=86400",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
      },
    })
  } catch (e: any) {
    return new NextResponse(
      `<svg xmlns="http://www.w3.org/2000/svg">
    <foreignObject width="400" height="400">
      <body xmlns="http://www.w3.org/1999/xhtml">
        <p style="color: red;">${e.message}</p>
      </body>
    </foreignObject>
  </svg>`,
      {
        status: 500,
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "max-age=0, no-cache, no-store, must-revalidate",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
        },
      }
    )
  }
}
