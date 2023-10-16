"use client"
import { UsedRepoInfo } from "@/types"
import {
  Card,
  CardBody,
  CardHeader,
  Image,
  Link,
  Pagination,
} from "@nextui-org/react"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export function Show() {
  const searchParams = useSearchParams()
  const [data, setData] = useState<UsedRepoInfo[]>([])
  const [total, setTotal] = useState(0)
  async function refetch() {
    const resp = await fetch("/api/used_by?" + searchParams.toString())
    const { data, total } = await resp.json()
    setData(data)
    setTotal(total)
  }
  useEffect(() => {
    refetch()
  }, [searchParams])
  return (
    <div className="w-full pt-4 md:px-10 lg:px-[14%] flex gap-2 flex-col">
      <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(400px,1fr))]">
        {data.map((repo) => (
          <Card isPressable key={repo.name}>
            <CardHeader className="pb-0">{repo.name}</CardHeader>
            <CardBody className="p-3">
              <Link href={`/api?repo=${repo.name}`}>
                <Image src={`/api?repo=${repo.name}`} />
              </Link>
            </CardBody>
          </Card>
        ))}
      </div>
      <div className="flex justify-center">
        <Pagination
          total={total}
          page={parseInt(searchParams.get("page") ?? "1")}
        />
      </div>
    </div>
  )
}
