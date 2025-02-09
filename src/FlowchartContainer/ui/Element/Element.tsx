import { Input, Popover } from "antd"
import { useRef, useState } from "react"
import {
  CELL_SIZE,
  ELEM_HEIGHT,
  ELEM_WIDTH,
  ELEMENT_MARKER_TYPES
} from "../../const"
import {
  ChainLayerElement,
  ICoordinate,
  LayerArrow,
  LayerElement
} from "../../model/types/FlowchartContainer"
import cls from "./Element.module.css"

interface ElementProps {
  element: LayerElement
  handleMove: (element: LayerElement, end: boolean) => void
  containerRef: React.RefObject<HTMLDivElement>
  setSelectedChain: (p: ChainLayerElement | null) => void
  selectedChain: ChainLayerElement | null
  handleChain: (
    chainedElementFrom: ChainLayerElement,
    chainedElementTo: ChainLayerElement
  ) => void
  handleSave: (element: LayerElement) => void
  setClickedElement: (p: LayerElement | LayerArrow | null) => void
  clickedElement: LayerElement | LayerArrow | null
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
      "elementId" in clickedElement &&
      clickedElement.elementId === element.elementId
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
      open={thisElementClicked}
      content={
        <Input
          value={element.elementData?.name}
          onChange={(e) => {
            handleSave({ ...element, elementData: { name: e.target.value } })
          }}
        />
      }
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
            setClickedElement(element)
          }
        }}
      >
        {(thisElementClicked || thisElementNotChained) &&
          ELEMENT_MARKER_TYPES.map((markerType) => (
            <div
              className={identifyMarkerCls(markerType)}
              onClick={() => {
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
        {isDragging ? (
          <div className={cls.element_inner_dragging} />
        ) : (
          <div className={cls.element_inner}>{element.elementData?.name}</div>
        )}
      </div>
    </Popover>
  )
}
