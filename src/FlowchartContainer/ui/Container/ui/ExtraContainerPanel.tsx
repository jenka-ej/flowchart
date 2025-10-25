import { DeleteOutlined } from "@ant-design/icons"
import { Input } from "antd"
import { IFlowchartArrow, IFlowchartElement } from "../../../model/types"
import styles from "../Container.module.scss"

interface IExtraContainerPanelProps {
  clickedItem: IFlowchartElement | IFlowchartArrow | null
  handleDeleteItem: (item: IFlowchartElement | IFlowchartArrow) => void
}

export const ExtraContainerPanel = ({
  clickedItem,
  handleDeleteItem
}: IExtraContainerPanelProps) => {
  if (clickedItem && "elementId" in clickedItem) {
    return (
      <div className={styles.extraContainerPanel}>
        <DeleteOutlined />
        <Input />
      </div>
    )
  }
}
