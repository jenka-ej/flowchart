import { ELEM_HEIGHT, ELEM_WIDTH } from "../const"

export const formStartEndDots = (
  from: {
    left: number
    top: number
    id: number
  },
  to: {
    left: number
    top: number
    id: number
  },
  pos_from: "lt" | "rt",
  pos_to: "lt" | "rt"
) => {
  const startCords = {
    left: pos_from === "lt" ? from.left : from.left + ELEM_WIDTH,
    top: from.top + ELEM_HEIGHT / 2
  }
  const endCords = {
    left: pos_to === "lt" ? to.left : to.left + ELEM_WIDTH,
    top: to.top + ELEM_HEIGHT / 2
  }

  return { start: startCords, end: endCords }
}

// export const formArrowDots = (
//   from: {
//     left: number
//     top: number
//     id: number
//   },
//   to: {
//     left: number
//     top: number
//     id: number
//   },
//   pos_from: "lt" | "rt",
//   pos_to: "lt" | "rt"
// ): { left: number; top: number }[] => {
//   const BLOCK_WIDTH = ELEM_WIDTH
//   const BLOCK_HEIGHT = ELEM_HEIGHT
//   const OFFSET = CELL_SIZE

//   // Рассчитываем начальную точку в зависимости от pos_from
//   let startX = from.left + (pos_from === "lt" ? 0 : BLOCK_WIDTH)
//   let startY = from.top + BLOCK_HEIGHT / 2

//   // Рассчитываем конечную точку в зависимости от pos_to
//   let endX = to.left + (pos_to === "lt" ? 0 : BLOCK_WIDTH)
//   let endY = to.top + BLOCK_HEIGHT / 2

//   // Рассчитываем отступы от начальной и конечной точек
//   let initialOffsetX = pos_from === "lt" ? startX - OFFSET : startX + OFFSET
//   let finalOffsetX = pos_to === "lt" ? endX - OFFSET : endX + OFFSET

//   // Проверка на минимальное расстояние по Y между блоками
//   let verticalDistance = Math.abs(from.top - to.top)
//   let middleY =
//     from.top < to.top ? from.top + BLOCK_HEIGHT + OFFSET : from.top - OFFSET

//   // Добавляем первую и последнюю обязательные точки отступа
//   const points = [
//     { left: startX, top: startY }, // Начальная точка
//     { left: initialOffsetX, top: startY } // Точка с отступом от начального блока
//   ]

//   // Проверка, если по X можно соединить без поворота
//   if (initialOffsetX === finalOffsetX) {
//     points.push({ left: initialOffsetX, top: endY })
//   } else {
//     // Добавляем точки, чтобы избежать пересечения блоков
//     // Если блоки на одном уровне, просто соединяем с минимальными изгибами
//     if (verticalDistance > BLOCK_HEIGHT + 2 * OFFSET) {
//       points.push({ left: initialOffsetX, top: middleY }) // Переход по Y на безопасное расстояние
//       points.push({ left: finalOffsetX, top: middleY }) // Переход по X
//     } else {
//       // Если вертикальное расстояние между блоками меньше, выбираем безопасное смещение
//       let safeY =
//         from.top < to.top ? from.top + BLOCK_HEIGHT + OFFSET : from.top - OFFSET
//       points.push({ left: initialOffsetX, top: safeY })
//       points.push({ left: finalOffsetX, top: safeY })
//     }
//     points.push({ left: finalOffsetX, top: endY })
//   }

//   // Добавляем последнюю точку с отступом
//   points.push({ left: endX, top: endY }) // Конечная точка

//   return points
// }

