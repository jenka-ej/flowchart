import { ELEM_HEIGHT, ELEM_WIDTH } from "../../const"
import { IElementProps } from "../../model/types"
import styles from "./Element.module.scss"
import { useElement } from "./lib/useElement"
import { ElementInnerContent } from "./ui/ElementInnerContent"
import { ElementMarker } from "./ui/ElementMarker"
import { ElementPanel } from "./ui/ElementPanel"

export const Element = (props: IElementProps) => {
  const {
    elementStyles,
    isDraggingElement,
    handlePointerDownElement,
    handlePointerMoveElement,
    handlePointerUpElement,
    handleChangeElementName,
    elementRef,
    thisElementClicked,
    chainSelectedAndThisElementIsChained,
    chainSelectedAndThisElementNotChained,
    handleDeleteItem,
    handleChainElementStart,
    handleChainElementEnd,
    selectedChain,
    element,
    handleClickElement
  } = useElement(props)

  return (
    <>
      <ElementPanel
        element={element}
        thisElementClicked={thisElementClicked}
        isDraggingElement={isDraggingElement}
        handleDeleteItem={handleDeleteItem}
        handleChangeElementName={handleChangeElementName}
      />
      <div
        style={{
          transform: `translate(${element.left}px, ${element.top}px)`,
          transition: "transform 0.02s ease-in-out",
          width: ELEM_WIDTH,
          height: ELEM_HEIGHT,
          ...elementStyles()
        }}
        className={styles.element}
        onPointerDown={handlePointerDownElement}
        onPointerMove={handlePointerMoveElement}
        onPointerUp={handlePointerUpElement}
        ref={elementRef}
        onClick={handleClickElement}
      >
        <ElementMarker
          thisElementClicked={thisElementClicked}
          selectedChain={selectedChain}
          chainSelectedAndThisElementNotChained={
            chainSelectedAndThisElementNotChained
          }
          chainSelectedAndThisElementIsChained={
            chainSelectedAndThisElementIsChained
          }
          handleChainElementStart={handleChainElementStart}
          handleChainElementEnd={handleChainElementEnd}
        />
        <ElementInnerContent
          isDraggingElement={isDraggingElement}
          element={element}
        />
      </div>
    </>
  )
}
