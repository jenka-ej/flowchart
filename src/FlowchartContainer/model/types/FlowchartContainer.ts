export interface LayerElement {
  element_id: number
  element_data?: any
  left: number
  top: number
}

export interface LayerArrow {
  id: number
  id_from: number
  id_to: number
  pos_from: "lt" | "rt" | "up" | "bt"
  pos_to: "lt" | "rt" | "up" | "bt"
}

export type ChainLayerElement = LayerElement & {
  direction: "lt" | "rt" | "up" | "bt"
}

export enum LayerType {
  MOVE = "MOVE",
  DRG = "DRG",
  ITM = "ITM",
  ADD = "ADD",
  DEL = "DEL",
  CHAIN = "CHAIN",
  EDIT = "EDIT",
  ACCESS = "ACCESS",
  INFO = "INFO"
}

export interface ElementGap {
  element_id: number
  left: number
  top: number
}

export interface ICoordinate {
  left: number
  top: number
}
