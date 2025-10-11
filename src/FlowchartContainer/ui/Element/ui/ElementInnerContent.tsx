import { IFlowchartElement } from "../../../model/types"
import styles from "../Element.module.scss"

interface IElementInnerContent {
  isDraggingElement: React.MutableRefObject<boolean>
  innerElementStyles: () =>
    | {
        color: string
      }
    | undefined
  element: IFlowchartElement
}

export const ElementInnerContent = ({
  isDraggingElement,
  innerElementStyles,
  element
}: IElementInnerContent) => (
  <div className={styles.element_inner} style={{ ...innerElementStyles() }}>
    <div
      className={styles.element_inner_text}
      style={{ opacity: isDraggingElement.current ? "0.3" : "1" }}
    >
      {element.elementData.name}
    </div>
    <div className={styles.element_inner_id}>{element.elementId}</div>
  </div>
)
