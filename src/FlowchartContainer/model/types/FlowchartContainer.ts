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
  active?: boolean
  pos_from: "lt" | "rt"
  pos_to: "lt" | "rt"
  dots?: LineChangeProp[]
}

export interface LineChangeProp {
  gap: number
  direction: "left" | "top"
  dot_index: number[]
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
