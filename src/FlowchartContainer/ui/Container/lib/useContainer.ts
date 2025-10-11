import { useEffect, useRef, useState } from "react"
import { v4 } from "uuid"
import { ELEM_WIDTH } from "../../../const"
import { getDefaultDots } from "../../../lib"
import {
  IAvailableState,
  IFlowchartArrow,
  IFlowchartElement,
  TChainFlowchartElement,
  TFlowchartDot
} from "../../../model/types"

export const useContainer = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const layerRef = useRef<HTMLDivElement>(null)

  const [zoom, setZoom] = useState<number>(1)

  const [elements, setElements] = useState<IFlowchartElement[]>([])

  const [arrows, setArrows] = useState<IFlowchartArrow[]>([])

  const [availableStates, setAvailableStates] = useState<IAvailableState[]>([
    {
      elements: [],
      arrows: [],
      active: true
    }
  ])

  const [layerSize, setLayerSize] = useState({
    x: 2000,
    y: 1000
  })

  const [clickedItem, setClickedItem] = useState<
    IFlowchartElement | IFlowchartArrow | null
  >(null)

  const [selectedChain, setSelectedChain] =
    useState<TChainFlowchartElement | null>(null)

  const elementIdsConnectedWithClickedElement = clickedItem &&
    "elementId" in clickedItem && [
      ...new Set(
        arrows
          .reduce((acc: string[], mainArrow) => {
            if (
              mainArrow.idElementFrom === clickedItem.elementId ||
              mainArrow.idElementTo === clickedItem.elementId
            ) {
              return [...acc, mainArrow.idElementFrom, mainArrow.idElementTo]
            }
            return acc
          }, [])
          .filter((elementId: string) => elementId !== clickedItem.elementId)
      )
    ]

  const getOrderForArrows = () => {
    if (!clickedItem) return arrows

    const isLast = (mainArrow: IFlowchartArrow) => {
      if ("arrowId" in clickedItem) {
        return mainArrow.arrowId === clickedItem.arrowId
      }
      return (
        mainArrow.idElementFrom === clickedItem.elementId ||
        mainArrow.idElementTo === clickedItem.elementId
      )
    }

    return structuredClone(arrows).sort((a, b) =>
      isLast(a) === isLast(b) ? 0 : isLast(a) ? 1 : -1
    )
  }

  const handleState = (
    mainAvailableStates: IAvailableState[],
    changedObj: { elements?: IFlowchartElement[]; arrows?: IFlowchartArrow[] }
  ) => {
    const findPreviousState = mainAvailableStates.find(({ active }) => active)!
    const findPreviousStateIndex = mainAvailableStates.findIndex(
      ({ active }) => active
    )!
    const newState = {
      ...findPreviousState,
      ...changedObj
    }
    const baseAvailableStates = mainAvailableStates.slice(
      0,
      findPreviousStateIndex + 1
    )
    const newAvailableStates =
      baseAvailableStates.length === 10
        ? [...baseAvailableStates.slice(1), newState]
        : [...baseAvailableStates, newState]
    return newAvailableStates.map((el, i) => ({
      ...el,
      active: i === newAvailableStates.length - 1
    }))
  }

  const handleAddElement = () => {
    const newElement: IFlowchartElement = {
      left: ELEM_WIDTH + containerRef.current!.scrollLeft,
      top: ELEM_WIDTH + containerRef.current!.scrollTop,
      elementId: v4(),
      elementData: {
        name: `Элемент №${elements.length + 1}`
      }
    }

    setAvailableStates((mainAvailableStates) =>
      handleState(mainAvailableStates, {
        elements: [...elements, newElement],
        arrows
      })
    )

    setElements((mainElements) => [...mainElements, newElement])
  }

  const handleDeleteItem = (item: IFlowchartElement | IFlowchartArrow) => {
    if ("elementId" in item) {
      setAvailableStates((mainAvailableStates) =>
        handleState(mainAvailableStates, {
          elements: elements.filter(
            (element) => element.elementId !== item.elementId
          ),
          arrows: arrows.filter(
            (arrow) =>
              arrow.idElementFrom !== item.elementId &&
              arrow.idElementTo !== item.elementId
          )
        })
      )

      setElements((mainElements) =>
        mainElements.filter(
          (mainElement) => mainElement.elementId !== item.elementId
        )
      )

      setArrows((mainArrows) =>
        mainArrows.filter(
          (mainArrow) =>
            mainArrow.idElementFrom !== item.elementId &&
            mainArrow.idElementTo !== item.elementId
        )
      )
    } else {
      setAvailableStates((mainAvailableStates) =>
        handleState(mainAvailableStates, {
          arrows: arrows.filter(
            (arrow) =>
              !(
                arrow.idElementFrom === item.idElementFrom &&
                arrow.idElementTo === item.idElementTo
              )
          )
        })
      )

      setArrows((mainArrows) =>
        mainArrows.filter(
          (mainArrow) =>
            !(
              mainArrow.idElementFrom === item.idElementFrom &&
              mainArrow.idElementTo === item.idElementTo
            )
        )
      )
    }
  }

  const handleChain = (
    chainedElementFrom: TChainFlowchartElement,
    chainedElementTo: TChainFlowchartElement
  ) => {
    const newArrow: IFlowchartArrow = {
      idElementFrom: chainedElementFrom.elementId,
      idElementTo: chainedElementTo.elementId,
      arrowId: v4(),
      positionFrom: chainedElementFrom.direction,
      positionTo: chainedElementTo.direction,
      dots: getDefaultDots(
        {
          idElementFrom: chainedElementFrom.elementId,
          idElementTo: chainedElementTo.elementId,
          positionFrom: chainedElementFrom.direction,
          positionTo: chainedElementTo.direction
        },
        arrows,
        elements,
        true
      )
    }

    setAvailableStates((mainAvailableStates) =>
      handleState(mainAvailableStates, {
        arrows: arrows.some(
          (arrow) =>
            arrow.idElementFrom === chainedElementFrom.elementId &&
            arrow.idElementTo === chainedElementTo.elementId
        )
          ? arrows
          : [...arrows, newArrow]
      })
    )

    setArrows((mainArrows) =>
      mainArrows.some(
        (mainArrow) =>
          mainArrow.idElementFrom === chainedElementFrom.elementId &&
          mainArrow.idElementTo === chainedElementTo.elementId
      )
        ? mainArrows
        : [...mainArrows, newArrow]
    )
  }

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const container = containerRef.current
    const layer = layerRef.current
    if (!container || !layer || !e.ctrlKey) return

    e.preventDefault()

    const offsetZoom = e.deltaY > 0 ? -0.05 : 0.05
    let newZoom = Math.round((zoom + offsetZoom) * 100) / 100
    newZoom = Math.max(1, Math.min(2, newZoom))
    setZoom(newZoom)
  }

  const updateElement = (
    mainElements: IFlowchartElement[],
    element: IFlowchartElement
  ) =>
    mainElements.map((mainElement) =>
      mainElement.elementId === element.elementId
        ? {
            ...mainElement,
            ...element
          }
        : mainElement
    )

  const handleMoveElement = (element: IFlowchartElement) => {
    setElements((mainElements) => updateElement(mainElements, element))
    setArrows((mainArrows) =>
      mainArrows.map((mainArrow) => {
        if (
          mainArrow.idElementFrom === element.elementId ||
          mainArrow.idElementTo === element.elementId
        ) {
          return {
            ...mainArrow,
            dots: getDefaultDots(
              mainArrow,
              arrows,
              updateElement(elements, element),
              false
            )
          }
        }
        return mainArrow
      })
    )
  }

  const handleMoveElementEnd = (element: IFlowchartElement) => {
    setAvailableStates((mainAvailableStates) =>
      handleState(mainAvailableStates, {
        elements,
        arrows
      })
    )

    if (element.left + 300 > layerSize.x) {
      setLayerSize((mainLayerSize) => ({
        ...mainLayerSize,
        x: Math.round(layerSize.x + 300)
      }))
    }

    if (element.top + 300 > layerSize.y) {
      setLayerSize((mainLayerSize) => ({
        ...mainLayerSize,
        y: Math.round(layerSize.y + 300)
      }))
    }
  }

  const updateDotInArrow = (
    mainArrows: IFlowchartArrow[],
    arrow: IFlowchartArrow,
    dot: TFlowchartDot,
    changedField?: { [key: string]: any }
  ) =>
    mainArrows.map((mainArrow) => {
      if (mainArrow.arrowId === arrow.arrowId) {
        return {
          ...mainArrow,
          dots: mainArrow.dots.map((mainDot) => {
            if (mainDot.dotId === dot.dotId) {
              if (changedField) {
                return { ...dot, ...changedField }
              }
              return dot
            }
            return mainDot
          })
        }
      }
      return mainArrow
    })

  const handleMoveDotStart = (arrow: IFlowchartArrow, dot: TFlowchartDot) => {
    setArrows((mainArrows) =>
      updateDotInArrow(mainArrows, arrow, dot, { type: "extra" })
    )
  }

  const handleMoveDot = (arrow: IFlowchartArrow, dot: TFlowchartDot) => {
    setArrows((mainArrows) => updateDotInArrow(mainArrows, arrow, dot))
  }

  const handleMoveDotEnd = () => {
    setAvailableStates((mainAvailableStates) =>
      handleState(mainAvailableStates, { arrows })
    )
  }

  const handleUndoOrRedoMove = (type: string) => {
    const findNextStateIndex =
      type === "undo"
        ? availableStates.findIndex(({ active }) => active) - 1
        : availableStates.findIndex(({ active }) => active) + 1
    setElements(availableStates[findNextStateIndex].elements)
    setArrows(availableStates[findNextStateIndex].arrows)
    setAvailableStates((prev) =>
      prev.map((state, index) => ({
        ...state,
        active: index === findNextStateIndex
      }))
    )
  }

  const handleKeyPress = async (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.code === "Escape") {
      setClickedItem(null)
      setSelectedChain(null)
    } else if (e.code === "Delete" && clickedItem) {
      handleDeleteItem(clickedItem)
      setSelectedChain(null)
      setClickedItem(null)
    }
  }

  useEffect(() => {
    const handler = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault()
      }
    }

    const el = containerRef.current
    if (el) {
      el.addEventListener("wheel", handler, { passive: false, capture: true })
    }

    return () => {
      if (el) {
        el.removeEventListener("wheel", handler, true)
      }
    }
  }, [])

  return {
    elements,
    arrows,
    getOrderForArrows,
    containerRef,
    layerRef,
    availableStates,
    layerSize,
    handleMoveElement,
    handleMoveElementEnd,
    clickedItem,
    setClickedItem,
    selectedChain,
    setSelectedChain,
    handleAddElement,
    handleDeleteItem,
    handleChain,
    handleMoveDotStart,
    handleMoveDot,
    handleMoveDotEnd,
    handleUndoOrRedoMove,
    elementIdsConnectedWithClickedElement,
    handleKeyPress,
    zoom,
    handleWheel
  }
}
