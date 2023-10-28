"use client"
import { GhUserUse } from "@/app/api/types"
import { calParams, fetcher } from "@/utils"
import { Spinner } from "@nextui-org/react"
import { useSearchParams } from "next/navigation"
import useSWR from "swr"
import { Error } from "./err"

export default function Page() {
  const searchParams = useSearchParams()
  const { data, error, isLoading } = useSWR<GhUserUse[] & { error?: string }>(
    `/api/json?${searchParams.toString()}`,
    fetcher
  )

  if (error) {
    return <Error error={error.message} />
  }

  if (isLoading) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <Spinner />
      </div>
    )
  }

  if (data?.error) {
    return <Error error={data.error} />
  }
  console.log(isLoading, data, error)
  const users = data!
  const params = calParams({
    cols: searchParams.get("cols"),
    radius: searchParams.get("radius"),
    space: searchParams.get("space"),
    users: users,
    no_bot: searchParams.getAll("no_bot").length > 0,
    min_contributions: searchParams.get("min_contributions"),
    compress: searchParams.get("compress"),
  })
  const usersGroup = params.users.reduce((acc, user) => {
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
      viewBox={`0 0 ${params.totalWidth} ${params.totalHeight}`}
      className="max-w-full h-auto"
    >
      {usersGroup.map((users, i) =>
        users.map((user, j) => (
          <a
            key={user.login}
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
                  rx={params.radius}
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
