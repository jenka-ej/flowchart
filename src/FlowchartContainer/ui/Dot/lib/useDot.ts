import { useRef } from "react"
import { roundDigitForPosition } from "../../../lib"
import { ICoordinate, IDotProps } from "../../../model/types"

export const useDot = ({
  arrow,
  dot,
  handleMoveDotStart,
  handleMoveDot,
  handleMoveDotEnd,
  lineColor,
  containerRef,
  zoom
}: IDotProps) => {
  // Новая координата точки (прокидывается в handleMoveDot)

  const mouseNextPositionForDot = useRef<ICoordinate>({
    left: 0,
    top: 0
  })

  // isDraggingDot флаг, который говорит, что точка в состоянии движения
  // justDraggedDot флаг, который нужен для решения конфликта между pointer events и onClick событиями

  const isDraggingDot = useRef(false)
  const justDraggedDot = useRef(false)

  const dotRef = useRef<SVGCircleElement>(null)

  // Айди фрейма анимации, чтоб можно было его отменять

  const animationFrameDot = useRef<number | null>(null)

  // Хэндлеры для point events

  const handlePointerDownDot = (e: React.PointerEvent<SVGCircleElement>) => {
    isDraggingDot.current = true
    justDraggedDot.current = false

    // Захват точки для событий pointer events

    dotRef.current!.setPointerCapture(e.pointerId)
    handleMoveDotStart(arrow, dot)
  }

  const handlePointerMoveDot = (e: React.PointerEvent<SVGCircleElement>) => {
    if (!isDraggingDot.current || !containerRef.current) return

    const scrollX = containerRef.current.scrollLeft
    const scrollY = containerRef.current.scrollTop

    // Рассчет новой координаты для точки по формуле: текущая позиция курсора - статический отступ контейнера + скролл в пикселях

    const newX = roundDigitForPosition(e.clientX + scrollX)
    const newY = roundDigitForPosition(e.clientY + scrollY)

    if (dot.left === newX && dot.top === newY) return

    justDraggedDot.current = true

    mouseNextPositionForDot.current = {
      left: newX,
      top: newY
    }

    // handlePointerMoveDot может вызываться сотни раз, поэтому чтоб не обновлять позицию точки каждый раз, планируется вызов rAF (если прошлый индекс rAF === null), внутри которого коллбэк с обновлением координаты точки и обнуление индекса rAF

    if (!animationFrameDot.current) {
      animationFrameDot.current = requestAnimationFrame(() => {
        handleMoveDot(arrow, { ...dot, ...mouseNextPositionForDot.current })
        animationFrameDot.current = null
      })
    }
  }

  const handlePointerUpDot = (e: React.PointerEvent<SVGCircleElement>) => {
    if (!isDraggingDot.current) return

    isDraggingDot.current = false
    dotRef.current!.releasePointerCapture(e.pointerId)

    if (!justDraggedDot.current) return

    handleMoveDotEnd()

    if (animationFrameDot.current) {
      cancelAnimationFrame(animationFrameDot.current)
      animationFrameDot.current = null
    }

    setTimeout(() => {
      justDraggedDot.current = false
    }, 100)
  }

  return {
    dot,
    dotRef,
    lineColor,
    handlePointerDownDot,
    handlePointerMoveDot,
    handlePointerUpDot
  }
}
