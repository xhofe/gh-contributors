"use client"
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

// const host = "https://api.nn.ci/proxy/https://contrib.nn.ci"
const host = ""

export function Show() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const perPage = parseInt(searchParams.get("per_page") || "12")
  const { data, error, isLoading } = useSWR<{
    data: {
      name: string
      pages: number
    }[]
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
      <div className="columns-[344px]">
        {data!.data.map((repo) => (
          <Card isPressable key={repo.name} className="mb-4 w-full">
            <CardHeader className="pb-0">
              <Link
                href={`https://github.com/${repo.name}`}
                isExternal
                className=" hover:underline"
              >
                {repo.name}
              </Link>
            </CardHeader>
            <CardBody className="p-3">
              <Link
                isExternal
                href={`/api?repo=${repo.name}&pages=${repo.pages}`}
              >
                <Image
                  src={`${host}/api?repo=${repo.name}&pages=${repo.pages}`}
                />
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
