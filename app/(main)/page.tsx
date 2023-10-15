import { title } from "@/components/primitives"
import { Builder } from "./builder"

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-4">
      <div className="inline-block max-w-lg text-center justify-center">
        <h1 className={title()}>Github&nbsp;</h1>
        <h1 className={title({ color: "indigo" })}>Contributors&nbsp;</h1>
        <br />
        <h1 className={title()}>SVG Generator&nbsp;</h1>
      </div>
      <Builder />
    </section>
  )
}
