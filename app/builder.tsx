"use client"

import { Button } from "@nextui-org/button"
import { Input } from "@nextui-org/input"
import copy from "copy-to-clipboard"
import { useState, useMemo } from "react"

export function Builder() {
  const [text, setText] = useState("")
  const [repos, setRepos] = useState<string[]>([])
  const svg = useMemo(() => {
    return `/api?` + repos.map((repo) => `repo=${repo}`).join("&")
  }, [repos])
  const [copied, setCopied] = useState(false)
  return (
    <div className="w-full pt-4 md:px-10 flex gap-2 flex-col">
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (repos.includes(text)) return
            setRepos((repos) => [...repos, text])
            setText("")
          }
        }}
      />
      <div className="flex gap-2 flex-wrap">
        {repos.map((repo) => (
          <div
            key={repo}
            className="flex gap-1 items-center font-mono bg-gray-300/20 p-2 rounded-md"
          >
            <p className="break-all">{repo}</p>
            <p
              className="cursor-pointer px-2 hover:bg-gray-300/30 rounded-md"
              onClick={() => {
                setRepos(repos.filter((r) => r !== repo))
              }}
            >
              ×
            </p>
          </div>
        ))}
      </div>
      {repos.length > 0 && (
        <>
          <img src={svg} alt="svg" />
          <div className="flex font-mono bg-gray-300/20 p-3 rounded-md justify-between items-center break-all">
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
        </>
      )}
    </div>
  )
}
