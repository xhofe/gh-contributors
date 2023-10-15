"use client"
import { fetchRepos } from "@/app/api/github"
import { GhUserUse } from "@/app/api/types"
import { calParams } from "@/utils/svg"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function Page() {
  const searchParams = useSearchParams()
  const repos = searchParams.getAll("repo")
  const [users, setUsers] = useState<GhUserUse[]>([])
  async function fetchUsers() {
    try {
      const resp = await fetch("/api/json?" + searchParams.toString())
      setUsers(await resp.json())
    } catch (e) {}
  }
  useEffect(() => {
    fetchUsers()
  }, [])
  if (users.length === 0) {
    return <div>loading...</div>
  }
  const params = calParams({
    cols: searchParams.get("cols"),
    radius: searchParams.get("radius"),
    space: searchParams.get("space"),
    total: users.length,
  })
  const usersGroup = users.reduce((acc, user) => {
    const index = acc.findIndex((group) => group.length < params.cols)
    if (index === -1) {
      acc.push([user])
    } else {
      acc[index].push(user)
    }
    return acc
  }, [] as (typeof users)[])
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width={params.totalWidth}
      height={params.totalHeight}
    >
      {usersGroup.map((users, i) =>
        users.map((user, j) => (
          <a
            href={`https://github.com/${user.login}`}
            className="cursor-pointer"
            target="_blank"
          >
            <defs>
              <clipPath id={user.login}>
                <rect
                  width={params.width}
                  height={params.height}
                  x={params.x(j)}
                  y={params.y(i)}
                  rx="32"
                />
              </clipPath>
            </defs>
            <image
              className="rounded-full"
              clip-path={`url(#${user.login})`}
              x={params.x(j)}
              y={params.y(i)}
              width={params.width}
              height={params.height}
              xlinkHref={user.avatar_url}
            />
          </a>
        ))
      )}
    </svg>
  )
}
