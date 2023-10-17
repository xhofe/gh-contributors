"use client"
import { UsedRepoInfo } from "@/types"
import { fetcher } from "@/utils"
import {
  Card,
  CardBody,
  CardHeader,
  Image,
  Link,
  Pagination,
  Spinner,
} from "@nextui-org/react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import useSWR from "swr"

const host = ""

export function Show() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const perPage = 24
  const { data, error, isLoading } = useSWR<{
    data: UsedRepoInfo[]
    total: number
  }>(`${host}/api/used_by?` + searchParams.toString(), fetcher)
  if (error) {
    return (
      <div className="w-full h-24 flex justify-center items-center">
        <p className="text-red-500">Error: {error?.message}</p>
      </div>
    )
  }
  if (isLoading) {
    return (
      <div className="w-full h-24 flex justify-center items-center">
        <Spinner />
      </div>
    )
  }
  if (!data?.total) {
    return (
      <Card className="mt-10">
        <CardBody>
          <p className="flex justify-center items-center text-xl w-96 h-48">
            No Used
          </p>
        </CardBody>
      </Card>
    )
  }
  const pages = Math.ceil(data.total / perPage)
  return (
    <div className="w-full pt-4 md:px-10 lg:px-[14%] flex gap-2 flex-col">
      <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(400px,1fr))] gap-4">
        {data!.data.map((repo) => (
          <Card isPressable key={repo.name}>
            <CardHeader className="pb-0">{repo.name}</CardHeader>
            <CardBody className="p-3">
              <Link href={`/api?repo=${repo.name}`}>
                <Image src={`${host}/api?repo=${repo.name}`} />
              </Link>
            </CardBody>
          </Card>
        ))}
      </div>
      {pages > 1 && (
        <div className="flex justify-center">
          <Pagination
            total={Math.ceil(data!.total / perPage)}
            page={parseInt(searchParams.get("page") ?? "1")}
            onChange={(page) => {
              const params = new URLSearchParams(searchParams)
              params.set("page", page.toString())
              router.push(pathname + "?" + params.toString())
            }}
          />
        </div>
      )}
    </div>
  )
}
