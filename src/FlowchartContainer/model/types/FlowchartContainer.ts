export interface IElementData {
  name: string
}

export interface LayerElement {
  elementId: number
  elementData?: IElementData
  left: number
  top: number
}

export interface LayerArrow {
  arrowId: number
  idElementFrom: number
  idElementTo: number
  positionFrom: "lt" | "rt" | "up" | "bt"
  positionTo: "lt" | "rt" | "up" | "bt"
}

export type ChainLayerElement = LayerElement & {
  direction: "lt" | "rt" | "up" | "bt"
}

export interface ICoordinate {
  left: number
  top: number
}
