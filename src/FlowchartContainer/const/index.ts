// Цифры подобраны так, чтоб была кратность 2/4/8/16/32

export const ELEM_WIDTH = 96 // Ширина элемента

export const ELEM_HALF_WIDTH = ELEM_WIDTH / 2 // Половина ширины элемента

export const ELEM_QUARTER_WIDTH = ELEM_WIDTH / 4 // Четверть ширины элемента

export const ELEM_HEIGHT = 64 // Высота элемента

export const ELEM_HALF_HEIGHT = ELEM_HEIGHT / 2 // Половина высоты элемента

export const ELEM_QUARTER_HEIGHT = ELEM_HEIGHT / 4 // Четверть высоты элемента

export const ELEM_OFFSET_HEIGHT = ELEM_HEIGHT / 32 // Пространство высоты элемента, которае не используется для выходящих стрелок

export const OFFSET_START_END_POINT = 10 // Пространство для точек начала и конца

export const OFFSET_SECONDARY_POINT = ELEM_HALF_HEIGHT // Пространство для промежуточных точек между началом и концом

export const OFFSET_SPACE_FOR_DOTS = ELEM_HEIGHT - ELEM_OFFSET_HEIGHT * 2 // Пространство для точек, которые выходят из элемента (практически полная высота элемента)

export const CELL_SIZE = 8 // Размер невидимой клетки, шаг которой учитывается при перемещении элементов и точек

export const VISIBLE_CELL_SIZE = ELEM_WIDTH / 3 // Размер видимой клетки для PointGridBackground

export const ELEMENT_MARKER_TYPES: ("lt" | "rt")[] = ["lt", "rt"]
