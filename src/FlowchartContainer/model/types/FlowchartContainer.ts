export interface IElementData {
  type:
    | "BLOCK"
    | "CONDITION"
    | "BEGIN_OR_END"
    | "SUBPROGRAM"
    | "INPUT_OR_OUTPUT"
    | "DISPLAY"
    | "CYCLE"
    | "LINK"
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

export interface IClickedElement {
  element: LayerElement | LayerArrow
}
