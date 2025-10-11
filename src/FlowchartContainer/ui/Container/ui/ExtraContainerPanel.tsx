import { DeleteOutlined } from "@ant-design/icons"
import { Input } from "antd"
import { IFlowchartArrow, IFlowchartElement } from "../../../model/types"
import styles from "../Container.module.scss"

interface IExtraContainerPanel {
  clickedItem: IFlowchartElement | IFlowchartArrow | null
  handleDeleteItem: (item: IFlowchartElement | IFlowchartArrow) => void
}

export const ExtraContainerPanel = ({
  clickedItem,
  handleDeleteItem
}: IExtraContainerPanel) => {
  if (clickedItem && "elementId" in clickedItem) {
    return (
      <div className={styles.extraContainerPanel}>
        <DeleteOutlined />
        <Input />
      </div>
    )
  }
}