export const formArrowDots = (
  from: {
    left: number
    top: number
    id: number
  },
  to: {
    left: number
    top: number
    id: number
  },
  pos_from: "lt" | "rt",
  pos_to: "lt" | "rt"
): { left: number; top: number }[] | undefined => {
  const { end, start } = formStartEndDots(from, to, pos_from, pos_to)

  let dots = undefined as { left: number; top: number }[] | undefined
  if (pos_from === "lt" && pos_to === "lt") {
    if (
      start.left - end.left < -250 &&
      start.top - end.top < 100 &&
      start.top - end.top > -100
    ) {
      dots = [
        start,
        { left: start.left - ELEM_WIDTH / 4, top: start.top },
        { left: start.left - ELEM_WIDTH / 4, top: start.top + 100 },
        {
          left: end.left - 50,
          top: start.top + 100
        },
        {
          left: end.left - 50,
          top: end.top
        },
        end
      ]
    } else if (start.left - end.left > 0) {
      if (
        start.left - end.left > 250 &&
        start.top - end.top < 100 &&
        start.top - end.top > -100
      ) {
        dots = [
          start,
          { left: start.left - ELEM_WIDTH / 4, top: start.top },
          { left: start.left - ELEM_WIDTH / 4, top: end.top + 100 },
          {
            left: end.left - 50,
            top: end.top + 100
          },
          {
            left: end.left - 50,
            top: end.top
          },
          end
        ]
      } else {
        dots = [
          start,
          { left: end.left - ELEM_WIDTH / 4, top: start.top },
          {
            left: end.left - ELEM_WIDTH / 4,
            top: end.top
          },
          end
        ]
      }
    } else {
      dots = [
        start,
        { left: start.left - ELEM_WIDTH / 4, top: start.top },
        { left: start.left - ELEM_WIDTH / 4, top: end.top },
        end
      ]
    }
  }
  if (pos_from === "lt" && pos_to === "rt") {
    if (
      (start.left - end.left === 50 || start.left - end.left === 0) &&
      start.top - end.top === 0
    ) {
      dots = [start, end]
    } else if (start.left - end.left < 100) {
      const topOffset =
        start.top - end.top < 0 ? end.top + 100 : start.top + 100

      if (start.top - end.top <= 0 && start.left - end.left > -200) {
        dots = [
          start,
          { left: end.left - 250, top: start.top },
          { left: end.left - 250, top: topOffset },
          { left: end.left + ELEM_WIDTH / 4, top: topOffset },
          { left: end.left + ELEM_WIDTH / 4, top: end.top },
          end
        ]
      } else {
        dots = [
          start,
          { left: start.left - ELEM_WIDTH / 4, top: start.top },
          { left: start.left - ELEM_WIDTH / 4, top: topOffset },
          {
            left:
              start.left - end.left <= -200
                ? end.left + ELEM_WIDTH / 4
                : start.left + 250,
            top: topOffset
          },
          {
            left:
              start.left - end.left <= -200
                ? end.left + ELEM_WIDTH / 4
                : start.left + 250,
            top: end.top
          },
          end
        ]
      }
    } else {
      dots = [
        start,
        { left: start.left - ELEM_WIDTH / 4, top: start.top },
        {
          left: start.left - ELEM_WIDTH / 4,
          top: start.top - (start.top - end.top)
        },
        {
          left: end.left + ELEM_WIDTH / 4,
          top: start.top - (start.top - end.top)
        },
        {
          left: end.left + ELEM_WIDTH / 4,
          top: end.top
        },
        end
      ]
    }
  }
  if (pos_from === "rt" && pos_to === "lt") {
    if (
      (start.left - end.left === -50 || start.left - end.left === 0) &&
      start.top - end.top === 0
    ) {
      dots = [start, end]
    } else if (start.left - end.left > -100) {
      const topOffset =
        start.top - end.top < 0 ? end.top + 100 : start.top + 100

      if (start.top - end.top <= 0 && start.left - end.left < 200) {
        dots = [
          start,
          { left: end.left + 250, top: start.top },
          { left: end.left + 250, top: topOffset },
          { left: end.left - ELEM_WIDTH / 4, top: topOffset },
          { left: end.left - ELEM_WIDTH / 4, top: end.top },
          end
        ]
      } else {
        dots = [
          start,
          { left: start.left + ELEM_WIDTH / 4, top: start.top },
          { left: start.left + ELEM_WIDTH / 4, top: topOffset },
          {
            left:
              start.left - end.left >= 200
                ? end.left - ELEM_WIDTH / 4
                : start.left - 250,
            top: topOffset
          },
          {
            left:
              start.left - end.left >= 200
                ? end.left - ELEM_WIDTH / 4
                : start.left - 250,
            top: end.top
          },
          end
        ]
      }
    } else {
      dots = [
        start,
        { left: start.left + ELEM_WIDTH / 4, top: start.top },
        {
          left: start.left + ELEM_WIDTH / 4,
          top: start.top - (start.top - end.top)
        },
        {
          left: end.left - ELEM_WIDTH / 4,
          top: start.top - (start.top - end.top)
        },
        {
          left: end.left - ELEM_WIDTH / 4,
          top: end.top
        },
        end
      ]
    }
  }
  if (pos_from === "rt" && pos_to === "rt") {
    if (
      start.left - end.left > 250 &&
      start.top - end.top < 100 &&
      start.top - end.top > -100
    ) {
      dots = [
        start,
        { left: start.left + ELEM_WIDTH / 4, top: start.top },
        { left: start.left + ELEM_WIDTH / 4, top: start.top + 100 },
        {
          left: start.left - 250,
          top: start.top + 100
        },
        {
          left: start.left - 250,
          top: end.top
        },
        end
      ]
    } else if (start.left - end.left < 0) {
      if (
        start.left - end.left < -250 &&
        start.top - end.top < 100 &&
        start.top - end.top > -100
      ) {
        dots = [
          start,
          { left: start.left + ELEM_WIDTH / 4, top: start.top },
          { left: start.left + ELEM_WIDTH / 4, top: end.top + 100 },
          {
            left: end.left + 50,
            top: end.top + 100
          },
          {
            left: end.left + 50,
            top: end.top
          },
          end
        ]
      } else {
        dots = [
          start,
          { left: end.left + ELEM_WIDTH / 4, top: start.top },
          {
            left: end.left + ELEM_WIDTH / 4,
            top: end.top
          },
          end
        ]
      }
    } else {
      dots = [
        start,
        { left: start.left + ELEM_WIDTH / 4, top: start.top },
        { left: start.left + ELEM_WIDTH / 4, top: end.top },
        end
      ]
    }
  }
  return dots
}

