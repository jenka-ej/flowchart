import { useEffect, useLayoutEffect, useState } from "react"
import { ELEM_HEIGHT, ELEM_WIDTH } from "../../const"
import {
  ElementGap,
  ICoordinate,
  LayerArrow,
  LayerElement,
  LayerType
} from "../../model/types/FlowchartContainer"
import cls from "./Element.module.css"

interface ElementProps {
  element: LayerElement
  type: LayerType
  setSelected: (p: LayerElement | null) => void
  handleDelete: (item: LayerElement | LayerArrow) => void
  handleMove: (props: ElementGap) => void
  selected: LayerElement | null
  containerRef: React.RefObject<HTMLDivElement>
}

export const Element = (props: ElementProps) => {
  const { element, type, handleDelete, handleMove, setSelected, containerRef } =
    props
  const [elementStartCoordinate, setElementStartCoordinate] =
    useState<ICoordinate>({
      left: 0,
      top: 0
    })
  const [elementCoordinateOffset, setElementCoordinateOffset] =
    useState<ICoordinate>({
      left: 0,
      top: 0
    })
  const [elementMainCoordinate, setElementMainCoordinate] =
    useState<ICoordinate>({
      left: element.left,
      top: element.top
    })
  const [isDragging, setIsDragging] = useState(false)

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    setElementStartCoordinate({
      left:
        event.clientX -
        elementMainCoordinate.left +
        containerRef.current!.scrollLeft,
      top:
        event.clientY -
        elementMainCoordinate.top +
        containerRef.current!.scrollTop
    })
    setElementCoordinateOffset({
      left: 0,
      top: 0
    })
    setIsDragging(true)
  }

  const handleDrag = (event: React.DragEvent<HTMLDivElement>) => {
    if (isDragging && event.screenX && event.screenY) {
      requestAnimationFrame(() => {
        setElementCoordinateOffset({
          left: Math.floor(
            event.nativeEvent.offsetX - elementStartCoordinate.left
          ),
          top: Math.floor(
            event.nativeEvent.offsetY - elementStartCoordinate.top
          )
        })
      })
    }
  }

  const handleDragEnd = () => {
    handleMove({
      ...element,
      left: elementMainCoordinate.left,
      top: elementMainCoordinate.top
    })
    setIsDragging(false)
  }

  useLayoutEffect(() => {
    if (isDragging) {
      const newMainLeft =
        elementMainCoordinate.left + Math.round(elementCoordinateOffset.left)
      const newMainTop =
        elementMainCoordinate.top + Math.round(elementCoordinateOffset.top)
      setElementMainCoordinate({
        left: newMainLeft >= 0 ? newMainLeft : 0,
        top: newMainTop >= 0 ? newMainTop : 0
      })
    }
  }, [elementCoordinateOffset])

  useEffect(() => {
    setElementMainCoordinate({
      left: element.left,
      top: element.top
    })
  }, [element])

  return (
    <div
      style={{
        transform: `translate(${elementMainCoordinate.left}px, ${elementMainCoordinate.top}px)`,
        width: ELEM_WIDTH,
        height: ELEM_HEIGHT
      }}
      className={`${cls.element}`}
    >
      <div
        onClick={() => {
          if (type === LayerType.DEL) {
            handleDelete(element)
          }
          if (type === LayerType.ITM) {
            setSelected({ ...element })
          }
        }}
        draggable={type === LayerType.MOVE}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        key={element.element_id}
        style={{ width: "100%", height: "100%" }}
      >
        <div className={cls.element_inner}></div>
      </div>
    </div>
  )
}
