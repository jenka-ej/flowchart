import { PlusOutlined, RedoOutlined, UndoOutlined } from "@ant-design/icons"
import { Button, Popover } from "antd"
import { memo, useRef, useState } from "react"
import { ELEM_WIDTH } from "../../const"
import {
  ChainLayerElement,
  LayerArrow,
  LayerElement
} from "../../model/types/FlowchartContainer"
import { Layer } from "../Layer/Layer"
import cls from "./Container.module.css"

interface IAvailableState {
  elements: LayerElement[]
  arrows: LayerArrow[]
  active: boolean
}

export const Container = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [arrows, setArrows] = useState<LayerArrow[]>([])
  const [elements, setElements] = useState<LayerElement[]>([])
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
  const [clickedElement, setClickedElement] = useState<
    LayerElement | LayerArrow | null
  >(null)
  const [selectedChain, setSelectedChain] = useState<ChainLayerElement | null>(
    null
  )

  const handleState = (
    prev: IAvailableState[],
    key: keyof IAvailableState,
    value: LayerArrow[] | LayerElement[],
    key2?: keyof IAvailableState,
    value2?: LayerArrow[] | LayerElement[]
  ) => {
    const findPreviousState = prev.find(({ active }) => active)!
    const findPreviousStateIndex = prev.findIndex(({ active }) => active)!
    const newState = key2
      ? {
          ...findPreviousState,
          [key]: value,
          [key2]: value2
        }
      : {
          ...findPreviousState,
          [key]: value
        }
    const baseAvailableStates = prev.slice(0, findPreviousStateIndex + 1)
    const newAvailableStates =
      baseAvailableStates.length === 10
        ? [...baseAvailableStates.slice(1), newState]
        : [...baseAvailableStates, newState]
    return newAvailableStates.map((el, i) => ({
      ...el,
      active: i === newAvailableStates.length - 1
    }))
  }

  const handleAdd = () => {
    const newElement: LayerElement = {
      left: ELEM_WIDTH + containerRef.current!.scrollLeft,
      top: ELEM_WIDTH + containerRef.current!.scrollTop,
      elementId: Date.now(),
      elementData: {
        name: `Элемент №${elements.length + 1}`
      }
    }

    setAvailableStates((prev) =>
      handleState(prev, "elements", [...elements, newElement])
    )
    setElements((prev) => [...prev, newElement])
  }

  const handleSave = (element: LayerElement) => {
    setElements((prev) => {
      return prev.map((el) =>
        el.elementId === element.elementId ? { ...el, ...element } : el
      )
    })
  }

  const handleMove = (element: LayerElement, end: boolean) => {
    const { elementId, left, top } = element

    if (end) {
      setAvailableStates((prev) =>
        handleState(
          prev,
          "elements",
          elements.map((el) =>
            el.elementId === elementId ? { ...el, left, top } : el
          ),
          "arrows",
          arrows.map((arrow) => {
            if (
              arrow.idElementFrom === elementId ||
              arrow.idElementTo === elementId
            ) {
              return { ...arrow }
            }
            return arrow
          })
        )
      )
    } else {
      setElements((prev) =>
        prev.map((el) =>
          el.elementId === elementId
            ? {
                ...el,
                left,
                top
              }
            : el
        )
      )
      setArrows((prev) =>
        prev.map((arrow) => {
          if (
            arrow.idElementFrom === elementId ||
            arrow.idElementTo === elementId
          ) {
            return { ...arrow }
          }
          return arrow
        })
      )
    }

    if (Math.round((left * 100) / layerSize.x) > 70) {
      setLayerSize({ ...layerSize, x: Math.round(layerSize.x + 300) })
    }
    if (Math.round((top * 100) / layerSize.y) > 70) {
      setLayerSize({ ...layerSize, y: Math.round(layerSize.y + 300) })
    }
  }

  const handleDelete = (item: LayerElement | LayerArrow) => {
    if ("elementId" in item) {
      setAvailableStates((prev) =>
        handleState(
          prev,
          "elements",
          elements.filter((element) => element.elementId !== item.elementId),
          "arrows",
          arrows.filter(
            (arrow) =>
              arrow.idElementFrom !== item.elementId &&
              arrow.idElementTo !== item.elementId
          )
        )
      )
      setElements((prev) =>
        prev.filter((element) => element.elementId !== item.elementId)
      )
      setArrows((prev) =>
        prev.filter(
          (arrow) =>
            arrow.idElementFrom !== item.elementId &&
            arrow.idElementTo !== item.elementId
        )
      )
    } else {
      setAvailableStates((prev) =>
        handleState(
          prev,
          "arrows",
          arrows.filter(
            (arrow) =>
              !(
                arrow.idElementFrom === item.idElementFrom &&
                arrow.idElementTo === item.idElementTo
              )
          )
        )
      )
      setArrows((prev) =>
        prev.filter(
          (arrow) =>
            !(
              arrow.idElementFrom === item.idElementFrom &&
              arrow.idElementTo === item.idElementTo
            )
        )
      )
    }
  }

  const handleChain = (
    chainedElementFrom: ChainLayerElement,
    chainedElementTo: ChainLayerElement
  ) => {
    setAvailableStates((prev) =>
      handleState(
        prev,
        "arrows",
        arrows.some(
          (arrow) =>
            arrow.idElementFrom === chainedElementFrom.elementId &&
            arrow.idElementTo === chainedElementTo.elementId
        )
          ? arrows
          : [
              ...arrows,
              {
                idElementFrom: chainedElementFrom.elementId,
                idElementTo: chainedElementTo.elementId,
                arrowId: Date.now(),
                positionFrom: chainedElementFrom.direction,
                positionTo: chainedElementTo.direction
              }
            ]
      )
    )
    setArrows((prev) =>
      prev.some(
        (arrow) =>
          arrow.idElementFrom === chainedElementFrom.elementId &&
          arrow.idElementTo === chainedElementTo.elementId
      )
        ? prev
        : [
            ...prev,
            {
              idElementFrom: chainedElementFrom.elementId,
              idElementTo: chainedElementTo.elementId,
              arrowId: Date.now(),
              positionFrom: chainedElementFrom.direction,
              positionTo: chainedElementTo.direction
            }
          ]
    )
  }

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      className={cls.Container}
      onKeyDown={(e) => {
        if (e.code === "Escape") {
          setClickedElement(null)
          setSelectedChain(null)
        } else if (e.code === "Delete") {
          if (clickedElement) {
            handleDelete(clickedElement)
            setSelectedChain(null)
            setClickedElement(null)
          }
        }
      }}
    >
      <div className={cls.pannel_wrapper}>
        <div className={cls.panel}>
          <Popover content="Добавить узел" trigger="hover">
            <Button
              icon={<PlusOutlined />}
              onClick={() => {
                handleAdd()
                setSelectedChain(null)
                setClickedElement(null)
              }}
            />
          </Popover>
          <Popover content="Назад" trigger="hover">
            <Button
              icon={<UndoOutlined />}
              disabled={
                availableStates.length < 2 ||
                availableStates[0].active ||
                (availableStates.length === 10 && availableStates[1].active)
              }
              onClick={() => {
                const findNextStateIndex =
                  availableStates.findIndex(({ active }) => active) - 1
                setElements(availableStates[findNextStateIndex].elements)
                setArrows(availableStates[findNextStateIndex].arrows)
                setAvailableStates((prev) =>
                  prev.map((state, index) => ({
                    ...state,
                    active: index === findNextStateIndex
                  }))
                )
                setSelectedChain(null)
                setClickedElement(null)
              }}
            />
          </Popover>
          <Popover content="Вперёд" trigger="hover">
            <Button
              icon={<RedoOutlined />}
              disabled={
                availableStates.length < 2 ||
                availableStates[availableStates.length - 1].active
              }
              onClick={() => {
                const findNextStateIndex =
                  availableStates.findIndex(({ active }) => active) + 1
                setElements(availableStates[findNextStateIndex].elements)
                setArrows(availableStates[findNextStateIndex].arrows)
                setAvailableStates((prev) =>
                  prev.map((state, index) => ({
                    ...state,
                    active: index === findNextStateIndex
                  }))
                )
                setSelectedChain(null)
                setClickedElement(null)
              }}
            />
          </Popover>
        </div>
      </div>
      <Layer
        height={layerSize.y}
        width={layerSize.x}
        elements={elements}
        handleSave={handleSave}
        handleMove={handleMove}
        handleChain={handleChain}
        arrows={arrows}
        containerRef={containerRef}
        setClickedElement={setClickedElement}
        clickedElement={clickedElement}
        selectedChain={selectedChain}
        setSelectedChain={setSelectedChain}
      />
    </div>
  )
})