export const formLines = (
  dots: {
    left: number
    top: number
  }[]
) => {
  let lines = dots
    .map((dot, ind, arr) => {
      if (!arr[ind + 1]) return undefined

      let nextDot = arr[ind + 1]

      return {
        dots: { dot, nextDot },
        id: [ind, ind + 1],
        styles: {
          left: nextDot.left >= dot.left ? dot.left - 2 : nextDot.left - 2,
          top: nextDot.top >= dot.top ? dot.top - 2 : nextDot.top - 2,
          width:
            nextDot.left === dot.left ? 1 : Math.abs(nextDot.left - dot.left),
          height:
            nextDot.top === dot.top ? 1 : Math.abs(nextDot.top - dot.top) + 1
        }
      }
    })
    .filter(Boolean)

  return { pathDots: dots, lines }
}

export const identifySectorOfElement = (x: number, y: number) => {
  if (x >= 0 && x <= 50 && y >= 0 && y <= 50) {
    return 1
  } else if (x > 50 && x <= 100 && y >= 0 && y <= 50) {
    return 2
  } else if (x > 100 && x <= 150 && y >= 0 && y <= 50) {
    return 3
  } else if (x > 150 && x <= 200 && y >= 0 && y <= 50) {
    return 4
  } else if (x >= 0 && x <= 50 && y > 50 && y <= 100) {
    return 5
  } else if (x > 50 && x <= 100 && y > 50 && y <= 100) {
    return 6
  } else if (x > 100 && x <= 150 && y > 50 && y <= 100) {
    return 7
  } else if (x > 150 && x <= 200 && y > 50 && y <= 100) {
    return 8
  } else {
    return 1
  }
}

