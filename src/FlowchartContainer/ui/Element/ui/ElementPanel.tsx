import { DeleteOutlined } from "@ant-design/icons"
import { Button, Input } from "antd"
import { IFlowchartArrow, IFlowchartElement } from "../../../model/types"
import styles from "../Element.module.scss"

interface IElementPanel {
  element: IFlowchartElement
  thisElementClicked: boolean
  isDraggingElement: React.MutableRefObject<boolean>
  handleDeleteItem: (item: IFlowchartElement | IFlowchartArrow) => void
  handleChangeElementName: (element: IFlowchartElement) => void
}

export const ElementPanel = ({
  element,
  thisElementClicked,
  isDraggingElement,
  handleDeleteItem,
  handleChangeElementName
}: IElementPanel) => {
  if (thisElementClicked && !isDraggingElement.current) {
    return (
      <div
        className={styles.elementPanelWrapper}
        style={{
          transform: `translate(${element.left - 62}px, ${element.top - 70}px)`
        }}
      >
        <div className={styles.elementInnerPanel}>
          <Button
            className={styles.elementInnerPanel__button}
            onClick={() => handleDeleteItem(element)}
          >
            <DeleteOutlined />
          </Button>
          <Input
            maxLength={14}
            style={{ maxWidth: "130px" }}
            variant="filled"
            value={element.elementData.name}
            onChange={(e) =>
              handleChangeElementName({
                ...element,
                elementData: { name: e.target.value }
              })
            }
          />
        </div>
      </div>
    )
  }
  return <></>
}
