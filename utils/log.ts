export function log(message?: any, ...optionalParams: any[]) {
  const msg = `[${new Date().toISOString()}] ${message}`
  console.log(msg, ...optionalParams)
}
