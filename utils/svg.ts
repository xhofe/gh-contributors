import { GhUserUse } from "@/app/api/types"

function getVal(val: number | string | null | undefined, defaultValue: number) {
  let result = defaultValue
  if (val) {
    if (typeof val === "string") {
      result = parseInt(val)
    } else {
      result = val
    }
  }
  return result
}

export function calParams(conf: {
  cols?: number | null | string
  users: GhUserUse[]
  radius?: number | null | string
  space?: number | null | string
  no_bot?: boolean
  min_contributions?: number | null | string
  compress?: number | null | string
}) {
  let users = conf.users
  if (conf.no_bot) {
    users = users.filter((user) => user.type !== "Bot")
  }
  if (conf.min_contributions) {
    const min_contributions = getVal(conf.min_contributions, 0)
    users = users.filter((user) => user.contributions >= min_contributions)
  }
  const cols = getVal(conf.cols, 12)
  const radius = getVal(conf.radius, 32)
  const space = getVal(conf.space, 5)
  const total = users.length
  const rows = Math.ceil(total / cols)
  const totalWidth = space + cols * (radius * 2 + space)
  const totalHeight = space + rows * (radius * 2 + space)
  function x(j: number) {
    return space + j * (radius * 2 + space)
  }
  function y(i: number) {
    return space + i * (radius * 2 + space)
  }
  const compressSize = getVal(conf.compress, radius * 4)
  return {
    cols,
    radius,
    space,
    rows,
    totalWidth,
    totalHeight,
    width: radius * 2,
    height: radius * 2,
    x,
    y,
    total,
    users,
    compressSize,
  }
}

export type calParamsArg = Parameters<typeof calParams>[0]
export type calParamsResult = ReturnType<typeof calParams>
