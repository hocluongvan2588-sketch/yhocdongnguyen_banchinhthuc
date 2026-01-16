interface HexagramSVGProps {
  upperLines: [boolean, boolean, boolean]
  lowerLines: [boolean, boolean, boolean]
  movingLine: number
  className?: string
}

export function HexagramSVG({ upperLines, lowerLines, movingLine, className = "" }: HexagramSVGProps) {
  // Hào 1 ở dưới cùng, hào 6 ở trên cùng
  // Thứ tự từ trên xuống: Hào 6, 5, 4 (upper), Hào 3, 2, 1 (lower)
  if (!upperLines || !lowerLines) {
    return null
  }

  const allLines = [[...upperLines].reverse(), [...lowerLines].reverse()].flat()

  const renderLine = (isSolid: boolean, index: number, isMoving: boolean) => {
    // Y coordinate: index 0 (hào 6) ở trên, index 5 (hào 1) ở dưới
    const y = 20 + index * 32
    const lineHeight = 18 // Thicker lines like reference image

    if (isSolid) {
      return (
        <g key={index}>
          <rect x="30" y={y} width="240" height={lineHeight} fill="#1F2937" rx="9" />
          {isMoving && <circle cx="280" cy={y + lineHeight / 2} r="5" fill="#EF4444" />}
        </g>
      )
    } else {
      return (
        <g key={index}>
          <rect x="30" y={y} width="105" height={lineHeight} fill="#1F2937" rx="9" />
          <rect x="165" y={y} width="105" height={lineHeight} fill="#1F2937" rx="9" />
          {isMoving && (
            <>
              <line x1="275" y1={y + 5} x2="285" y2={y + lineHeight - 5} stroke="#EF4444" strokeWidth="3" />
              <line x1="285" y1={y + 5} x2="275" y2={y + lineHeight - 5} stroke="#EF4444" strokeWidth="3" />
            </>
          )}
        </g>
      )
    }
  }

  return (
    <svg viewBox="0 0 300 210" className={className} xmlns="http://www.w3.org/2000/svg">
      {allLines.map((isSolid, index) => {
        // index 0 = hào 6, index 1 = hào 5, ..., index 5 = hào 1
        const actualLineNumber = 6 - index
        return renderLine(isSolid, index, actualLineNumber === movingLine)
      })}
    </svg>
  )
}
