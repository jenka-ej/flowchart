import { IFlowchartElement } from "../../../model/types"
import styles from "../Element.module.scss"

interface IElementInnerContentProps {
  isDraggingElement: React.MutableRefObject<boolean>
  element: IFlowchartElement
}

export const ElementInnerContent = ({
  isDraggingElement,
  element
}: IElementInnerContentProps) => (
  <div className={styles.element_inner} style={{ color: "black" }}>
    <div
      className={styles.element_inner_text}
      style={{ opacity: isDraggingElement.current ? "0.3" : "1" }}
    >
      {element.elementData.name}
    </div>
  </div>
)
