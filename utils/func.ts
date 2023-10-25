export function debounce(fn: Function, delay: number) {
  let timer: ReturnType<typeof setTimeout>
  return function () {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn()
    }, delay)
  }
}

export function throttle(fn: Function, delay: number) {
  let timer: ReturnType<typeof setTimeout> | null = null
  return function () {
    if (!timer) {
      fn()
      timer = setTimeout(() => {
        timer = null
      }, delay)
    }
  }
}
