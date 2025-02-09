import {
  ChainLayerElement,
  LayerArrow,
  LayerElement
} from "../../model/types/FlowchartContainer"
import { Arrow } from "../Arrow/Arrow"
import { Element } from "../Element/Element"
import cls from "./Layer.module.css"

interface LayerProps {
  width: number
  height: number
  elements: LayerElement[]
  arrows: LayerArrow[]
  handleMove: (element: LayerElement, end: boolean) => void
  handleSave: (element: LayerElement) => void
  handleChain: (
    chainedElementFrom: ChainLayerElement,
    chainedElementTo: ChainLayerElement
  ) => void
  containerRef: React.RefObject<HTMLDivElement>
  setClickedElement: (p: LayerElement | LayerArrow | null) => void
  clickedElement: LayerElement | LayerArrow | null
  selectedChain: ChainLayerElement | null
  setSelectedChain: (p: ChainLayerElement | null) => void
}

export const Layer = (props: LayerProps) => {
  const {
    height,
    width,
    elements,
    handleSave,
    handleMove,
    handleChain,
    arrows,
    containerRef,
    setClickedElement,
    clickedElement,
    selectedChain,
    setSelectedChain
  } = props

  return (
    <>
      <div className={cls.Layer} style={{ width, height }}>
        {elements?.map((element) => (
          <Element
            key={element.elementId}
            element={element}
            handleMove={handleMove}
            containerRef={containerRef}
            selectedChain={selectedChain}
            setSelectedChain={setSelectedChain}
            handleChain={handleChain}
            setClickedElement={setClickedElement}
            clickedElement={clickedElement}
            handleSave={handleSave}
          />
        ))}
        {arrows.map((arrow) => {
          const elementFrom = elements.find(
            (element) => arrow.idElementFrom === element.elementId
          )!
          const elementTo = elements.find(
            (element) => arrow.idElementTo === element.elementId
          )!
          return (
            <Arrow
              arrow={arrow}
              elementFrom={elementFrom}
              elementTo={elementTo}
              setClickedElement={setClickedElement}
              clickedElement={clickedElement}
            />
          )
        })}
      </div>
    </>
  )
}
