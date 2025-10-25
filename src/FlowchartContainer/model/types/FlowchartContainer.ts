export interface IElementData {
  name: string
}

export interface IFlowchartElement {
  elementId: string
  elementData: IElementData
  left: number
  top: number
}

export interface ICoordinate {
  left: number
  top: number
}

export type TFlowchartDot = ICoordinate & {
  dotId: string
  type: "default" | "temporary" | "extra"
}

export interface IFlowchartArrow {
  arrowId: string
  idElementFrom: string
  idElementTo: string
  positionFrom: "lt" | "rt"
  positionTo: "lt" | "rt"
}

export interface IFlowchartArrowWithoutDots {
  idElementFrom: string
  idElementTo: string
  positionFrom: "lt" | "rt"
  positionTo: "lt" | "rt"
}

export type TChainFlowchartElement = IFlowchartElement & {
  direction: "lt" | "rt"
}

export interface IAvailableState {
  elements: IFlowchartElement[]
  arrows: IFlowchartArrow[]
  active: boolean
}

export interface IElementProps {
  element: IFlowchartElement
  handleMoveElement: (element: IFlowchartElement) => void
  handleMoveElementEnd: (element: IFlowchartElement) => void
  containerRef: React.RefObject<HTMLDivElement | null>
  selectedChain: TChainFlowchartElement | null
  setSelectedChain: (p: TChainFlowchartElement | null) => void
  handleDeleteItem: (item: IFlowchartElement | IFlowchartArrow) => void
  handleChainFinal: (
    chainedElementFrom: TChainFlowchartElement,
    chainedElementTo: TChainFlowchartElement
  ) => void
  clickedItem: IFlowchartElement | IFlowchartArrow | null
  setClickedItem: React.Dispatch<
    React.SetStateAction<IFlowchartElement | IFlowchartArrow | null>
  >
  thisElementIsConnectedWithClickedElement: boolean
  chainSelectedAndThisElementIsChained: boolean
  chainSelectedAndThisElementNotChained: boolean
}

export interface IArrowProps {
  arrow: IFlowchartArrow
  arrows: IFlowchartArrow[]
  elements: IFlowchartElement[]
  elementFrom: IFlowchartElement
  elementTo: IFlowchartElement
  clickedItem: IFlowchartElement | IFlowchartArrow | null
  setClickedItem: React.Dispatch<
    React.SetStateAction<IFlowchartElement | IFlowchartArrow | null>
  >
}

export interface IDotProps {
  arrow: IFlowchartArrow
  dot: TFlowchartDot
  handleMoveDotStart: (arrow: IFlowchartArrow, dot: TFlowchartDot) => void
  handleMoveDot: (arrow: IFlowchartArrow, dot: TFlowchartDot) => void
  handleMoveDotEnd: () => void
  lineColor: () => string
  containerRef: React.RefObject<HTMLDivElement | null>
  zoom: number
}
