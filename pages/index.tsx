import Head from "next/head";
import copy from "copy-to-clipboard";
import { useMemo, useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [repos, setRepos] = useState<string[]>([]);
  const svg = useMemo(() => {
    return `/api?` + repos.map((repo) => `repo=${repo}`).join("&");
  }, [repos]);
  const [copied, setCopied] = useState(false);
  return (
    <div className="container mx-auto flex flex-col items-center py-16">
      <Head>
        <title>Github Contributors</title>
        <meta
          name="description"
          content="Generate svg of github contributors"
        />
        <link
          rel="icon"
          href="https://jsd.nn.ci/gh/Xhofe/Xhofe/avatar/avatar.svg"
        />
      </Head>

      <main className="flex gap-2 flex-col">
        <h1 className="text-2xl">Github Contributors SVG Generator</h1>

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="p-2 rounded-md outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (repos.includes(text)) return;
              setRepos((repos) => [...repos, text]);
              setText("");
            }
          }}
        />
        <div className="flex gap-2 flex-wrap">
          {repos.map((repo) => (
            <div
              key={repo}
              className="flex gap-1 items-center font-mono bg-gray-300/20 p-2 rounded-md"
            >
              <p>{repo}</p>
              <p
                className="cursor-pointer px-2 hover:bg-gray-300/30 rounded-md"
                onClick={() => {
                  setRepos(repos.filter((r) => r !== repo));
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
            <div className="flex font-mono bg-gray-300/20 p-4 rounded-md justify-between">
              <p>http://contributors.nn.ci{svg}</p>
              <p
                onClick={() => {
                  copy(`http://contributors.nn.ci${svg}`);
                  setCopied(true);
                  setTimeout(() => {
                    setCopied(false);
                  }, 1000);
                }}
              >
                {copied ? "Copied!" : "Copy"}
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
