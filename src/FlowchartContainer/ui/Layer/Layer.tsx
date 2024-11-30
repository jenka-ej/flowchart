import { useState } from "react"
import {
  ChainLayerElement,
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
  handleMove: (props: ElementGap, endMove: boolean) => void
  handleDelete: (item: LayerElement | LayerArrow) => void
  handleSave: (el: any) => void
  handleChain: (
    chainedElementFrom: ChainLayerElement,
    chainedElementTo: ChainLayerElement
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
  const [selectedChain, setSelectedChain] = useState<ChainLayerElement | null>(
    null
  )

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
            selectedChain={selectedChain}
            setSelectedChain={setSelectedChain}
            handleChain={handleChain}
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
