import { useRef } from "react"
import { roundDigitForPosition } from "../../../lib"
import {
  ICoordinate,
  IElementProps,
  TChainFlowchartElement
} from "../../../model/types"

export const useElement = ({
  element,
  handleMoveElement,
  handleMoveElementEnd,
  containerRef,
  clickedItem,
  setClickedItem,
  handleDeleteItem,
  selectedChain,
  setSelectedChain,
  handleChainFinal,
  thisElementIsConnectedWithClickedElement,
  chainSelectedAndThisElementIsChained,
  chainSelectedAndThisElementNotChained
}: IElementProps) => {
  const mouseStartPositionForElement = useRef<ICoordinate>({
    left: 0,
    top: 0
  })

  const mouseNextPositionForElement = useRef<ICoordinate>({
    left: element.left,
    top: element.top
  })

  const isDraggingElement = useRef(false)
  const justDraggedElement = useRef(false)

  const elementRef = useRef<HTMLDivElement>(null)

  const animationFrameElement = useRef<number | null>(null)

  const thisElementClicked = Boolean(
    clickedItem &&
      "elementId" in clickedItem &&
      clickedItem.elementId === element.elementId
  )

  const handleChainElementStart = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation()
    setSelectedChain({ ...element, direction: "rt" })
    setClickedItem(null)
  }

  const handleChainElementEnd = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation()
    handleChainFinal(selectedChain as TChainFlowchartElement, {
      ...element,
      direction: "lt"
    })
    setSelectedChain(null)
    setClickedItem(null)
  }

  const handlePointerDownElement = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation()
    const rect = elementRef.current!.getBoundingClientRect()

    mouseStartPositionForElement.current = {
      left: e.clientX - rect.left,
      top: e.clientY - rect.top
    }

    isDraggingElement.current = true
    justDraggedElement.current = false

    elementRef.current!.setPointerCapture(e.pointerId)

    if (
      !(
        clickedItem &&
        "elementId" in clickedItem &&
        clickedItem.elementId === element.elementId
      )
    ) {
      setClickedItem(null)
    }
  }

  const handlePointerMoveElement = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation()
    if (!isDraggingElement.current || !containerRef.current) return

    const scrollX = containerRef.current.scrollLeft
    const scrollY = containerRef.current.scrollTop

    const newX = roundDigitForPosition(
      e.clientX - mouseStartPositionForElement.current.left + scrollX
    )
    const newY = roundDigitForPosition(
      e.clientY - mouseStartPositionForElement.current.top + scrollY
    )

    if (element.left === newX && element.top === newY) return

    justDraggedElement.current = true

    mouseNextPositionForElement.current = {
      left: newX,
      top: newY
    }

    if (!animationFrameElement.current) {
      animationFrameElement.current = requestAnimationFrame(() => {
        handleMoveElement({
          ...element,
          ...mouseNextPositionForElement.current
        })
        animationFrameElement.current = null
      })
    }
  }

  const handlePointerUpElement = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation()
    if (!isDraggingElement.current) return

    isDraggingElement.current = false
    elementRef.current!.releasePointerCapture(e.pointerId)

    if (!justDraggedElement.current) return

    handleMoveElementEnd({ ...element, ...mouseNextPositionForElement.current })

    if (animationFrameElement.current) {
      cancelAnimationFrame(animationFrameElement.current)
      animationFrameElement.current = null
    }

    setTimeout(() => {
      justDraggedElement.current = false
    }, 100)
  }

  const handleClickElement = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (justDraggedElement.current) {
      e.preventDefault()
      e.stopPropagation()
      return
    }
    if (thisElementClicked) {
      setClickedItem(null)
    } else {
      setClickedItem(element)
    }
  }

  const elementStyles = () => {
    if (clickedItem && "elementId" in clickedItem) {
      if (clickedItem.elementId === element.elementId) {
        return {
          backgroundColor: "#e7f2ff",
          boxShadow: "#1677ff 0px 0px 0px 3px"
        }
      }
      if (thisElementIsConnectedWithClickedElement) {
        return {
          backgroundColor: "#ffffff",
          boxShadow: "#1677ff 0px 0px 0px 3px"
        }
      }
      return {
        backgroundColor: "#ffffff",
        boxShadow: "rgb(228 228 228) 0px 0px 0px 3px"
      }
    }
    if (clickedItem && "arrowId" in clickedItem) {
      if (
        clickedItem.idElementFrom === element.elementId ||
        clickedItem.idElementTo === element.elementId
      ) {
        return {
          backgroundColor: "#ffffff",
          boxShadow: "#1677ff 0px 0px 0px 3px"
        }
      }
      return {
        backgroundColor: "#ffffff",
        boxShadow: "rgb(228 228 228) 0px 0px 0px 3px"
      }
    }
    return {
      backgroundColor: "#ffffff",
      boxShadow: "#3E004E 0px 0px 2px 2px"
    }
  }

  return {
    elementStyles,
    isDraggingElement,
    justDraggedElement,
    handlePointerDownElement,
    handlePointerMoveElement,
    handlePointerUpElement,
    elementRef,
    thisElementClicked,
    chainSelectedAndThisElementIsChained,
    chainSelectedAndThisElementNotChained,
    handleDeleteItem,
    handleChainElementStart,
    handleChainElementEnd,
    selectedChain,
    element,
    clickedItem,
    setClickedItem,
    handleClickElement
  }
}
