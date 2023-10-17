export function fetcher(
  input: Parameters<typeof fetch>[0],
  init?: Parameters<typeof fetch>[1]
) {
  return fetch(input, init).then((res) => res.json())
}
