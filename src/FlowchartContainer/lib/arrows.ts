import { v4 } from "uuid"
import {
  CELL_SIZE,
  ELEM_HALF_HEIGHT,
  ELEM_OFFSET_HEIGHT,
  ELEM_WIDTH,
  OFFSET_SECONDARY_POINT,
  OFFSET_SPACE_FOR_DOTS,
  OFFSET_START_END_POINT
} from "../const"
import {
  IFlowchartArrowWithoutDots,
  type IFlowchartArrow,
  type IFlowchartElement,
  type TFlowchartDot
} from "../model/types"

// Создание точки

export const createDot = (left: number, top: number): TFlowchartDot => ({
  left,
  top,
  dotId: v4(),
  type: "default"
})

// Создание начальной или конечной точки стрелки

export const coordinateForPosition = (
  element: IFlowchartElement,
  position: "lt" | "rt"
) => {
  if (position === "lt") {
    return createDot(
      element.left - OFFSET_START_END_POINT,
      element.top + ELEM_HALF_HEIGHT
    )
  }
  return createDot(
    element.left + ELEM_WIDTH + OFFSET_START_END_POINT,
    element.top + ELEM_OFFSET_HEIGHT
  )
}

// Создание начальной и конечной точки стрелки

export const formStartEndDots = (
  elementFrom: IFlowchartElement,
  elementTo: IFlowchartElement,
  positionFrom: "lt" | "rt",
  positionTo: "lt" | "rt"
) => ({
  start: coordinateForPosition(elementFrom, positionFrom),
  end: coordinateForPosition(elementTo, positionTo)
})

// Построение точек на одной горизонтали

const horizontalPairDots = (x1: number, x2: number, y: number) => [
  createDot(x1, y),
  createDot(x2, y)
]

// Обработчик построения массива точек в зависимости от условий

const pathBuilders = {
  case1: (start: TFlowchartDot, end: TFlowchartDot, UNIQUE_OFFSET: number) => [
    ...horizontalPairDots(
      start.left,
      end.left +
        OFFSET_START_END_POINT * 2 +
        ELEM_WIDTH +
        OFFSET_SECONDARY_POINT +
        UNIQUE_OFFSET,
      start.top + UNIQUE_OFFSET
    ),
    ...horizontalPairDots(
      end.left +
        OFFSET_START_END_POINT * 2 +
        ELEM_WIDTH +
        OFFSET_SECONDARY_POINT +
        UNIQUE_OFFSET,
      end.left - OFFSET_SECONDARY_POINT - UNIQUE_OFFSET,
      end.top + ELEM_HALF_HEIGHT + OFFSET_SECONDARY_POINT + UNIQUE_OFFSET
    ),
    ...horizontalPairDots(
      end.left - OFFSET_SECONDARY_POINT - UNIQUE_OFFSET,
      end.left,
      end.top
    )
  ],

  case2: (start: TFlowchartDot, end: TFlowchartDot, UNIQUE_OFFSET: number) => [
    ...horizontalPairDots(
      start.left,
      start.left + OFFSET_SECONDARY_POINT + UNIQUE_OFFSET,
      start.top + UNIQUE_OFFSET
    ),
    ...horizontalPairDots(
      start.left + OFFSET_SECONDARY_POINT + UNIQUE_OFFSET,
      end.left - OFFSET_SECONDARY_POINT - UNIQUE_OFFSET,
      end.top + ELEM_HALF_HEIGHT + OFFSET_SECONDARY_POINT + UNIQUE_OFFSET
    ),
    ...horizontalPairDots(
      end.left - OFFSET_SECONDARY_POINT - UNIQUE_OFFSET,
      end.left,
      end.top
    )
  ],

  case3: (start: TFlowchartDot, end: TFlowchartDot, UNIQUE_OFFSET: number) => [
    ...horizontalPairDots(
      start.left,
      start.left + OFFSET_SECONDARY_POINT + UNIQUE_OFFSET,
      start.top + UNIQUE_OFFSET
    ),
    ...horizontalPairDots(
      start.left + OFFSET_SECONDARY_POINT + UNIQUE_OFFSET,
      end.left - OFFSET_SECONDARY_POINT - UNIQUE_OFFSET,
      start.top +
        OFFSET_SPACE_FOR_DOTS +
        ELEM_OFFSET_HEIGHT +
        OFFSET_SECONDARY_POINT +
        UNIQUE_OFFSET
    ),
    ...horizontalPairDots(
      end.left - OFFSET_SECONDARY_POINT - UNIQUE_OFFSET,
      end.left,
      end.top
    )
  ],

  case4: (start: TFlowchartDot, end: TFlowchartDot, UNIQUE_OFFSET: number) => [
    ...horizontalPairDots(
      start.left,
      start.left + OFFSET_SECONDARY_POINT + UNIQUE_OFFSET,
      start.top + UNIQUE_OFFSET
    ),
    ...horizontalPairDots(
      start.left + OFFSET_SECONDARY_POINT + UNIQUE_OFFSET,
      start.left -
        OFFSET_START_END_POINT -
        ELEM_WIDTH -
        OFFSET_SECONDARY_POINT -
        UNIQUE_OFFSET,
      start.top +
        OFFSET_SPACE_FOR_DOTS +
        ELEM_OFFSET_HEIGHT +
        OFFSET_SECONDARY_POINT +
        UNIQUE_OFFSET
    ),
    ...horizontalPairDots(
      start.left -
        OFFSET_START_END_POINT -
        ELEM_WIDTH -
        OFFSET_SECONDARY_POINT -
        UNIQUE_OFFSET,
      end.left,
      end.top
    )
  ],

  case5: (start: TFlowchartDot, end: TFlowchartDot, UNIQUE_OFFSET: number) => [
    ...horizontalPairDots(
      start.left,
      start.left + OFFSET_SECONDARY_POINT + UNIQUE_OFFSET,
      start.top + UNIQUE_OFFSET
    ),
    ...horizontalPairDots(
      start.left + OFFSET_SECONDARY_POINT + UNIQUE_OFFSET,
      end.left - OFFSET_SECONDARY_POINT,
      end.top
    ),
    end
  ],

  case6: (start: TFlowchartDot, end: TFlowchartDot, UNIQUE_OFFSET: number) => [
    ...horizontalPairDots(
      start.left,
      start.left +
        OFFSET_SECONDARY_POINT +
        OFFSET_SPACE_FOR_DOTS -
        UNIQUE_OFFSET,
      start.top + UNIQUE_OFFSET
    ),
    ...horizontalPairDots(
      start.left +
        OFFSET_SECONDARY_POINT +
        OFFSET_SPACE_FOR_DOTS -
        UNIQUE_OFFSET,
      end.left - OFFSET_SECONDARY_POINT,
      end.top
    ),
    end
  ]
}

