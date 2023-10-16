"use client"

import { Button, Card, CardBody, Chip, Image, Input } from "@nextui-org/react"
import copy from "copy-to-clipboard"
import { useState, useMemo, useRef } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export function Builder() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const repos = searchParams.getAll("repo")
  function setRepos(_repos: string[]) {
    const params = new URLSearchParams()
    _repos.forEach((repo) => params.append("repo", repo))
    router.replace(`${pathname}?${params.toString()}`)
  }
  // const [repos, setRepos] = useState<string[]>([])
  const svg = useMemo(() => {
    return `/api?` + repos.map((repo) => `repo=${repo}`).join("&")
  }, [repos])
  const inputRef = useRef<HTMLInputElement>(null)
  const [copied, setCopied] = useState(false)
  function add() {
    const text = inputRef.current?.value
    if (!text || repos.includes(text)) return
    inputRef.current!.value = ""
    setRepos([...repos, text])
  }
  const inputDom = (
    <>
      <Input
        ref={inputRef}
        placeholder="Input your github repo as owner/repo"
        // variant="faded"
        // color="primary"
        className="w-full font-mono"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            add()
          }
        }}
        endContent={
          <Button
            size="sm"
            color="primary"
            onPress={() => {
              add()
            }}
          >
            Add
          </Button>
        }
      />
      <div className="flex gap-2 flex-wrap items-center font-mono">
        {repos.map((repo) => (
          <Chip
            key={repo}
            onClose={() => {
              setRepos(repos.filter((r) => r !== repo))
            }}
            radius="sm"
          >
            {repo}
          </Chip>
        ))}
      </div>
    </>
  )
  return (
    <div className="w-full pt-4 md:px-10 lg:px-[14%] flex gap-2 flex-col">
      <Card className="hidden sm:flex">
        <CardBody className="flex flex-col gap-3">{inputDom}</CardBody>
      </Card>
      <div className="flex sm:hidden flex-col gap-3">{inputDom}</div>
      {repos.length > 0 && (
        <>
          <Image width="100%" src={svg} alt="svg" />
          <Card>
            <CardBody>
              <div className="flex font-mono justify-between items-center break-all">
                <p>
                  {location.origin}
                  {svg}
                </p>
                <Button
                  onClick={() => {
                    copy(`${location.origin}${svg}`)
                    setCopied(true)
                    setTimeout(() => {
                      setCopied(false)
                    }, 1000)
                  }}
                  size="sm"
                  color="primary"
                >
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </CardBody>
          </Card>
        </>
      )}
    </div>
  )
}
