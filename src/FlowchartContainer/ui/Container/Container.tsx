import { Arrow } from "../Arrow/Arrow"
import { Element } from "../Element/Element"
import styles from "./Container.module.scss"
import { useContainer } from "./lib/useContainer"
import { BaseContainerPanel } from "./ui/BaseContainerPanel"
import { ClickedItemInformation } from "./ui/ClickedItemInfromation"
import { PointGridBackground } from "./ui/PointGridBackground"

export const Container = () => {
  const {
    elements,
    arrows,
    getOrderForArrows,
    containerRef,
    layerRef,
    availableStates,
    layerSize,
    handleMoveElement,
    handleMoveElementEnd,
    clickedItem,
    setClickedItem,
    selectedChain,
    setSelectedChain,
    handleAddElement,
    handleDeleteItem,
    handleChainFinal,
    handleUndoOrRedoMove,
    elementIdsConnectedWithClickedElement,
    handleKeyPress
  } = useContainer()

  return (
    <div style={{ position: "relative" }} onKeyDown={handleKeyPress}>
      {/* Панель Undo и Redo слева сверху */}
      <BaseContainerPanel
        availableStates={availableStates}
        handleUndoOrRedoMove={handleUndoOrRedoMove}
        handleAddElement={handleAddElement}
      />

      {/* Информация о кликнутом элементе справа снизу */}
      <ClickedItemInformation
        clickedItem={clickedItem}
        elements={elements}
        arrows={arrows}
      />

      {/* Компонент container, как окошко внутри которого скролл */}
      <div ref={containerRef} tabIndex={-1} className={styles.Container}>
        {/* Компонент layer, который является огромным полотном с элементами и стрелками */}
        <div
          ref={layerRef}
          className={styles.Layer}
          style={{
            width: layerSize.x,
            height: layerSize.y
          }}
        >
          {/* Задний фон для полотна */}
          <PointGridBackground />

          {/* Элементы */}
          {elements.map((element) => (
            <Element
              key={element.elementId}
              element={element}
              handleMoveElement={handleMoveElement}
              handleMoveElementEnd={handleMoveElementEnd}
              containerRef={containerRef}
              selectedChain={selectedChain}
              setSelectedChain={setSelectedChain}
              handleChainFinal={handleChainFinal}
              handleDeleteItem={handleDeleteItem}
              clickedItem={clickedItem}
              setClickedItem={setClickedItem}
              thisElementIsConnectedWithClickedElement={Boolean(
                elementIdsConnectedWithClickedElement &&
                  elementIdsConnectedWithClickedElement.includes(
                    element.elementId
                  )
              )}
              chainSelectedAndThisElementIsChained={Boolean(
                selectedChain && selectedChain.elementId === element.elementId
              )}
              chainSelectedAndThisElementNotChained={Boolean(
                selectedChain &&
                  selectedChain.elementId !== element.elementId &&
                  !arrows.find(
                    (arrow) =>
                      arrow.idElementFrom === selectedChain.elementId &&
                      arrow.idElementTo === element.elementId
                  )
              )}
            />
          ))}

          {/* Огромный SVG компонент, внутри которого стрелки */}
          <svg
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%"
            }}
          >
            {/* Правильный порядок стрелок (если какая-то стрелка нажата, то она в конце массива) */}
            {getOrderForArrows().map((arrow) => (
              <Arrow
                key={arrow.arrowId}
                arrow={arrow}
                arrows={arrows}
                elements={elements}
                elementFrom={
                  elements.find(
                    (element) => arrow.idElementFrom === element.elementId
                  )!
                }
                elementTo={
                  elements.find(
                    (element) => arrow.idElementTo === element.elementId
                  )!
                }
                clickedItem={clickedItem}
                setClickedItem={setClickedItem}
              />
            ))}
          </svg>
        </div>
      </div>
    </div>
  )
}
