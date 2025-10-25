import { PlusOutlined, RedoOutlined, UndoOutlined } from "@ant-design/icons"
import { Button } from "antd"
import { IAvailableState } from "../../../model/types"
import styles from "../Container.module.scss"

interface IBaseContainerPanelProps {
  availableStates: IAvailableState[]
  handleUndoOrRedoMove: (type: string) => void
  handleAddElement: () => void
}

export const BaseContainerPanel = ({
  availableStates,
  handleUndoOrRedoMove,
  handleAddElement
}: IBaseContainerPanelProps) => (
  <div className={styles.baseContainerPanel}>
    <Button
      className={styles.baseContainerPanel__button}
      disabled={
        availableStates.length < 2 ||
        availableStates[0].active ||
        (availableStates.length === 10 && availableStates[1].active)
      }
      onClick={() => handleUndoOrRedoMove("undo")}
    >
      <UndoOutlined />
    </Button>
    <Button
      className={styles.baseContainerPanel__button}
      disabled={
        availableStates.length < 2 ||
        availableStates[availableStates.length - 1].active
      }
      onClick={() => handleUndoOrRedoMove("redo")}
    >
      <RedoOutlined />
    </Button>
    <Button
      className={styles.baseContainerPanel__button}
      onClick={handleAddElement}
    >
      <PlusOutlined />
    </Button>
  </div>
)
