import { type IArrowProps } from 'widgets/FlowchartContainer/model/types';

export const useArrow = ({
  arrow,
  containerRef,
  staticOffset,
  elementFrom,
  elementTo,
  handleAddTemporaryDots,
  handleMoveDotStart,
  handleMoveDot,
  handleMoveDotEnd,
  clickedItem,
  setClickedItem,
  handleDeleteTemporaryDots,
  setShowElementOptions,
  zoom,
}: IArrowProps) => {
  // Эта стрелка кликнута

  const thisArrowClicked = Boolean(
    clickedItem
      && 'arrowId' in clickedItem
      && clickedItem.arrowId === arrow.arrowId,
  );

  // Эта стрелка подсвечивается и впадает в кликнутый элемент

  const thisArrowHighlightAndIncoming = Boolean(
    clickedItem
      && clickedItem
      && 'elementId' in clickedItem
      && elementTo.elementId === clickedItem.elementId,
  );

  // Эта стрелка подсвечивается и выходит из кликнутого элемента

  const thisArrowHighlightAndOutgoing = Boolean(
    clickedItem
      && clickedItem
      && 'elementId' in clickedItem
      && elementFrom.elementId === clickedItem.elementId,
  );

  // Координаты точек, соединенных вместей для отрисовки линии

  const d = arrow.dots.map((p, i) =>
    (i === 0 ? `M ${p.left} ${p.top}` : `L ${p.left} ${p.top}`)).join(' ');

  const handleClickArrow = () => {
    handleDeleteTemporaryDots();
    setShowElementOptions(false);
    if (thisArrowClicked) {
      setClickedItem(null);
    } else {
      handleAddTemporaryDots(arrow);
      setClickedItem(arrow);
    }
  };

  // Цвет линии
  
  const lineColor = () => {
    if (thisArrowClicked || thisArrowHighlightAndIncoming) {
      return '#1677ff';
    }
    if (thisArrowHighlightAndOutgoing) {
      return '#ff7300';
    }
    return 'rgb(228 228 228)';
  };

  return {
    arrow,
    d,
    setClickedItem,
    thisArrowClicked,
    lineColor,
    handleClickArrow,
    handleAddTemporaryDots,
    handleMoveDotStart,
    handleMoveDot,
    handleMoveDotEnd,
    containerRef,
    staticOffset,
    handleDeleteTemporaryDots,
    setShowElementOptions,
    zoom,
  };
};
