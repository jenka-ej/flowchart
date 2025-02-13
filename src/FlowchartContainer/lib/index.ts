import { LayerElement } from "../model/types/FlowchartContainer"

export const createDot = (left: number, top: number) => ({ left, top })

export const coordinateForPosition = (
  element: LayerElement,
  position: "lt" | "rt" | "up" | "bt"
) => {
  if (position === "lt") {
    return createDot(element.left - 10, element.top + 50)
  } else if (position === "rt") {
    return createDot(element.left + 210, element.top + 50)
  } else if (position === "up") {
    return createDot(element.left + 100, element.top - 10)
  } else {
    return createDot(element.left + 100, element.top + 110)
  }
}

export const formStartEndDots = (
  elementFrom: LayerElement,
  elementTo: LayerElement,
  positionFrom: "lt" | "rt" | "up" | "bt",
  positionTo: "lt" | "rt" | "up" | "bt"
) => {
  return {
    start: coordinateForPosition(elementFrom, positionFrom),
    end: coordinateForPosition(elementTo, positionTo)
  }
}

export const formArrowDots = (
  elementFrom: LayerElement,
  elementTo: LayerElement,
  positionFrom: "lt" | "rt" | "up" | "bt",
  positionTo: "lt" | "rt" | "up" | "bt"
): { left: number; top: number }[] | undefined => {
  const { end, start } = formStartEndDots(
    elementFrom,
    elementTo,
    positionFrom,
    positionTo
  )

  const dx = start.left - end.left
  const dy = start.top - end.top

  let dots = undefined as { left: number; top: number }[] | undefined
  if (positionFrom === "lt" && positionTo === "lt") {
    if (dx < -250 && Math.abs(dy) < 100) {
      return [
        start,
        createDot(start.left - 50, start.top),
        createDot(start.left - 50, start.top + 100),
        createDot(end.left - 50, start.top + 100),
        createDot(end.left - 50, end.top),
        end
      ]
    } else if (dx > 250 && Math.abs(dy) < 100) {
      return [
        start,
        createDot(start.left - 50, start.top),
        createDot(start.left - 50, end.top + 100),
        createDot(end.left - 50, end.top + 100),
        createDot(end.left - 50, end.top),
        end
      ]
    } else if (dx > 0) {
      return [
        start,
        createDot(end.left - 50, start.top),
        createDot(end.left - 50, end.top),
        end
      ]
    } else {
      return [
        start,
        createDot(start.left - 50, start.top),
        createDot(start.left - 50, end.top),
        end
      ]
    }
  }
  if (positionFrom === "lt" && positionTo === "rt") {
    const topOffset = dy < 0 ? end.top + 100 : start.top + 100

    if (dx < 100 && dx > -200 && dy <= 0) {
      return [
        start,
        createDot(end.left - 250, start.top),
        createDot(end.left - 250, topOffset),
        createDot(end.left + 50, topOffset),
        createDot(end.left + 50, end.top),
        end
      ]
    } else if (dx < 100) {
      const midX = dx <= -200 ? end.left + 50 : start.left + 250
      return [
        start,
        createDot(start.left - 50, start.top),
        createDot(start.left - 50, topOffset),
        createDot(midX, topOffset),
        createDot(midX, end.top),
        end
      ]
    } else {
      return [
        start,
        createDot(start.left - 50, start.top),
        createDot(start.left - 50, end.top),
        createDot(end.left + 50, end.top),
        end
      ]
    }
  }
  if (positionFrom === "lt" && positionTo === "up") {
    if (dx < -100 && dy > 50) {
      return [
        start,
        createDot(start.left - 50, start.top),
        createDot(start.left - 50, end.top - 50),
        createDot(end.left, end.top - 50),
        end
      ]
    } else if (dx > -100 && dy > 150) {
      return [
        start,
        createDot(end.left - 150, start.top),
        createDot(end.left - 150, end.top - 50),
        createDot(end.left, end.top - 50),
        end
      ]
    } else if (dx < -250 && dy < 50) {
      return [
        start,
        createDot(start.left - 50, start.top),
        createDot(start.left - 50, start.top - 100),
        createDot(end.left, start.top - 100),
        end
      ]
    } else if (dx > 50 && dy < -50) {
      return [start, createDot(end.left, start.top), end]
    } else {
      return [
        start,
        createDot(start.left - 50, start.top),
        createDot(start.left - 50, end.top - 50),
        createDot(end.left, end.top - 50),
        end
      ]
    }
  }
  if (positionFrom === "lt" && positionTo === "bt") {
    if (dx < -150 && dy < -50) {
      return [
        start,
        createDot(start.left - 50, start.top),
        createDot(start.left - 50, end.top + 50),
        createDot(end.left, end.top + 50),
        end
      ]
    } else if (dx > -100 && dy < -150) {
      return [
        start,
        createDot(end.left - 150, start.top),
        createDot(end.left - 150, end.top + 50),
        createDot(end.left, end.top + 50),
        end
      ]
    } else if (dx < -350 && dy > -50) {
      return [
        start,
        createDot(start.left - 50, start.top),
        createDot(start.left - 50, start.top + 100),
        createDot(end.left, start.top + 100),
        end
      ]
    } else if (dx > 50 && dy > 50) {
      return [start, createDot(end.left, start.top), end]
    } else {
      return [
        start,
        createDot(start.left - 50, start.top),
        createDot(start.left - 50, end.top + 50),
        createDot(end.left, end.top + 50),
        end
      ]
    }
  }
  if (positionFrom === "rt" && positionTo === "rt") {
    if (dx > 250 && Math.abs(dy) < 100) {
      return [
        start,
        createDot(start.left + 50, start.top),
        createDot(start.left + 50, start.top + 100),
        createDot(start.left - 250, start.top + 100),
        createDot(start.left - 250, end.top),
        end
      ]
    } else if (dx < -250 && Math.abs(dy) < 100) {
      return [
        start,
        createDot(start.left + 50, start.top),
        createDot(start.left + 50, end.top + 100),
        createDot(end.left + 50, end.top + 100),
        createDot(end.left + 50, end.top),
        end
      ]
    } else if (dx < 0) {
      return [
        start,
        createDot(end.left + 50, start.top),
        createDot(end.left + 50, end.top),
        end
      ]
    } else {
      return [
        start,
        createDot(start.left + 50, start.top),
        createDot(start.left + 50, end.top),
        end
      ]
    }
  }
  if (positionFrom === "rt" && positionTo === "lt") {
    const topOffset = dy < 0 ? end.top + 100 : start.top + 100

    if (dx < 200 && dx > -100 && dy <= 0) {
      return [
        start,
        createDot(end.left + 250, start.top),
        createDot(end.left + 250, topOffset),
        createDot(end.left - 50, topOffset),
        createDot(end.left - 50, end.top),
        end
      ]
    } else if (dx > -100) {
      const midX = dx >= 200 ? end.left - 50 : start.left - 250
      return [
        start,
        createDot(start.left + 50, start.top),
        createDot(start.left + 50, topOffset),
        createDot(midX, topOffset),
        createDot(midX, end.top),
        end
      ]
    } else {
      return [
        start,
        createDot(start.left + 50, start.top),
        createDot(start.left + 50, end.top),
        createDot(end.left - 50, end.top),
        end
      ]
    }
  }
  if (positionFrom === "rt" && positionTo === "up") {
    if (dx > 150 && dy > 50) {
      return [
        start,
        createDot(start.left + 50, start.top),
        createDot(start.left + 50, end.top - 50),
        createDot(end.left, end.top - 50),
        end
      ]
    } else if (dx < 100 && dy > 150) {
      return [
        start,
        createDot(end.left + 150, start.top),
        createDot(end.left + 150, end.top - 50),
        createDot(end.left, end.top - 50),
        end
      ]
    } else if (dx > 350 && dy < 50) {
      return [
        start,
        createDot(start.left + 50, start.top),
        createDot(start.left + 50, start.top - 100),
        createDot(end.left, start.top - 100),
        end
      ]
    } else if (dx < -50 && dy < -50) {
      return [start, createDot(end.left, start.top), end]
    } else {
      return [
        start,
        createDot(start.left + 50, start.top),
        createDot(start.left + 50, end.top - 50),
        createDot(end.left, end.top - 50),
        end
      ]
    }
  }
  if (positionFrom === "rt" && positionTo === "bt") {
    if (dx > 150 && dy < -50) {
      return [
        start,
        createDot(start.left + 50, start.top),
        createDot(start.left + 50, end.top + 50),
        createDot(end.left, end.top + 50),
        end
      ]
    } else if (dx < 100 && dy < -150) {
      return [
        start,
        createDot(end.left + 150, start.top),
        createDot(end.left + 150, end.top + 50),
        createDot(end.left, end.top + 50),
        end
      ]
    } else if (dx > 350 && dy > -50) {
      return [
        start,
        createDot(start.left + 50, start.top),
        createDot(start.left + 50, start.top + 100),
        createDot(end.left, start.top + 100),
        end
      ]
    } else if (dx < -50 && dy > 50) {
      return [start, createDot(end.left, start.top), end]
    } else {
      return [
        start,
        createDot(start.left + 50, start.top),
        createDot(start.left + 50, end.top + 50),
        createDot(end.left, end.top + 50),
        end
      ]
    }
  }
  if (positionFrom === "up" && positionTo === "up") {
    if (Math.abs(dx) < 150 && dy < -150) {
      return [
        start,
        createDot(start.left, start.top - 50),
        createDot(start.left - 150, start.top - 50),
        createDot(start.left - 150, end.top - 50),
        createDot(end.left, end.top - 50),
        end
      ]
    } else if (Math.abs(dx) < 150 && dy > 150) {
      return [
        start,
        createDot(start.left, start.top - 50),
        createDot(end.left - 150, start.top - 50),
        createDot(end.left - 150, end.top - 50),
        createDot(end.left, end.top - 50),
        end
      ]
    } else if (dy > 0) {
      return [
        start,
        createDot(start.left, end.top - 50),
        createDot(end.left, end.top - 50),
        end
      ]
    } else {
      return [
        start,
        createDot(start.left, start.top - 50),
        createDot(end.left, start.top - 50),
        end
      ]
    }
  }
  if (positionFrom === "up" && positionTo === "bt") {
    const leftOffset = dx > 0 ? end.left - 150 : start.left - 150

    if (dx >= 0 && dy < 100 && dy > -100) {
      return [
        start,
        createDot(start.left, end.top - 150),
        createDot(leftOffset, end.top - 150),
        createDot(leftOffset, end.top + 50),
        createDot(end.left, end.top + 50),
        end
      ]
    } else if (dy < 100) {
      const midY = dy <= -100 ? end.top + 50 : start.top + 150
      return [
        start,
        createDot(start.left, start.top - 50),
        createDot(leftOffset, start.top - 50),
        createDot(leftOffset, midY),
        createDot(end.left, midY),
        end
      ]
    } else {
      return [
        start,
        createDot(start.left, start.top - 50),
        createDot(end.left, start.top - 50),
        createDot(end.left, end.top + 50),
        end
      ]
    }
  }
  if (positionFrom === "up" && positionTo === "lt") {
    if (dx > 100 && dy < -50) {
      return [
        start,
        createDot(start.left, start.top - 50),
        createDot(end.left - 50, start.top - 50),
        createDot(end.left - 50, end.top),
        end
      ]
    } else if (dx > 250 && dy > -50) {
      return [
        start,
        createDot(start.left, end.top - 100),
        createDot(end.left - 50, end.top - 100),
        createDot(end.left - 50, end.top),
        end
      ]
    } else if (dx < 100 && dy < -200) {
      return [
        start,
        createDot(start.left, start.top - 50),
        createDot(start.left - 150, start.top - 50),
        createDot(start.left - 150, end.top),
        end
      ]
    } else if (dx < -50 && dy > 50) {
      return [start, createDot(start.left, end.top), end]
    } else {
      return [
        start,
        createDot(start.left, start.top - 50),
        createDot(end.left - 50, start.top - 50),
        createDot(end.left - 50, end.top),
        end
      ]
    }
  }
  if (positionFrom === "up" && positionTo === "rt") {
    if (dx < -100 && dy < -50) {
      return [
        start,
        createDot(start.left, start.top - 50),
        createDot(end.left + 50, start.top - 50),
        createDot(end.left + 50, end.top),
        end
      ]
    } else if (dx < -250 && dy > -50) {
      return [
        start,
        createDot(start.left, end.top - 100),
        createDot(end.left + 50, end.top - 100),
        createDot(end.left + 50, end.top),
        end
      ]
    } else if (dx > -100 && dy < -200) {
      return [
        start,
        createDot(start.left, start.top - 50),
        createDot(start.left + 150, start.top - 50),
        createDot(start.left + 150, end.top),
        end
      ]
    } else if (dx > 50 && dy > 50) {
      return [start, createDot(start.left, end.top), end]
    } else {
      return [
        start,
        createDot(start.left, start.top - 50),
        createDot(end.left + 50, start.top - 50),
        createDot(end.left + 50, end.top),
        end
      ]
    }
  }
  if (positionFrom === "bt" && positionTo === "bt") {
    if (Math.abs(dx) < 150 && dy > 150) {
      return [
        start,
        createDot(start.left, start.top + 50),
        createDot(start.left - 150, start.top + 50),
        createDot(start.left - 150, start.top - 150),
        createDot(end.left, start.top - 150),
        end
      ]
    } else if (Math.abs(dx) < 150 && dy < -150) {
      return [
        start,
        createDot(start.left, start.top + 50),
        createDot(end.left - 150, start.top + 50),
        createDot(end.left - 150, end.top + 50),
        createDot(end.left, end.top + 50),
        end
      ]
    } else if (dy < 0) {
      return [
        start,
        createDot(start.left, end.top + 50),
        createDot(end.left, end.top + 50),
        end
      ]
    } else {
      return [
        start,
        createDot(start.left, start.top + 50),
        createDot(end.left, start.top + 50),
        end
      ]
    }
  }
  if (positionFrom === "bt" && positionTo === "up") {
    const leftOffset = dx > 0 ? end.left - 150 : start.left - 150

    if (dx >= 0 && dy < 100 && dy > -100) {
      return [
        start,
        createDot(start.left, end.top + 150),
        createDot(leftOffset, end.top + 150),
        createDot(leftOffset, end.top - 50),
        createDot(end.left, end.top - 50),
        end
      ]
    } else if (dy > -100) {
      const midY = dy >= 100 ? end.top - 50 : start.top - 150
      return [
        start,
        createDot(start.left, start.top + 50),
        createDot(leftOffset, start.top + 50),
        createDot(leftOffset, midY),
        createDot(end.left, midY),
        end
      ]
    } else {
      return [
        start,
        createDot(start.left, start.top + 50),
        createDot(end.left, start.top + 50),
        createDot(end.left, end.top - 50),
        end
      ]
    }
  }
  if (positionFrom === "bt" && positionTo === "lt") {
    if (dx > 100 && dy > 50) {
      return [
        start,
        createDot(start.left, start.top + 50),
        createDot(end.left - 50, start.top + 50),
        createDot(end.left - 50, end.top),
        end
      ]
    } else if (dx > 250 && dy > -150) {
      return [
        start,
        createDot(start.left, end.top + 100),
        createDot(end.left - 50, end.top + 100),
        createDot(end.left - 50, end.top),
        end
      ]
    } else if (dx < 100 && dy > 200) {
      return [
        start,
        createDot(start.left, start.top + 50),
        createDot(start.left - 150, start.top + 50),
        createDot(start.left - 150, end.top),
        end
      ]
    } else if (dx < -50 && dy < -50) {
      return [start, createDot(start.left, end.top), end]
    } else {
      return [
        start,
        createDot(start.left, start.top + 50),
        createDot(end.left - 50, start.top + 50),
        createDot(end.left - 50, end.top),
        end
      ]
    }
  }
  if (positionFrom === "bt" && positionTo === "rt") {
    if (dx < -100 && dy > 50) {
      return [
        start,
        createDot(start.left, start.top + 50),
        createDot(end.left + 50, start.top + 50),
        createDot(end.left + 50, end.top),
        end
      ]
    } else if (dx < -250 && dy > -150) {
      return [
        start,
        createDot(start.left, end.top + 100),
        createDot(end.left + 50, end.top + 100),
        createDot(end.left + 50, end.top),
        end
      ]
    } else if (dx > -100 && dy > 200) {
      return [
        start,
        createDot(start.left, start.top + 50),
        createDot(start.left + 150, start.top + 50),
        createDot(start.left + 150, end.top),
        end
      ]
    } else if (dx > 50 && dy < -50) {
      return [start, createDot(start.left, end.top), end]
    } else {
      return [
        start,
        createDot(start.left, start.top + 50),
        createDot(end.left + 50, start.top + 50),
        createDot(end.left + 50, end.top),
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
          left: nextDot.left >= dot.left ? dot.left - 2 : nextDot.left,
          top: nextDot.top >= dot.top ? dot.top - 2 : nextDot.top - 1,
          width:
            nextDot.left === dot.left ? 2 : Math.abs(nextDot.left - dot.left),
          height:
            nextDot.top === dot.top ? 2 : Math.abs(nextDot.top - dot.top) + 1
        }
      }
    })
    .filter(Boolean)

  return { pathDots: dots, lines }
}

