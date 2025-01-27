import { DeleteOutlined } from "@ant-design/icons"
import { Button, Popover } from "antd"
import { formArrowDots, formLines, formStartEndDots } from "../../lib"
import {
  IClickedElement,
  LayerArrow,
  LayerElement
} from "../../model/types/FlowchartContainer"
import cls from "./Arrow.module.css"

interface ArrowProps {
  arrow: LayerArrow
  elementFrom: LayerElement
  elementTo: LayerElement
  handleDelete: (item: LayerElement | LayerArrow) => void
  setClickedElement: (p: IClickedElement | null) => void
  clickedElement: IClickedElement | null
}

export const Arrow = (props: ArrowProps) => {
  const {
    arrow,
    elementFrom,
    elementTo,
    handleDelete,
    setClickedElement,
    clickedElement
  } = props
  const { end } = formStartEndDots(
    elementFrom,
    elementTo,
    arrow.positionFrom,
    arrow.positionTo
  )

  const thisArrowClicked = Boolean(
    clickedElement &&
      "arrowId" in clickedElement.element &&
      clickedElement.element.arrowId === arrow.arrowId
  )

  let arrowStyles = {
    left:
      arrow.positionTo === "lt"
        ? end.left - 1
        : arrow.positionTo === "up"
        ? end.left - 6
        : arrow.positionTo === "rt"
        ? end.left - 9
        : end.left - 6,
    top:
      arrow.positionTo === "lt"
        ? end.top - 13
        : arrow.positionTo === "up"
        ? end.top - 8
        : arrow.positionTo === "rt"
        ? end.top - 13
        : end.top - 16,
    rotate: `${
      arrow.positionTo === "lt"
        ? 90
        : arrow.positionTo === "up"
        ? 180
        : arrow.positionTo === "rt"
        ? 270
        : 0
    }deg`
  }

  let dots = formArrowDots(
    elementFrom,
    elementTo,
    arrow.positionFrom,
    arrow.positionTo
  )

  const { lines } = formLines(dots!)

  return (
    <Popover
      placement="right"
      overlayInnerStyle={{ boxShadow: "none" }}
      showArrow={false}
      content={
        <>
          <div
            className={cls.popover_div}
            style={{ marginTop: "15px" }}
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              className={cls.button_control}
              onClick={() => {
                handleDelete(arrow)
              }}
            >
              Удалить
            </Button>
          </div>
        </>
      }
      open={thisArrowClicked}
    >
      {lines.map((line, i) => {
        return (
          <div
            key={i}
            className={thisArrowClicked ? cls.bigline : cls.line}
            style={{
              ...line?.styles
            }}
            onClick={() => {
              if (thisArrowClicked) {
                setClickedElement(null)
              } else {
                setClickedElement({
                  element: arrow
                })
              }
            }}
          />
        )
      })}
      <div
        className={cls.triangle}
        style={arrowStyles}
      >
        <div
          className={
            thisArrowClicked ? cls.bigtriangle_inner : cls.triangle_inner
          }
        />
      </div>
    </Popover>
  )
}
