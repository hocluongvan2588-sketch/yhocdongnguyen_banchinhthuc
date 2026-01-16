import { Card, CardContent } from "@/components/ui/card"
import { HexagramSVG } from "@/components/hexagram-svg"

interface HexagramDisplayProps {
  upperLines: number[]
  lowerLines: number[]
  upperName: string
  lowerName: string
  hexagramName: string
}

export function HexagramDisplay({ upperLines, lowerLines, upperName, lowerName, hexagramName }: HexagramDisplayProps) {
  return (
    <Card>
      <CardContent className="pt-6 flex flex-col items-center gap-4">
        <HexagramSVG upperLines={upperLines} lowerLines={lowerLines} className="w-24 h-auto" />
        <div className="text-center space-y-1">
          <p className="text-2xl md:text-3xl font-bold">{hexagramName}</p>
          <p className="text-base md:text-lg text-muted-foreground">
            {upperName} ䷀ {lowerName}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