// OLD POSITIONS
// if (positionFrom === "up" && positionTo === "up") {
//   dots = [
//     start,
//     { left: start.left, top: start.top - ELEM_HEIGHT / 2 },
//     { left: end.left, top: start.top - ELEM_HEIGHT / 2 },
//     end
//   ]
// }
// if (positionFrom === "up" && positionTo === "lt") {
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
// if (positionFrom === "up" && positionTo === "rt") {
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
// if (positionFrom === "up" && positionTo === "bt") {
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
// if (positionFrom === "lt" && positionTo === "up") {
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
// if (positionFrom === "rt" && positionTo === "lt") {
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
// if (positionFrom === "lt" && positionTo === "bt") {
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
// if (positionFrom === "rt" && positionTo === "up") {
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
// if (positionFrom === "rt" && positionTo === "bt") {
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
// if (positionFrom === "bt" && positionTo === "up") {
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
// if (positionFrom === "bt" && positionTo === "lt") {
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
// if (positionFrom === "bt" && positionTo === "rt") {
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
// if (positionFrom === "bt" && positionTo === "bt") {
//   dots = [
//     start,
//     { left: start.left, top: start.top + ELEM_HEIGHT / 2 },
//     { left: end.left, top: start.top + ELEM_HEIGHT / 2 },
//     end
//   ]
// }
