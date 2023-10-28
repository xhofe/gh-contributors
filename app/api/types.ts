export type GhUser = {
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: "User" | "Bot"
  site_admin: boolean
  contributions: number
  // avatar_base64?: string
}

export type GhUserUse = Pick<
  GhUser,
  "login" | "avatar_url" | "type" | "contributions"
>
