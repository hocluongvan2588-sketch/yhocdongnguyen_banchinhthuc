import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface OrganInfoCardProps {
  title: string
  element: string
  organInfo: {
    organ: string
    organSimple: string
    viscera: string
    bodyPart: string
    emotion: string
    taste: string
  }
}

export function OrganInfoCard({ title, element, organInfo }: OrganInfoCardProps) {
  const getElementColor = (el: string) => {
    const colors: Record<string, string> = {
      Mộc: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
      Hỏa: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
      Thổ: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
      Kim: "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20",
      Thủy: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
    }
    return colors[el] || ""
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg md:text-xl flex items-center gap-3">
          {title}
          <Badge className={`text-base px-3 py-1 ${getElementColor(element)}`}>{element}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-base md:text-lg">
          <div>
            <span className="font-semibold text-muted-foreground">Tạng:</span>
            <p className="font-medium">{organInfo.organ}</p>
          </div>
          <div>
            <span className="font-semibold text-muted-foreground">Phủ:</span>
            <p className="font-medium">{organInfo.viscera}</p>
          </div>
          <div>
            <span className="font-semibold text-muted-foreground">Khai khiếu:</span>
            <p className="font-medium">{organInfo.bodyPart}</p>
          </div>
          <div>
            <span className="font-semibold text-muted-foreground">Cảm xúc:</span>
            <p className="font-medium">{organInfo.emotion}</p>
          </div>
          <div>
            <span className="font-semibold text-muted-foreground">Vị:</span>
            <p className="font-medium">{organInfo.taste}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
