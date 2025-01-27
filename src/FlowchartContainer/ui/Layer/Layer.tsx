import {
  ChainLayerElement,
  IClickedElement,
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
  handleMove: (props: LayerElement, end: boolean) => void
  handleDelete: (item: LayerElement | LayerArrow) => void
  handleSave: (el: any) => void
  handleChain: (
    chainedElementFrom: ChainLayerElement,
    chainedElementTo: ChainLayerElement
  ) => void
  containerRef: React.RefObject<HTMLDivElement>
  setClickedElement: (p: IClickedElement | null) => void
  clickedElement: IClickedElement | null
  selectedChain: ChainLayerElement | null
  setSelectedChain: (p: ChainLayerElement | null) => void
}

export const Layer = (props: LayerProps) => {
  const {
    height,
    width,
    elements,
    handleSave,
    handleDelete,
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
      <div
        className={cls.Layer}
        style={{ width, height }}
      >
        {elements?.map((element) => (
          <Element
            key={element.elementId}
            element={element}
            handleDelete={handleDelete}
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
              handleDelete={handleDelete}
              setClickedElement={setClickedElement}
              clickedElement={clickedElement}
            />
          )
        })}
      </div>
    </>
  )
}
