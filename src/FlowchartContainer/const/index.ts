export const ELEM_WIDTH = 200
export const MINIMAP_WIDTH = 200
export const ELEM_HEIGHT = 100

export const CELL_SIZE = 4

export const ELEMENT_TYPE_DATA = [
  { value: "BLOCK", label: "Блок" },
  { value: "CONDITION", label: "Условие" },
  { value: "BEGIN_OR_END", label: "Начало / Конец" },
  { value: "SUBPROGRAM", label: "Подпрограмма" },
  { value: "INPUT_OR_OUTPUT", label: "Ввод / Вывод" },
  { value: "DISPLAY", label: "Дисплей" },
  { value: "CYCLE", label: "Цикл for" },
  { value: "LINK", label: "Ссылка" }
]

export const ELEMENT_MARKER_TYPES: ("lt" | "up" | "rt" | "bt")[] = [
  "lt",
  "up",
  "rt",
  "bt"
]
