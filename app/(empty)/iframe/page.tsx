"use client"
import { fetchRepos } from "@/app/api/github"
import { useSearchParams } from "next/navigation"

export default async function () {
  const searchParams = useSearchParams()
  const cols = parseInt(searchParams.get("cols") ?? "12")
  const radius = parseInt(searchParams.get("radius") ?? "32")
  const spacing = parseInt(searchParams.get("spacing") ?? "5")
  const repos = searchParams.getAll("repo")
  const users = await fetchRepos(repos)
  const rows = Math.ceil(users.length / cols)
  const width = 5 + cols * 69
  const height = 5 + rows * 69
  const usersGroup = users.reduce((acc, user) => {
    const index = acc.findIndex((group) => group.length < cols)
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
      width={width}
      height={height}
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
                  width={radius * 2}
                  height={radius * 2}
                  x={spacing + j * (radius * 2 + spacing)}
                  y={spacing + i * (radius * 2 + spacing)}
                  rx="32"
                />
              </clipPath>
            </defs>
            <image
              className="rounded-full"
              clip-path={`url(#${user.login})`}
              x={spacing + j * (radius * 2 + spacing)}
              y={spacing + i * (radius * 2 + spacing)}
              width={radius * 2}
              height={radius * 2}
              xlinkHref={user.avatar_url}
            />
          </a>
        ))
      )}
    </svg>
  )
}
