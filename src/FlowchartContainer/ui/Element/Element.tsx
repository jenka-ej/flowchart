import { ELEM_HEIGHT, ELEM_WIDTH } from "../../const"
import { IElementProps } from "../../model/types"
import styles from "./Element.module.scss"
import { useElement } from "./lib/useElement"
import { ElementInnerContent } from "./ui/ElementInnerContent"
import { ElementPanel } from "./ui/ElementPanel"

export const Element = (props: IElementProps) => {
  const {
    elementStyles,
    innerElementStyles,
    isDraggingElement,
    handlePointerDownElement,
    handlePointerMoveElement,
    handlePointerUpElement,
    elementRef,
    thisElementClicked,
    handleDeleteItem,
    element,
    clickedItem,
    handleClickElement
  } = useElement(props)

  return (
    <>
      {/* Всплывашка для элемента при нажатии */}
      <ElementPanel
        element={element}
        clickedItem={clickedItem}
        thisElementClicked={thisElementClicked}
        isDraggingElement={isDraggingElement}
        handleDeleteItem={handleDeleteItem}
      />

      {/* Тело элемента */}
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
        {/* Внутренний контент элемента (название и айди) */}
        <ElementInnerContent
          isDraggingElement={isDraggingElement}
          innerElementStyles={innerElementStyles}
          element={element}
        />
      </div>
    </>
  )
}
