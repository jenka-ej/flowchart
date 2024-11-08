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
import { CELL_SIZE, ELEM_HEIGHT, ELEM_WIDTH } from "../../const"
import {
  ElementGap,
  LayerArrow,
  LayerElement,
  LayerType
} from "../../model/types/FlowchartContainer"
import cls from "./Container.module.css"

interface IAvailableState {
  elements: LayerElement[]
  arrows: LayerArrow[]
  layerSize: { x: number; y: number }
  active: boolean
}

interface ContainerProps {
  className?: string
}

export const Container = memo((props: ContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const { className } = props

  const [zoom, setZoom] = useState(100)
  const [minimap, setMinimap] = useState(false)
  const [arrows, setArrows] = useState<LayerArrow[]>([])
  const [minimapScroll, setMinimapScroll] = useState({ left: 0, top: 0 })
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

  const handleAddElement = () => {
    let newElem = {
      left: CELL_SIZE + containerRef.current!.scrollLeft,
      top: CELL_SIZE + containerRef.current!.scrollTop,
      width: ELEM_WIDTH,
      height: ELEM_HEIGHT,
      element_id: Date.now(),
      element_data: {
        node_id: Date.now()
      }
    } as LayerElement

    setAvailableStates((prev) =>
      handleState(prev, "elements", [...elements, newElem])
    )
    setElements((prev) => [...prev, newElem])
  }

  const handleSaveElement = (element: LayerElement) => {
    setElements((prev) => {
      return prev.map((el) =>
        el.element_id === element.element_id
          ? { ...el, element_data: element }
          : el
      )
    })
  }

  const handleMoveElement = (props: ElementGap, end: boolean) => {
    const { element_id, left, top } = props

    if (end) {
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
              return { ...arrow, dots: [] }
            }
            return arrow
          })
        )
      )
    } else {
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
            return { ...arrow, dots: [] }
          }
          return arrow
        })
      )
    }
  }

  const handleDelete = (id: number | { from: number; to: number }) => {
    if (typeof id === "number") {
      setAvailableStates((prev) =>
        handleState(
          prev,
          "elements",
          elements.filter((el) => el.element_id !== id),
          "arrows",
          arrows.filter((arr) => arr.id_from !== id && arr.id_to !== id)
        )
      )
      setElements((prev) => prev.filter((el) => el.element_id !== id))
      setArrows((prev) =>
        prev.filter((arr) => arr.id_from !== id && arr.id_to !== id)
      )
    } else {
      setAvailableStates((prev) =>
        handleState(
          prev,
          "arrows",
          arrows.filter(
            (arr) => !(arr.id_from === id.from && arr.id_to === id.to)
          )
        )
      )
      setArrows((prev) =>
        prev.filter((arr) => !(arr.id_from === id.from && arr.id_to === id.to))
      )
    }
  }

  const handleChainElement = (
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
      onScroll={(e) => {
        setMinimapScroll({
          left: containerRef.current?.scrollLeft || 0,
          top: containerRef.current?.scrollTop || 0
        })
      }}
      className={cls.Container}
    >
      <div className={cls.pannel_wrapper}>
        <div className={cls.panel}>
          <Popover content="Добавить узел" trigger="hover">
            <Button
              icon={<PlusOutlined />}
              onClick={() => {
                handleAddElement()
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
    </div>
  )
})
