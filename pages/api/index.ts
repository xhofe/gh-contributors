// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

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
  <image class="avatar" clip-path="url(#${user.login})" x="${x}" y="${y}" width="64" height="64" xlink:href="${user.avatar_url}" />
</a>`;
};

const getUsers = async (repos: string[]) => {
  const users = await Promise.all(
    repos.map(async (repo) => {
      const res = await fetch(
        `https://api.github.com/repos/${repo}/contributors`
      );
      return res.json() as Promise<GhUser[]>;
    })
  );
  return users.flat().filter((item, index, arr) => {
    return arr.findIndex((t) => t.login === item.login) === index;
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const repos = [];
  if (typeof req.query.repo === "string") {
    repos.push(req.query.repo);
  } else if (Array.isArray(req.query.repo)) {
    repos.push(...req.query.repo);
  } else {
    res.status(302).redirect("https://contributors.nn.ci");
    return;
  }
  const users = (await getUsers(repos)) as GhUser[];
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
}
