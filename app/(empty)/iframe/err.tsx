"use client"
import { Card, CardBody } from "@nextui-org/react"

export function Error({ error }: { error: string }) {
  return (
    <div className="h-full w-full flex justify-center items-center">
      <Card>
        <CardBody>
          <span className="text-red-500">Error: {error}</span>
        </CardBody>
      </Card>
    </div>
  )
}
