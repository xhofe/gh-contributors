"use client"
import { GhUserUse } from "@/app/api/types"
import { calParams } from "@/utils"
import { Spinner } from "@nextui-org/react"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import useSWR from "swr"

export default function Page() {
  const searchParams = useSearchParams()
  const { data, error, isLoading } = useSWR<GhUserUse[]>(
    `/api/json?${searchParams.toString()}`
  )

  if (error) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <p className="text-red-500">Error: {error?.message}</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <Spinner />
      </div>
    )
  }
  const users = data!
  const params = calParams({
    cols: searchParams.get("cols"),
    radius: searchParams.get("radius"),
    space: searchParams.get("space"),
    total: users.length,
  })
  const usersGroup = users!.reduce((acc, user) => {
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
