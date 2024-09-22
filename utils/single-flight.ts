export type Fn<T = any> = () => T | Promise<T>
export type ResolveFn = (res: any) => void

export type KeyType = string | symbol

export interface Call {
  resolveFns: ResolveFn[]
  rejectFns: ResolveFn[]
}

let resolveInstance: Promise<void>

export class Singleflight {
  private singleFlightQueue = new Map<KeyType, Call>()

  async do<T = any>(key: KeyType, fn: Fn<T>): Promise<T> {
    const [res] = await this.doWithFresh(key, fn)
    return res
  }

  async doWithFresh<T = any>(
    key: KeyType,
    fn: Fn<T>
  ): Promise<[data: T, fresh: boolean]> {
    const promise: Promise<[data: T, fresh: boolean]> = new Promise(
      (resolve, reject) => {
        const call: Call = this.singleFlightQueue.get(key) || {
          resolveFns: [],
          rejectFns: [],
        }

        call.resolveFns.push(resolve)
        call.rejectFns.push(reject)
        this.singleFlightQueue.set(key, call)
        if (call.resolveFns.length === 1) {
          if (!resolveInstance) {
            resolveInstance = Promise.resolve()
          }
          // ensure always work even fn is sync function
          resolveInstance
            .then(() => fn())
            .then((res) => {
              const waitCall = this.singleFlightQueue.get(key)!
              waitCall.resolveFns.forEach((resolve, i) => {
                if (i === 0) {
                  resolve([res, true])
                } else {
                  resolve([res, false])
                }
              })
              this.singleFlightQueue.delete(key)
            })
            .catch((err) => {
              const waitCall = this.singleFlightQueue.get(key)!
              waitCall.rejectFns.forEach((reject) => reject(err))
              this.singleFlightQueue.delete(key)
            })
        }
      }
    )

    return promise
  }
}
