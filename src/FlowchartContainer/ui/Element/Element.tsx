import { useState } from "react"
import { ELEM_HEIGHT, ELEM_WIDTH } from "../../const"
import {
  ChainLayerElement,
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
  handleMove: (props: ElementGap, endMove: boolean) => void
  selected: LayerElement | null
  containerRef: React.RefObject<HTMLDivElement>
  setSelectedChain: (p: ChainLayerElement | null) => void
  selectedChain: ChainLayerElement | null
  handleChain: (
    chainedElementFrom: ChainLayerElement,
    chainedElementTo: ChainLayerElement
  ) => void
}

export const Element = (props: ElementProps) => {
  const {
    element,
    type,
    handleDelete,
    handleMove,
    setSelected,
    containerRef,
    setSelectedChain,
    selectedChain,
    handleChain
  } = props
  const [elementStartCoordinate, setElementStartCoordinate] =
    useState<ICoordinate>({
      left: 0,
      top: 0
    })
  const [isDragging, setIsDragging] = useState(false)

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    setElementStartCoordinate({
      left: event.clientX - element.left + containerRef.current!.scrollLeft,
      top: event.clientY - element.top + containerRef.current!.scrollTop
    })
    setIsDragging(true)
  }

  const handleDrag = (event: React.DragEvent<HTMLDivElement>) => {
    if (isDragging && event.screenX && event.screenY) {
      requestAnimationFrame(() => {
        const newMainLeft =
          element.left +
          Math.floor(event.nativeEvent.offsetX - elementStartCoordinate.left)
        const newMainTop =
          element.top +
          Math.floor(event.nativeEvent.offsetY - elementStartCoordinate.top)
        handleMove(
          {
            ...element,
            left: newMainLeft >= 0 ? newMainLeft : 0,
            top: newMainTop >= 0 ? newMainTop : 0
          },
          false
        )
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
    <div
      style={{
        transform: `translate(${element.left}px, ${element.top}px)`,
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
        <div className={cls.element_outer}>
          {type === LayerType.CHAIN && (
            <>
              <div
                className={cls.marker_left}
                onClick={() => {
                  if (
                    selectedChain &&
                    selectedChain.element_id !== element.element_id
                  ) {
                    handleChain(selectedChain, { ...element, direction: "lt" })
                    setSelectedChain(null)
                  } else {
                    setSelectedChain({ ...element, direction: "lt" })
                  }
                }}
              />
              <div
                className={cls.marker_right}
                onClick={() => {
                  if (
                    selectedChain &&
                    selectedChain.element_id !== element.element_id
                  ) {
                    handleChain(selectedChain, { ...element, direction: "rt" })
                    setSelectedChain(null)
                  } else {
                    setSelectedChain({ ...element, direction: "rt" })
                  }
                }}
              />
            </>
          )}
          <div className={cls.element_inner}></div>
        </div>
      </div>
    </div>
  )
}
