import { IArrowProps } from "../../model/types"
import { Dot } from "../Dot/Dot"
import { useArrow } from "./lib/useArrow"

export const Arrow = (props: IArrowProps) => {
  const {
    arrow,
    d,
    setClickedItem,
    thisArrowClicked,
    lineColor,
    handleClickArrow,
    handleAddTemporaryDots,
    handleMoveDotStart,
    handleMoveDot,
    handleMoveDotEnd,
    containerRef,
    staticOffset,
    handleDeleteTemporaryDots,
    setShowElementOptions,
    zoom
  } = useArrow(props)

  return (
    <>
      {/* Определяем маркер (конец стрелки) */}
      <defs>
        <marker
          id={`arrowhead${arrow.arrowId}`}
          markerWidth="4" // в 2 раза меньше
          markerHeight="5"
          refX="4"
          refY="2.5"
          orient="auto"
        >
          <polygon points="0 0, 4 2.5, 0 5" fill={lineColor()} />
        </marker>
      </defs>

      <g>
        {/* Линия (path) с маркером на конце */}
        <path
          d={d}
          fill="none"
          stroke={lineColor()}
          strokeWidth={2}
          markerEnd={`url(#arrowhead${arrow.arrowId})`}
        />

        {/* Невидимая широкая линия для кликов */}
        <path
          d={d}
          fill="none"
          stroke="transparent"
          strokeWidth={8} // 2px основная + по 3px "поля" с каждой стороны
          onClick={handleClickArrow}
          style={{ cursor: "pointer" }}
        />

        {/* Точки */}
        {thisArrowClicked &&
          arrow.dots.map((dot) => (
            <Dot
              key={dot.dotId}
              arrow={arrow}
              dot={dot}
              handleMoveDotStart={handleMoveDotStart}
              handleMoveDot={handleMoveDot}
              handleMoveDotEnd={handleMoveDotEnd}
              lineColor={lineColor}
              containerRef={containerRef}
              staticOffset={staticOffset}
              zoom={zoom}
            />
          ))}
      </g>
    </>
  )
}
