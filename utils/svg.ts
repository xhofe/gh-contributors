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
  total: number
  radius?: number | null | string
  space?: number | null | string
}) {
  const cols = getVal(conf.cols, 12)
  const radius = getVal(conf.radius, 32)
  const space = getVal(conf.space, 5)
  const rows = Math.ceil(conf.total / cols)
  const totalWidth = space + cols * (radius * 2 + space)
  const totalHeight = space + rows * (radius * 2 + space)
  function x(j: number) {
    return space + j * (radius * 2 + space)
  }
  function y(i: number) {
    return space + i * (radius * 2 + space)
  }
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
  }
}

export type calParamsArg = Parameters<typeof calParams>[0]
export type calParamsResult = ReturnType<typeof calParams>
