import { useRef, useState } from "react"
import { v4 } from "uuid"
import { ELEM_WIDTH } from "../../../const"
import {
  IAvailableState,
  IFlowchartArrow,
  IFlowchartElement,
  TChainFlowchartElement
} from "../../../model/types"

export const useContainer = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const layerRef = useRef<HTMLDivElement>(null)

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
    x: 4000,
    y: 2500
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

  const handleChainFinal = (
    chainedElementFrom: TChainFlowchartElement,
    chainedElementTo: TChainFlowchartElement
  ) => {
    const newArrow: IFlowchartArrow = {
      idElementFrom: chainedElementFrom.elementId,
      idElementTo: chainedElementTo.elementId,
      arrowId: v4(),
      positionFrom: chainedElementFrom.direction,
      positionTo: chainedElementTo.direction
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

  const handleMoveElement = (element: IFlowchartElement) => {
    setElements((mainElements) =>
      mainElements.map((mainElement) =>
        mainElement.elementId === element.elementId
          ? {
              ...mainElement,
              ...element
            }
          : mainElement
      )
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
    handleChainFinal,
    handleUndoOrRedoMove,
    elementIdsConnectedWithClickedElement,
    handleKeyPress
  }
}
