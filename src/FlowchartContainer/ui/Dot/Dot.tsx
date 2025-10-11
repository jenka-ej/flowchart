import { type IDotProps } from 'widgets/FlowchartContainer/model/types';
import { useDot } from './lib/useDot';

export const Dot = (props: IDotProps) => {
  const { dot, dotRef, lineColor, handlePointerDownDot, handlePointerMoveDot, handlePointerUpDot } = useDot(props);

  return (
    <circle 
      cx={dot.left}
      cy={dot.top}
      r={6}
      ref={dotRef}
      fill={lineColor()}
      onPointerDown={handlePointerDownDot}
      onPointerMove={handlePointerMoveDot}
      onPointerUp={handlePointerUpDot}
      style={{ cursor: 'grab' }}
    />
  );
};
