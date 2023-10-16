import { title } from "@/components/primitives"
import { Show } from "./show"

export const metadata = {
  title: "Used by",
}
export default function Page() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-4">
      <div className="inline-block max-w-lg text-center justify-center">
        <h2 className={title({ color: "indigo", size: "sm" })}>Used&nbsp;</h2>
        <h2 className={title({ size: "sm" })}>By</h2>
      </div>
      <Show />
    </section>
  )
}
