import { getDefaultDots } from "../../../lib"
import { IArrowProps } from "../../../model/types"

export const useArrow = ({
  arrow,
  arrows,
  elements,
  elementFrom,
  elementTo,
  clickedItem,
  setClickedItem
}: IArrowProps) => {
  const thisArrowClicked = Boolean(
    clickedItem &&
      "arrowId" in clickedItem &&
      clickedItem.arrowId === arrow.arrowId
  )

  const thisArrowHighlightAndIncoming = Boolean(
    clickedItem &&
      clickedItem &&
      "elementId" in clickedItem &&
      elementTo.elementId === clickedItem.elementId
  )

  const thisArrowHighlightAndOutgoing = Boolean(
    clickedItem &&
      clickedItem &&
      "elementId" in clickedItem &&
      elementFrom.elementId === clickedItem.elementId
  )

  const d = getDefaultDots(arrow, arrows, elements)
    .map((p, i) => (i === 0 ? `M ${p.left} ${p.top}` : `L ${p.left} ${p.top}`))
    .join(" ")

  const handleClickArrow = () => {
    if (thisArrowClicked) {
      setClickedItem(null)
    } else {
      setClickedItem(arrow)
    }
  }

  const lineColor = () => {
    if (thisArrowClicked || thisArrowHighlightAndIncoming) {
      return "#1677ff"
    }
    if (thisArrowHighlightAndOutgoing) {
      return "#ff7300"
    }
    return "rgb(228 228 228)"
  }

  return { arrow, d, lineColor, handleClickArrow }
}