export const identifyXOffsetOfElement = (sector: number) => {
  if (sector === 1 || sector === 5) {
    return 0
  } else if (sector === 2 || sector === 6) {
    return 50
  } else if (sector === 3 || sector === 7) {
    return 100
  } else {
    return 150
  }
}

export const identifyYOffsetOfElement = (sector: number) => {
  if (sector === 1 || sector === 2 || sector === 3 || sector === 4) {
    return 0
  } else {
    return 50
  }
}

export const calculateXSectorOffset = (sector: number) => {
  if (sector === 1 || sector === 5) {
    return 0
  } else if (sector === 2 || sector === 6) {
    return 30
  } else if (sector === 3 || sector === 7) {
    return 70
  } else {
    return 100
  }
}

export const calculateYSectorOffset = (sector: number) => {
  if (sector === 1 || sector === 2 || sector === 3 || sector === 4) {
    return 0
  } else {
    return 25
  }
}

export const ratioXCoordinate = (zoom: number) => {
  switch (zoom) {
    case 100:
      return 1
    case 95:
      return 1
    case 90:
      return 1
    case 85:
      return 1
    case 80:
      return 1
    case 75:
      return 1
    case 70:
      return 1
    case 65:
      return 1
    case 60:
      return 1
    case 55:
      return 1
    default:
      return 1
  }
}

// OLD POSITIONS
// if (pos_from === "up" && pos_to === "up") {
//   dots = [
//     start,
//     { left: start.left, top: start.top - ELEM_HEIGHT / 2 },
//     { left: end.left, top: start.top - ELEM_HEIGHT / 2 },
//     end
//   ]
// }
// if (pos_from === "up" && pos_to === "lt") {
//   dots = [
//     start,
//     { left: start.left, top: start.top - ELEM_HEIGHT / 2 },
//     {
//       left: start.left - (start.left - end.left) / 2,
//       top: start.top - ELEM_HEIGHT / 2
//     },
//     { left: start.left - (start.left - end.left) / 2, top: end.top },
//     end
//   ]
// }
// if (pos_from === "up" && pos_to === "rt") {
//   dots = [
//     start,
//     { left: start.left, top: start.top - ELEM_HEIGHT / 2 },
//     {
//       left: start.left - (start.left - end.left - ELEM_WIDTH / 2),
//       top: start.top - ELEM_HEIGHT / 2
//     },
//     {
//       left: start.left - (start.left - end.left - ELEM_WIDTH / 2),
//       top: end.top
//     },
//     end
//   ]
// }
// if (pos_from === "up" && pos_to === "bt") {
//   dots = [
//     start,
//     { left: start.left, top: start.top - ELEM_HEIGHT / 2 },
//     {
//       left: start.left - (start.left - end.left) / 2,
//       top: start.top - ELEM_HEIGHT / 2
//     },
//     {
//       left: start.left - (start.left - end.left) / 2,
//       top: end.top + ELEM_HEIGHT / 2
//     },
//     {
//       left: end.left,
//       top: end.top + ELEM_HEIGHT / 2
//     },
//     end
//   ]
// }
// if (pos_from === "lt" && pos_to === "up") {
//   dots = [
//     start,
//     { left: start.left - ELEM_WIDTH / 4, top: start.top },
//     {
//       left: start.left - ELEM_WIDTH / 4,
//       top: start.top - (start.top - end.top) / 2
//     },
//     {
//       left: end.left,
//       top: start.top - (start.top - end.top) / 2
//     },

