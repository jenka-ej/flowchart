import { Arrow } from "../Arrow/Arrow"
import { Element } from "../Element/Element"
import styles from "./Container.module.scss"
import { useContainer } from "./lib/useContainer"
import { BaseContainerPanel } from "./ui/BaseContainerPanel"
import { ClickedItemInformation } from "./ui/ClickedItemInfromation"
import { PointGridBackground } from "./ui/PointGridBackground"
import { ZoomInformation } from "./ui/ZoomInformation"

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
    handleChain,
    handleMoveDotStart,
    handleMoveDot,
    handleMoveDotEnd,
    handleUndoOrRedoMove,
    elementIdsConnectedWithClickedElement,
    handleKeyPress,
    zoom,
    handleWheel
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

      {/* Информация о масштабе */}
      <ZoomInformation zoom={zoom} />

      {/* Компонент container, как окошко внутри которого скролл */}
      <div
        ref={containerRef}
        tabIndex={-1}
        className={styles.Container}
        onWheel={handleWheel}
      >
        {/* Компонент layer, который является огромным полотном с элементами и стрелками */}
        <div
          ref={layerRef}
          className={styles.Layer}
          style={{
            width: layerSize.x * zoom,
            height: layerSize.y * zoom,
            transformOrigin: "0, 0",
            transform: `scale(${zoom})`
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
              handleChain={handleChain}
              handleDeleteItem={handleDeleteItem}
              clickedItem={clickedItem}
              setClickedItem={setClickedItem}
              thisElementIsConnectedWithClickedElement={Boolean(
                elementIdsConnectedWithClickedElement &&
                  elementIdsConnectedWithClickedElement.includes(
                    element.elementId
                  )
              )}
              zoom={zoom}
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
                containerRef={containerRef}
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
                handleMoveDotStart={handleMoveDotStart}
                handleMoveDot={handleMoveDot}
                handleMoveDotEnd={handleMoveDotEnd}
                zoom={zoom}
              />
            ))}
          </svg>
        </div>
      </div>
    </div>
  )
}
