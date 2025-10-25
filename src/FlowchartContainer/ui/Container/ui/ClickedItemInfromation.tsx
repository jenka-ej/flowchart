import { IFlowchartArrow, IFlowchartElement } from "../../../model/types"
import styles from "../Container.module.scss"

interface IClickedItemInformationProps {
  clickedItem: IFlowchartElement | IFlowchartArrow | null
  elements: IFlowchartElement[]
  arrows: IFlowchartArrow[]
}

export const ClickedItemInformation = ({
  clickedItem,
  elements,
  arrows
}: IClickedItemInformationProps) => {
  if (clickedItem) {
    if ("elementId" in clickedItem) {
      const previousChainedElementsId = arrows
        .filter((arrow) => arrow.idElementTo === clickedItem.elementId)
        .map(({ idElementFrom }) => idElementFrom)
      const previousChainedElementsName = elements
        .filter((element) =>
          previousChainedElementsId.includes(element.elementId)
        )
        .map((element) => element.elementData.name)
        .join(", ")
      const nextChainedElementsId = arrows
        .filter((arrow) => arrow.idElementFrom === clickedItem.elementId)
        .map(({ idElementTo }) => idElementTo)
      const nextChainedElementsName = elements
        .filter((element) => nextChainedElementsId.includes(element.elementId))
        .map((element) => element.elementData.name)
        .join(", ")
      return (
        <div className={styles.clickedItemInformation}>
          <div>{`Название - ${clickedItem.elementData.name}`}</div>
          <div>{`ID элемента - ${clickedItem.elementId}`}</div>
          <div className={styles.textEllipsis}>
            {`Входящие элементы - ${
              previousChainedElementsName || "отсутствуют"
            }`}
          </div>
          <div className={styles.textEllipsis}>
            {`Исходящие элементы - ${nextChainedElementsName || "отсутствуют"}`}
          </div>
        </div>
      )
    }
    const elementFrom = elements.find(
      ({ elementId }) => elementId === clickedItem.idElementFrom
    )
    const elementTo = elements.find(
      ({ elementId }) => elementId === clickedItem.idElementTo
    )
    return (
      <div className={styles.clickedItemInformation}>
        <div>{`ID связи - ${clickedItem.arrowId}`}</div>
        <div>{`Начальный элемент - ${elementFrom?.elementData.name}`}</div>
        <div>{`Конечный элемент - ${elementTo?.elementData.name}`}</div>
      </div>
    )
  }
}
