import { useState } from "react"
import {
  ElementGap,
  LayerArrow,
  LayerElement,
  LayerType
} from "../../model/types/FlowchartContainer"
import { Element } from "../Element/Element"
import cls from "./Layer.module.css"

interface LayerProps {
  width: number
  zoom: number
  height: number
  type: LayerType
  elements: LayerElement[]
  arrows: LayerArrow[]
  setType: (p: LayerType) => void
  handleMove: (props: ElementGap) => void
  handleDelete: (id: number | { from: number; to: number }) => void
  handleSave: (el: any) => void
  handleChain: (
    from: number,
    to: number,
    dir_from: "lt" | "rt",
    dir_to: "lt" | "rt"
  ) => void
  containerRef: React.RefObject<HTMLDivElement>
}

interface SelectedItem {
  id: number
  x: number
  y: number
  dirn?: "lt" | "rt"
}

export const Layer = (props: LayerProps) => {
  const {
    type,
    height,
    width,
    elements,
    handleSave,
    handleDelete,
    handleMove,
    handleChain,
    setType,
    zoom,
    arrows,
    containerRef
  } = props

  const [selected, setSelected] = useState<LayerElement | null>(null)

  // const chainElements = (
  //   e: any,
  //   element_id: number,
  //   direction: "lt" | "rt"
  // ) => {
  //   let x = 0,
  //     y = 0
  //   const width = e.target.parentNode.offsetWidth
  //   const height = e.target.parentNode.offsetHeight
  //   x = width / 2
  //   y = height / 2

  //   setSelected((prev) => {
  //     if (!prev?.[0]?.dirn) {
  //       return [
  //         {
  //           id: element_id,
  //           x,
  //           y,
  //           dirn: direction
  //         }
  //       ]
  //     }

  //     if (prev?.length === 0) {
  //       return [
  //         {
  //           id: element_id,
  //           x,
  //           y,
  //           dirn: direction
  //         }
  //       ]
  //     } else if (prev?.[0]?.id !== element_id) {
  //       typeof prev?.[0]?.id === "number" &&
  //         prev?.[0]?.dirn &&
  //         handleChain(prev?.[0]?.id, element_id, prev?.[0]?.dirn, direction)

  //       return []
  //     } else return prev
  //   })
  // }

  return (
    <>
      <div className={cls.Layer} style={{ width, height }}>
        {elements?.map((element, i) => (
          <Element
            key={element.element_id}
            element={element}
            setSelected={setSelected}
            handleDelete={handleDelete}
            type={type}
            handleMove={handleMove}
            selected={selected}
            containerRef={containerRef}
          />
        ))}
        {arrows.map(({ id, id_from, id_to, dots, pos_from, pos_to }) => {
          let from = elements.find((el) => id_from === el.element_id)
          let to = elements.find((el) => id_to === el.element_id)
          if (from && to) {
            return (
              <></>
              // <Arrow
              //   className={type === LayerType.DEL ? cls.bigline : ""}
              //   id={id}
              //   from={{
              //     left: from.left,
              //     top: from.top,
              //     id: from.element_id
              //   }}
              //   to={{
              //     left: to.left,
              //     top: to.top,
              //     id: to.element_id
              //   }}
              //   dots={dots}
              //   pos_from={pos_from}
              //   pos_to={pos_to}
              //   option_data={option_data}
              //   handleDelete={type === LayerType.DEL ? handleDelete : undefined}
              //   setSelected={setSelected}
              //   type={type}
              // />
            )
          }
          return <></>
        })}
      </div>
    </>
  )
}
