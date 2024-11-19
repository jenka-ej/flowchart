import {
  DeleteOutlined,
  EditOutlined,
  FullscreenOutlined,
  InfoCircleOutlined,
  MinusOutlined,
  NodeIndexOutlined,
  PlusOutlined,
  RedoOutlined,
  SwitcherOutlined,
  UndoOutlined
} from "@ant-design/icons"
import { Button, Popover } from "antd"
import { memo, useRef, useState } from "react"
import { ELEM_HEIGHT, ELEM_WIDTH } from "../../const"
import {
  ElementGap,
  LayerArrow,
  LayerElement,
  LayerType
} from "../../model/types/FlowchartContainer"
import { Layer } from "../Layer/Layer"
import cls from "./Container.module.css"

interface IAvailableState {
  elements: LayerElement[]
  arrows: LayerArrow[]
  layerSize: { x: number; y: number }
  active: boolean
}

export const Container = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(100)
  const [arrows, setArrows] = useState<LayerArrow[]>([])
  const [elements, setElements] = useState<LayerElement[]>([])
  const [availableStates, setAvailableStates] = useState<IAvailableState[]>([
    {
      elements: [],
      arrows: [],
      layerSize: {
        x: ELEM_WIDTH * 10,
        y: ELEM_HEIGHT * 10
      },
      active: true
    }
  ])
  const [type, setType] = useState<LayerType>(LayerType.DRG)
  const [layerSize, setLayerSize] = useState({
    x: ELEM_WIDTH * 10,
    y: ELEM_HEIGHT * 10
  })

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
      element_id: Date.now(),
      element_data: {
        node_id: Date.now()
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
        el.element_id === element.element_id
          ? { ...el, element_data: element }
          : el
      )
    })
  }

  const handleMove = (props: ElementGap) => {
    const { element_id, left, top } = props

    setAvailableStates((prev) =>
      handleState(
        prev,
        "elements",
        elements.map((el) =>
          el.element_id === element_id ? { ...el, left, top } : el
        ),
        "arrows",
        arrows.map((arrow) => {
          if (arrow.id_from === element_id || arrow.id_to === element_id) {
            return { ...arrow }
          }
          return arrow
        })
      )
    )
    setElements((prev) =>
      prev.map((el) =>
        el.element_id === element_id
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
        if (arrow.id_from === element_id || arrow.id_to === element_id) {
          return { ...arrow }
        }
        return arrow
      })
    )
  }

  const handleDelete = (item: LayerElement | LayerArrow) => {
    if ("element_id" in item) {
      setAvailableStates((prev) =>
        handleState(
          prev,
          "elements",
          elements.filter((element) => element.element_id !== item.element_id),
          "arrows",
          arrows.filter(
            (arrow) =>
              arrow.id_from !== item.element_id &&
              arrow.id_to !== item.element_id
          )
        )
      )
      setElements((prev) =>
        prev.filter((element) => element.element_id !== item.element_id)
      )
      setArrows((prev) =>
        prev.filter(
          (arrow) =>
            arrow.id_from !== item.element_id && arrow.id_to !== item.element_id
        )
      )
    } else {
      setAvailableStates((prev) =>
        handleState(
          prev,
          "arrows",
          arrows.filter(
            (arrow) =>
              !(arrow.id_from === item.id_from && arrow.id_to === item.id_to)
          )
        )
      )
      setArrows((prev) =>
        prev.filter(
          (arrow) =>
            !(arrow.id_from === item.id_from && arrow.id_to === item.id_to)
        )
      )
    }
  }

  const handleChain = (
    from: number,
    to: number,
    dir_from: "lt" | "rt",
    dir_to: "lt" | "rt"
  ) => {
    setAvailableStates((prev) =>
      handleState(
        prev,
        "arrows",
        arrows.some((el) => el.id_from === from && el.id_to === to)
          ? arrows
          : [
              ...arrows,
              {
                id_from: from,
                id_to: to,
                id: Date.now(),
                pos_from: dir_from,
                pos_to: dir_to
              }
            ]
      )
    )
    setArrows((prev) =>
      prev.some((el) => el.id_from === from && el.id_to === to)
        ? prev
        : [
            ...prev,
            {
              id_from: from,
              id_to: to,
              id: Date.now(),
              pos_from: dir_from,
              pos_to: dir_to
            }
          ]
    )
  }

  return (
    <div
      ref={containerRef}
      style={{
        cursor: type === LayerType.DRG ? "grab" : "auto"
      }}
      className={cls.Container}
    >
      <div className={cls.pannel_wrapper}>
        <div className={cls.panel}>
          <Popover content="Добавить узел" trigger="hover">
            <Button
              icon={<PlusOutlined />}
              onClick={() => {
                handleAdd()
              }}
            />
          </Popover>
          <Popover content="Переместить узел/связь" trigger="hover">
            <Button
              icon={<SwitcherOutlined />}
              type={type === LayerType.MOVE ? "primary" : "default"}
              onClick={() => {
                setType(LayerType.MOVE)
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
                setLayerSize(availableStates[findNextStateIndex].layerSize)
                setAvailableStates((prev) =>
                  prev.map((state, index) => ({
                    ...state,
                    active: index === findNextStateIndex
                  }))
                )
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
                setLayerSize(availableStates[findNextStateIndex].layerSize)
                setAvailableStates((prev) =>
                  prev.map((state, index) => ({
                    ...state,
                    active: index === findNextStateIndex
                  }))
                )
              }}
            />
          </Popover>
          <Popover content="Образовать связь" trigger="hover">
            <Button
              icon={<NodeIndexOutlined />}
              type={type === LayerType.CHAIN ? "primary" : "default"}
              onClick={() => {
                setType(LayerType.CHAIN)
              }}
            />
          </Popover>
          <Popover content="Просмотреть процесс" trigger="hover">
            <Button
              icon={<FullscreenOutlined />}
              type={type === LayerType.DRG ? "primary" : "default"}
              onClick={() => {
                setType(LayerType.DRG)
              }}
            />
          </Popover>
          <Popover content="Редактировать узел/связь" trigger="hover">
            <Button
              icon={<EditOutlined />}
              type={type === LayerType.ITM ? "primary" : "default"}
              onClick={() => {
                setType(LayerType.ITM)
              }}
            />
          </Popover>
          <Popover content="Удалить узел/связь" trigger="hover">
            <Button
              icon={<DeleteOutlined />}
              type={type === LayerType.DEL ? "primary" : "default"}
              onClick={() => {
                setType(LayerType.DEL)
              }}
            />
          </Popover>
        </div>
        <div
          className={cls.panel}
          style={{
            position: "relative",
            left: "calc(100% - 290px)",
            top: "-42px"
          }}
        >
          <Button
            icon={<InfoCircleOutlined />}
            type={type === LayerType.INFO ? "primary" : "default"}
            onClick={() => {
              setType(LayerType.INFO)
            }}
          >
            Информация
          </Button>
        </div>
        <div
          className={cls.panel_scale}
          style={{
            position: "relative",
            left: "calc(100% - 144px)",
            bottom: "calc(100% - 540px)"
          }}
        >
          <Button
            icon={<MinusOutlined />}
            onClick={() => {
              setZoom((prev) => (prev === 50 ? prev : prev - 5))
            }}
          />
          <h3 style={{ margin: "0", width: "50px", textAlign: "center" }}>
            {zoom} %
          </h3>
          <Button
            icon={<PlusOutlined />}
            onClick={() => {
              setZoom((prev) => (prev === 100 ? prev : prev + 5))
            }}
          />
        </div>
      </div>
      <Layer
        type={type}
        height={layerSize.y}
        width={layerSize.x}
        elements={elements}
        handleSave={handleSave}
        handleDelete={handleDelete}
        handleMove={handleMove}
        handleChain={handleChain}
        setType={setType}
        zoom={zoom}
        arrows={arrows}
        containerRef={containerRef}
      />
    </div>
  )
})
