import { IFlowchartArrow, IFlowchartElement } from "../../../model/types"
import { ExtraContainerPanel } from "../../Container/ui/ExtraContainerPanel"

interface IElementPanel {
  element: IFlowchartElement
  clickedItem: IFlowchartElement | IFlowchartArrow | null
  thisElementClicked: boolean
  isDraggingElement: React.MutableRefObject<boolean>
  handleDeleteItem: (item: IFlowchartElement | IFlowchartArrow) => void
}

export const ElementPanel = ({
  element,
  clickedItem,
  thisElementClicked,
  isDraggingElement,
  handleDeleteItem
}: IElementPanel) => {
  if (thisElementClicked && !isDraggingElement.current) {
    return (
      <div
        style={{
          position: "absolute",
          transform: `translate(${element.left - 62}px, ${element.top - 70}px)`,
          padding: "10px",
          backgroundColor: "#FFFFFF",
          borderRadius: "10px",
          boxShadow: "rgba(0, 0, 0, 0.15) 0px 0px 0px 1px",
          zIndex: 4
        }}
      >
        <ExtraContainerPanel
          clickedItem={clickedItem}
          handleDeleteItem={handleDeleteItem}
        />
      </div>
    )
  }
  return <></>
}
