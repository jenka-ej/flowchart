import { formArrowDots, formLines, formStartEndDots } from "../../lib"
import {
  LayerArrow,
  LayerElement,
  LayerType
} from "../../model/types/FlowchartContainer"
import cls from "./Arrow.module.css"

interface ArrowProps {
  arrow: LayerArrow
  elementFrom: LayerElement
  elementTo: LayerElement
  handleDelete: (item: LayerElement | LayerArrow) => void
  type: LayerType
}

export const Arrow = (props: ArrowProps) => {
  const { arrow, elementFrom, elementTo, handleDelete, type } = props
  const { end } = formStartEndDots(
    elementFrom,
    elementTo,
    arrow.pos_from,
    arrow.pos_to
  )

  let arrowStyles = {
    left: end.left - 5,
    top: end.top - 12,
    rotate: `${
      arrow.pos_to === "lt"
        ? 90
        : arrow.pos_to === "up"
        ? 180
        : arrow.pos_to === "rt"
        ? 270
        : 0
    }deg`
  }

  let dots = formArrowDots(elementFrom, elementTo, arrow.pos_from, arrow.pos_to)

  const { lines } = formLines(dots!)

  return (
    <>
      {lines.map((line, i) => {
        return (
          <div
            key={i}
            onClick={() => {
              if (type === LayerType.DEL) {
                handleDelete(arrow)
              }
            }}
            className={type === LayerType.DEL ? cls.bigline : cls.line}
            style={{
              ...line?.styles
            }}
          />
        )
      })}
      <div className={cls.triangle} style={arrowStyles}>
        <div
          className={
            type === LayerType.DEL ? cls.bigtriangle_inner : cls.triangle_inner
          }
        />
      </div>
    </>
  )
}
