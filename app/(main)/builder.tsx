"use client"

import {
  Accordion,
  AccordionItem,
  Button,
  Card,
  CardBody,
  Chip,
  Image,
  Input,
  Tooltip,
} from "@nextui-org/react"
import copy from "copy-to-clipboard"
import { useState, useMemo, useRef } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import IframePage from "@/app/(empty)/iframe/page"

const options = [
  {
    name: "cols",
    type: "number",
    default: "12",
    desc: "Number of avatars per row (default: 12)",
  },
  {
    name: "pages",
    type: "number",
    default: "1",
    desc: "Number of pages to generate per repo (default: 1), 100 contributors per page",
  },
  {
    name: "radius",
    type: "number",
    default: "32",
    desc: "The radius of the avatars (default: 32)",
  },
  {
    name: "space",
    type: "number",
    default: "5",
    desc: "The spacing between avatars (default: 5)",
  },
  {
    name: "min_contributions",
    type: "number",
    default: "0",
    desc: "Only show contributors with at least this number of contributions (default: 0)",
  },
  {
    name: "compress",
    type: "number",
    default: "",
    desc: "The height/width of each avatar after compression (default: radius * 4, 0 to disable)",
  },
  {
    name: "no_bot",
    type: "boolean",
    default: false,
    desc: "Do not show bots (default: false)",
  },
]

export function Builder() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const repos = searchParams.getAll("repo")
  function setRepos(_repos: string[]) {
    const params = new URLSearchParams()
    searchParams.forEach((value, key) => {
      if (key !== "repo") {
        params.append(key, value)
      }
    })
    _repos.forEach((repo) => params.append("repo", repo))
    router.replace(`${pathname}?${params.toString()}`)
  }
  const svg = useMemo(() => {
    const params = [] as string[]
    searchParams.forEach((value, key) => {
      params.push(`${key}=${value}`)
    })
    return `${location.origin}/api?` + params.join("&")
  }, [repos])
  const inputRef = useRef<HTMLInputElement>(null)
  const [copied, setCopied] = useState(false)
  function add() {
    const text = inputRef.current?.value
    if (!text || repos.includes(text)) return
    inputRef.current!.value = ""
    setRepos([...repos, text])
  }
  function setOption(key: string, value?: string) {
    const params = new URLSearchParams()
    searchParams.forEach((value, key) => {
      params.append(key, value)
    })
    if (!value) {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.replace(`${pathname}?${params.toString()}`)
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
      <Accordion>
        <AccordionItem
          title="Advanced Options"
          classNames={{
            trigger: "py-0",
          }}
        >
          <div className="flex gap-2 flex-wrap items-center font-mono w-full">
            {options.map((option) => {
              if (["number", "string"].includes(option.type)) {
                return (
                  <Input
                    key={option.name}
                    label={option.name}
                    placeholder={option.desc}
                    value={searchParams.get(option.name) || ""}
                    onChange={(e) => {
                      const value = e.target.value.trim()
                      setOption(
                        option.name,
                        !value || value === option.default ? undefined : value
                      )
                    }}
                    size="sm"
                  />
                )
              } else if (option.type === "boolean") {
                return (
                  <Tooltip content={option.desc} key={option.name}>
                    <Button
                      size="sm"
                      color={
                        searchParams.get(option.name) === "true"
                          ? "primary"
                          : "default"
                      }
                      onPress={() => {
                        setOption(
                          option.name,
                          searchParams.get(option.name) === "true"
                            ? undefined
                            : "true"
                        )
                      }}
                    >
                      {option.name}
                    </Button>
                  </Tooltip>
                )
              }
            })}
          </div>
        </AccordionItem>
      </Accordion>
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
          <div className="flex justify-center">
            <IframePage />
          </div>
          <Card>
            <CardBody>
              <div className="flex font-mono justify-between items-center break-all">
                <p>{svg}</p>
                <Button
                  onClick={() => {
                    copy(svg)
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
