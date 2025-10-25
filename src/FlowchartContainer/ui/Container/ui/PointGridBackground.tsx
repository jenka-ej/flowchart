import { useEffect, useRef } from "react"
import { VISIBLE_CELL_SIZE } from "../../../const"

interface IPointGridBackgroundProps {
  dotColor?: string
  backgroundColor?: string
  gridSize?: number // размер клетки в px
  dotSize?: number // радиус точки
  opacity?: number // Прозрачность точек (по умолчанию 0.5)
}

export const PointGridBackground = ({
  dotColor = "#888888",
  backgroundColor = "#ffffff",
  gridSize = VISIBLE_CELL_SIZE,
  dotSize = 1,
  opacity = 0.3
}: IPointGridBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const parent = canvas.parentElement
    if (!parent) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const drawDots = () => {
      const width = parent.offsetWidth
      const height = parent.offsetHeight
      canvas.width = width
      canvas.height = height

      ctx.fillStyle = backgroundColor
      ctx.fillRect(0, 0, width, height)
      ctx.globalAlpha = opacity

      ctx.fillStyle = dotColor
      for (let x = 0; x < width; x += gridSize) {
        for (let y = 0; y < height; y += gridSize) {
          ctx.beginPath()
          ctx.arc(x, y, dotSize, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    drawDots()

    // Следим только за изменением размера родителя
    const resizeObserver = new ResizeObserver(() => drawDots())
    resizeObserver.observe(parent)

    return () => {
      resizeObserver.disconnect()
    }
  }, [dotColor, backgroundColor, gridSize, dotSize])

  return (
    <canvas
      ref={canvasRef}
      style={{
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: -1
      }}
    />
  )
}