// Построение массива точек для стрелки (от одного элемента к другому)

export const formArrowDots = (
  elementFrom: IFlowchartElement,
  elementTo: IFlowchartElement,
  arrow: IFlowchartArrow | IFlowchartArrowWithoutDots,
  arrowIndex: number,
  arrowsCount: number
) => {
  const { positionFrom, positionTo } = arrow

  // Точки начала и конца стрелки

  const { end, start } = formStartEndDots(
    elementFrom,
    elementTo,
    positionFrom,
    positionTo
  )

  // Разница между начальной и конечной точки для горизонтали и вертикали

  const dx =
    start.left - OFFSET_START_END_POINT - end.left - OFFSET_START_END_POINT
  const dy = start.top - ELEM_OFFSET_HEIGHT - end.top + ELEM_HALF_HEIGHT

  // Уникальный отступ, чтоб стрелки не наслаивались друг на друга, при выходе из одного элемента

  const UNIQUE_OFFSET =
    Math.round(OFFSET_SPACE_FOR_DOTS / (arrowsCount + 1)) * arrowIndex

  // Логика выбора пути

  if (
    dx < ELEM_WIDTH &&
    dx > -ELEM_WIDTH - OFFSET_SECONDARY_POINT - OFFSET_SPACE_FOR_DOTS &&
    dy <= 0
  ) {
    return pathBuilders.case1(start, end, UNIQUE_OFFSET)
  }
  if (dx >= ELEM_WIDTH && dy < 0) {
    return pathBuilders.case2(start, end, UNIQUE_OFFSET)
  }
  if (dx >= ELEM_WIDTH) {
    return pathBuilders.case3(start, end, UNIQUE_OFFSET)
  }
  if (
    dx >
    -ELEM_WIDTH -
      OFFSET_START_END_POINT -
      OFFSET_SECONDARY_POINT -
      UNIQUE_OFFSET
  ) {
    return pathBuilders.case4(start, end, UNIQUE_OFFSET)
  }
  if (dy - ELEM_HALF_HEIGHT + UNIQUE_OFFSET > 0) {
    return pathBuilders.case5(start, end, UNIQUE_OFFSET)
  }
  return pathBuilders.case6(start, end, UNIQUE_OFFSET)
}

// Получить дефолтный массив точек для стрелки (от одного элемента к другому)

export const getDefaultDots = (
  arrow: IFlowchartArrow | IFlowchartArrowWithoutDots,
  arrows: IFlowchartArrow[],
  elements: IFlowchartElement[],
  arrowInCreation: boolean
) => {
  const elementFrom = elements.find(
    (mainElement) => arrow.idElementFrom === mainElement.elementId
  )!

  const elementTo = elements.find(
    (mainElement) => arrow.idElementTo === mainElement.elementId
  )!

  const arrowIndex = arrowInCreation
    ? arrows.filter(
        (mainArrow) => mainArrow.idElementFrom === arrow.idElementFrom
      ).length
    : arrows
        .filter((mainArrow) => mainArrow.idElementFrom === arrow.idElementFrom)
        .findIndex(
          (mainArrow) =>
            mainArrow.arrowId === (arrow as IFlowchartArrow).arrowId
        ) + 1

  const arrowsCount = arrowInCreation
    ? arrows.filter(
        (mainArrow) => mainArrow.idElementFrom === arrow.idElementFrom
      ).length + 1
    : arrows.filter(
        (mainArrow) => mainArrow.idElementFrom === arrow.idElementFrom
      ).length

  return formArrowDots(elementFrom, elementTo, arrow, arrowIndex, arrowsCount)
}

// Округление координаты кратно размеру клетки (для pointer move events)

export const roundDigitForPosition = (digit: number) =>
  Math.round(digit / CELL_SIZE) * CELL_SIZE

// Функции для вычисления максимума по абсциссе или ординате в Layer'е

export const calculateMaxCoordinate = (
  appElements: IFlowchartElement[],
  key: "left" | "top"
) => Math.max(...appElements.map((element) => element[key]))

// Функция для подготовки входящего значения для размера Layer'a

export const initLayerSize = (
  appElements: IFlowchartElement[],
  widthScreen: number,
  heightScreen: number
) => ({
  x:
    calculateMaxCoordinate(appElements, "left") > widthScreen
      ? calculateMaxCoordinate(appElements, "left") + 500
      : widthScreen,
  y:
    calculateMaxCoordinate(appElements, "top") > heightScreen
      ? calculateMaxCoordinate(appElements, "top") + 500
      : heightScreen
})

export const calculateScaledDigit = (digit: number, zoom: number) =>
  Math.round(digit * zoom)
