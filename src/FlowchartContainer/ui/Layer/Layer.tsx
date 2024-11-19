import { useState } from "react"
import {
  ElementGap,
  LayerArrow,
  LayerElement,
  LayerType
} from "../../model/types/FlowchartContainer"
import { Arrow } from "../Arrow/Arrow"
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
  handleDelete: (item: LayerElement | LayerArrow) => void
  handleSave: (el: any) => void
  handleChain: (
    from: number,
    to: number,
    dir_from: "lt" | "rt",
    dir_to: "lt" | "rt"
  ) => void
  containerRef: React.RefObject<HTMLDivElement>
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
        {elements?.map((element) => (
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
        {arrows.map((arrow) => {
          const elementFrom = elements.find(
            (element) => arrow.id_from === element.element_id
          )!
          const elementTo = elements.find(
            (element) => arrow.id_to === element.element_id
          )!
          return (
            <Arrow
              arrow={arrow}
              elementFrom={elementFrom}
              elementTo={elementTo}
              handleDelete={handleDelete}
              type={type}
            />
          )
        })}
      </div>
    </>
  )
}