//     end
//   ]
// }
// if (pos_from === "rt" && pos_to === "lt") {
// if (start.left - end.left > -100 && start.left - end.left < 800) {
//   if (start.top - end.top > 0) {
//     dots = [
//       start,
//       { left: start.left + ELEM_WIDTH / 4, top: start.top },
//       {
//         left: start.left + ELEM_WIDTH / 4,
//         top: start.top - end.top < 0 ? end.top + 100 : start.top + 100
//       },
//       {
//         left:
//           start.left - end.left > 400
//             ? end.left - ELEM_WIDTH / 4
//             : start.left - 450,
//         top: start.top - end.top < 0 ? end.top + 100 : start.top + 100
//       },
//       {
//         left:
//           start.left - end.left > 400
//             ? end.left - ELEM_WIDTH / 4
//             : start.left - 450,
//         top: end.top
//       },
//       end
//     ]
//   } else {
//     dots = [
//       start,
//       { left: start.left + ELEM_WIDTH / 4, top: start.top },
//       {
//         left: start.left + ELEM_WIDTH / 4,
//         top: start.top - end.top < 0 ? end.top + 100 : start.top + 100
//       },
//       {
//         left:
//           start.left - end.left > 400
//             ? end.left - ELEM_WIDTH / 4
//             : start.left - 450,
//         top: start.top - end.top < 0 ? end.top + 100 : start.top + 100
//       },
//       {
//         left:
//           start.left - end.left > 400
//             ? end.left - ELEM_WIDTH / 4
//             : start.left - 450,
//         top: end.top
//       },
//       end
//     ]
//   }
// }
// }
// if (pos_from === "lt" && pos_to === "bt") {
//   dots = [
//     start,
//     { left: start.left - ELEM_WIDTH / 2, top: start.top },
//     {
//       left: start.left - ELEM_WIDTH / 2,
//       top: start.top - (start.top - end.top - ELEM_HEIGHT / 2)
//     },
//     {
//       left: end.left,
//       top: start.top - (start.top - end.top - ELEM_HEIGHT / 2)
//     },
//     end
//   ]
// }
// if (pos_from === "rt" && pos_to === "up") {
//   dots = [
//     start,
//     { left: start.left + ELEM_WIDTH / 2, top: start.top },
//     {
//       left: start.left + ELEM_WIDTH / 2,
//       top: start.top - (start.top - end.top) / 2
//     },
//     {
//       left: end.left,
//       top: start.top - (start.top - end.top) / 2
//     },

//     end
//   ]
// }
// if (pos_from === "rt" && pos_to === "bt") {
//   dots = [
//     start,
//     { left: start.left + ELEM_WIDTH / 4, top: start.top },
//     {
//       left: start.left + ELEM_WIDTH / 4,
//       top: start.top - (start.top - end.top - ELEM_HEIGHT / 2)
//     },
//     {
//       left: end.left,
//       top: start.top - (start.top - end.top - ELEM_HEIGHT / 2)
//     },
//     end
//   ]
// }
// if (pos_from === "bt" && pos_to === "up") {
//   dots = [
//     start,
//     { left: start.left, top: start.top + ELEM_HEIGHT / 2 },
//     {
//       left: start.left - (start.left - end.left) / 2,
//       top: start.top + ELEM_HEIGHT / 2
//     },
//     {
//       left: start.left - (start.left - end.left) / 2,
//       top: end.top - ELEM_HEIGHT / 2
//     },
//     {
//       left: end.left,
//       top: end.top - ELEM_HEIGHT / 2
//     },
//     end
//   ]
// }
// if (pos_from === "bt" && pos_to === "lt") {
//   dots = [
//     start,
//     { left: start.left, top: start.top + ELEM_HEIGHT / 2 },
//     {
//       left: start.left - (start.left - end.left) / 2,
//       top: start.top + ELEM_HEIGHT / 2
//     },
//     { left: start.left - (start.left - end.left) / 2, top: end.top },
//     end
//   ]
// }
// if (pos_from === "bt" && pos_to === "rt") {
//   dots = [
//     start,
//     { left: start.left, top: start.top + ELEM_HEIGHT / 2 },
//     {
//       left: start.left - (start.left - end.left - ELEM_WIDTH / 2),
//       top: start.top + ELEM_HEIGHT / 2
//     },
//     {
//       left: start.left - (start.left - end.left - ELEM_WIDTH / 2),
//       top: end.top
//     },
//     end
//   ]
// }
// if (pos_from === "bt" && pos_to === "bt") {
//   dots = [
//     start,
//     { left: start.left, top: start.top + ELEM_HEIGHT / 2 },
//     { left: end.left, top: start.top + ELEM_HEIGHT / 2 },
//     end
//   ]
// }
