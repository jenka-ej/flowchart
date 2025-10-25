import { TChainFlowchartElement } from "../../../model/types"
import styles from "../Element.module.scss"

interface IElementMarkerProps {
  thisElementClicked: boolean
  selectedChain: TChainFlowchartElement | null
  chainSelectedAndThisElementNotChained: boolean
  chainSelectedAndThisElementIsChained: boolean
  handleChainElementStart: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void
  handleChainElementEnd: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void
}

export const ElementMarker = ({
  thisElementClicked,
  selectedChain,
  chainSelectedAndThisElementNotChained,
  chainSelectedAndThisElementIsChained,
  handleChainElementStart,
  handleChainElementEnd
}: IElementMarkerProps) => {
  if (thisElementClicked && !selectedChain) {
    return (
      <div
        className={styles.marker_right}
        onPointerDown={(e) => e.stopPropagation()}
        onPointerMove={(e) => e.stopPropagation()}
        onPointerUp={(e) => e.stopPropagation()}
        onClick={handleChainElementStart}
      />
    )
  } else if (chainSelectedAndThisElementNotChained) {
    return (
      <div
        className={styles.marker_left}
        onPointerDown={(e) => e.stopPropagation()}
        onPointerMove={(e) => e.stopPropagation()}
        onPointerUp={(e) => e.stopPropagation()}
        onClick={handleChainElementEnd}
      />
    )
  } else if (chainSelectedAndThisElementIsChained) {
    return (
      <div className={`${styles.marker_right} ${styles.marker_selected}`} />
    )
  } else {
    return <></>
  }
}
