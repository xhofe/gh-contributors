// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import mem from "mem";

type Data = {
  // name: string;
};

type GhUser = {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  contributions: number;
};

const getHead = (rows: number, cols: number) => {
  const width = 5 + cols * 69;
  const height = 5 + rows * 69;
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}">
  <style>.link { cursor: pointer; } .avatar { border-radius: 50%; }</style>`;
};

const foot = `\n</svg>`;

const getUser = (row: number, col: number, user: GhUser) => {
  const x = 5 + col * 69;
  const y = 5 + row * 69;
  return `<a xlink:href="https://github.com/${user.login}" class="link" target="_blank">
  <defs>
    <clipPath id="${user.login}">
      <rect width="64" height="64" x="${x}" y="${y}" rx="32" />
    </clipPath>
  </defs>
  <image class="avatar" clip-path="url(#${user.login})" x="${x}" y="${y}" width="64" height="64" xlink:href="data:image/png;base64,${user.avatar_url}" />
</a>`;
};

const fetchAvatar = async (url: string) => {
  const response = await fetch(url);
  return Buffer.from(await response.arrayBuffer()).toString("base64");
};

const fetchRepo = async (repo: string) => {
  console.log(`fetching ${repo}`);
  const res = await fetch(`https://api.github.com/repos/${repo}/contributors`);
  const users = await res.json();
  if (users.message) {
    throw new Error(`failed to fetch repo ${repo}: ${users.message}`);
  }
  return users as GhUser[];
};

const memFetchRepo = mem(fetchRepo, {
  maxAge: 1000 * 60 * 60 * 24,
});

const memFetchAvatar = mem(fetchAvatar, {
  maxAge: 1000 * 60 * 60 * 24,
});

const fetchRepos = async (repos: string[]) => {
  const users = (
    await Promise.all(
      repos.map(async (repo) => {
        const users = await memFetchRepo(repo);
        return users;
      })
    )
  )
    .flat()
    .filter((item, index, arr) => {
      return arr.findIndex((t) => t.login === item.login) === index;
    });
  await Promise.all(
    users.map(
      async (user: GhUser) =>
        (user.avatar_url = await memFetchAvatar(user.avatar_url))
    )
  );
  return users;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const repos = [];
    if (typeof req.query.repo === "string") {
      repos.push(req.query.repo);
    } else if (Array.isArray(req.query.repo)) {
      repos.push(...req.query.repo);
    } else {
      // res.status(302).redirect("https://contributors.nn.ci");
      // return;
      throw new Error("repo is required");
    }
    const users = (await fetchRepos(repos)) as GhUser[];
    const cols = parseInt((req.query.cols as string) ?? "12");
    const rows = Math.ceil(users.length / cols);
    let svg = getHead(rows, cols);
    for (let i = 0; i < users.length; i++) {
      svg += getUser(Math.floor(i / cols), i % cols, users[i]);
    }
    svg += foot;
    res
      .setHeader("Content-Type", "image/svg+xml")
      .setHeader("Cache-Control", "public, max-age=86400")
      .status(200)
      .send(svg);
  } catch (e: any) {
    res.setHeader("Content-Type", "image/svg+xml").status(500)
      .send(`<svg xmlns="http://www.w3.org/2000/svg">
      <foreignObject width="400" height="400">
        <body xmlns="http://www.w3.org/1999/xhtml">
          <p style="color: red;">${e.message}</p>
        </body>
      </foreignObject>
    </svg>`);
  }
}
