import { DeleteOutlined } from "@ant-design/icons"
import { Button, Popover, Select } from "antd"
import { useRef, useState } from "react"
import {
  CELL_SIZE,
  ELEM_HEIGHT,
  ELEM_WIDTH,
  ELEMENT_MARKER_TYPES,
  ELEMENT_TYPE_DATA
} from "../../const"
import {
  ChainLayerElement,
  IClickedElement,
  ICoordinate,
  LayerArrow,
  LayerElement
} from "../../model/types/FlowchartContainer"
import cls from "./Element.module.css"

interface ElementProps {
  element: LayerElement
  handleDelete: (item: LayerElement | LayerArrow) => void
  handleMove: (props: LayerElement, end: boolean) => void
  containerRef: React.RefObject<HTMLDivElement>
  setSelectedChain: (p: ChainLayerElement | null) => void
  selectedChain: ChainLayerElement | null
  handleChain: (
    chainedElementFrom: ChainLayerElement,
    chainedElementTo: ChainLayerElement
  ) => void
  handleSave: (el: any) => void
  setClickedElement: (p: IClickedElement | null) => void
  clickedElement: IClickedElement | null
}

const identifyMarkerCls = (markerType: "lt" | "up" | "rt" | "bt") => {
  switch (markerType) {
    case "lt":
      return cls.marker_left
    case "up":
      return cls.marker_up
    case "rt":
      return cls.marker_right
    default:
      return cls.marker_bottom
  }
}

export const Element = (props: ElementProps) => {
  const {
    element,
    handleDelete,
    handleMove,
    containerRef,
    setSelectedChain,
    selectedChain,
    handleChain,
    setClickedElement,
    clickedElement,
    handleSave
  } = props
  const [elementStartCoordinate, setElementStartCoordinate] =
    useState<ICoordinate>({
      left: 0,
      top: 0
    })
  const [isDragging, setIsDragging] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)
  const thisElementClicked = Boolean(
    clickedElement &&
      "elementId" in clickedElement.element &&
      clickedElement.element.elementId === element.elementId
  )
  const thisElementNotChained = Boolean(
    selectedChain && selectedChain?.elementId !== element.elementId
  )
  const thisElementIsChained = Boolean(
    selectedChain && selectedChain?.elementId === element.elementId
  )

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    setElementStartCoordinate({
      left: event.clientX - element.left + containerRef.current!.scrollLeft,
      top: event.clientY - element.top + containerRef.current!.scrollTop
    })
    setIsDragging(true)
    setSelectedChain(null)
    setClickedElement(null)
  }

  const handleDrag = (event: React.DragEvent<HTMLDivElement>) => {
    if (isDragging && event.screenX && event.screenY) {
      requestAnimationFrame(() => {
        const leftCoordinateOffset = Math.floor(
          event.nativeEvent.offsetX - elementStartCoordinate.left
        )
        const topCoordinateOffset = Math.floor(
          event.nativeEvent.offsetY - elementStartCoordinate.top
        )
        if (
          Math.abs(leftCoordinateOffset) >= CELL_SIZE ||
          Math.abs(topCoordinateOffset) >= CELL_SIZE
        ) {
          handleMove(
            {
              ...element,
              left:
                element.left +
                Math.round(leftCoordinateOffset / CELL_SIZE) * CELL_SIZE,
              top:
                element.top +
                Math.round(topCoordinateOffset / CELL_SIZE) * CELL_SIZE
            },
            false
          )
        }
      })
    }
  }

  const handleDragEnd = () => {
    handleMove(
      {
        ...element
      },
      true
    )
    setIsDragging(false)
  }

  return (
    <Popover
      placement="right"
      overlayInnerStyle={{ boxShadow: "none" }}
      showArrow={false}
      content={
        <>
          <div className={cls.popover_div}>
            <Select
              onChange={(e) => {
                handleSave({ ...element, elementData: { type: e } })
              }}
              options={ELEMENT_TYPE_DATA}
            />
          </div>
          <div
            className={cls.popover_div}
            style={{ marginTop: "15px" }}
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              className={cls.button_control}
              onClick={() => {
                handleDelete(element)
              }}
            >
              Удалить
            </Button>
          </div>
        </>
      }
      open={thisElementClicked}
    >
      <div
        style={{
          transform: `translate(${element.left}px, ${element.top}px)`,
          width: ELEM_WIDTH,
          height: ELEM_HEIGHT
        }}
        className={`${cls.element}`}
        draggable
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        ref={elementRef}
        onClick={() => {
          if (thisElementClicked) {
            setClickedElement(null)
          } else {
            setClickedElement({
              element
            })
          }
        }}
      >
        {(thisElementClicked || thisElementNotChained) &&
          ELEMENT_MARKER_TYPES.map((markerType) => (
            <div
              className={identifyMarkerCls(markerType)}
              onClick={(e) => {
                e.stopPropagation()
                if (
                  selectedChain &&
                  selectedChain.elementId !== element.elementId
                ) {
                  handleChain(selectedChain, {
                    ...element,
                    direction: markerType
                  })
                  setSelectedChain(null)
                  setClickedElement(null)
                } else {
                  setSelectedChain({ ...element, direction: markerType })
                  setClickedElement(null)
                }
              }}
            />
          ))}
        {thisElementIsChained &&
          ELEMENT_MARKER_TYPES.map((markerType) => {
            if (markerType === selectedChain!.direction) {
              return (
                <div
                  className={`${identifyMarkerCls(markerType)} ${
                    cls.selected_marker
                  }`}
                />
              )
            }
            return <></>
          })}
        <div className={cls.element_inner}></div>
      </div>
    </Popover>
  )
}
