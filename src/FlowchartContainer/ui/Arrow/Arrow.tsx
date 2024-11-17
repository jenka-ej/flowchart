import { memo, useCallback, useMemo } from "react"
import { classNames } from "shared/lib/classNames/classNames"
import { formArrowDots, formLines, formStartEndDots } from "../../lib"
import { LayerType, LineChangeProp } from "../../model/types/BlockSchema"
import cls from "./Arrow.module.css"

interface ArrowProps {
  className?: string
  id: number
  from: {
    left: number
    top: number
    id: number
  }
  to: {
    left: number
    top: number
    id: number
  }
  pos_from: "lt" | "rt"
  pos_to: "lt" | "rt"
  dots: LineChangeProp[] | undefined
  option_data: any
  handleDelete?: (id: number | { from: number; to: number }) => void
  onSelectArrow?: (
    id: number,
    id_from: number,
    id_to: number,
    option_data: any,
    type: "opt" | "drag",
    additional?: any
  ) => void
  setSelectedArrow: (p: any) => void
  setSelected: (P: any) => void
  type: LayerType
  selectedArrow:
    | {
        id: number
        id_from: number
        id_to: number
        option_data: any
        type: "opt" | "drag"
        additional?: any
      }
    | undefined
  optArrow?: (
    id_from: number,
    id_to: number,
    option: number[],
    type: "opt" | "dot",
    end: boolean,
    additional?: any
  ) => void
}

export const Arrow = memo((props: ArrowProps) => {
  const {
    className,
    id,
    from,
    to,
    option_data,
    onSelectArrow,
    setSelectedArrow,
    setSelected,
    dots,
    pos_from,
    pos_to,
    handleDelete,
    type,
    selectedArrow,
    optArrow
  } = props

  const selectHandler = useCallback(
    (type: "opt" | "drag", additional?: any) => () => {
      setSelected([])
      if (type === "opt") {
        if (handleDelete) {
          return handleDelete?.({ from: from.id, to: to.id })
        }
        return onSelectArrow?.(
          id,
          from.id,
          to.id,
          option_data,
          type,
          additional
        )
      } else {
        return onSelectArrow?.(
          id,
          from.id,
          to.id,
          option_data,
          type,
          additional
        )
      }
    },
    [from.id, to.id, option_data, handleDelete]
  )

  const lines = useMemo(() => {
    const { end } = formStartEndDots(from, to, pos_from, pos_to)

    let arrowStyles = {
      left: end.left - 5,
      top: end.top - 12,
      rotate: `${pos_to === "lt" ? 90 : -90}deg`
    }

    let defaultDots = formArrowDots(from, to, pos_from, pos_to)
    let newDots = defaultDots?.map((dot, index) => {
      let editedDot = dot

      dots?.map((d) => {
        if (d.dot_index?.includes(index)) {
          editedDot = {
            ...editedDot,
            [d.direction]: editedDot[d.direction] + d.gap
          }
        }
      })

      return editedDot
    })

    if (newDots?.length && defaultDots?.length) {
      const { lines, pathDots } = formLines(newDots)
      const { lines: oldLines } = formLines(defaultDots)

      return (
        <>
          {/* {pathDots.map((dot) => (
            <div
              style={dot}
              className={classNames(cls.dot, {}, [className])}
            ></div>
          ))} */}
          {lines.map((line, i) => {
            const dragProps = type === LayerType.MOVE && {
              draggable: true,
              onDragStart: selectHandler("drag", {
                ...oldLines[i],
                canDrag: true
              }),
              onDragEnd: () => {
                if (type === LayerType.MOVE) {
                  optArrow?.(
                    selectedArrow?.id_from as number,
                    selectedArrow?.id_to as number,
                    selectedArrow?.option_data,
                    "dot",
                    true,
                    line?.dots
                  )
                }
                setSelectedArrow(undefined)
              },
              onDrop: (e: any) => {
                e.preventDefault()
                e.stopPropagation()
              }
            }

            return (
              <div
                {...dragProps}
                key={i}
                onClick={selectHandler("opt")}
                className={classNames(
                  type === LayerType.MOVE ? cls.line_grab : cls.line,
                  {},
                  [className]
                )}
                style={{
                  ...line?.styles
                }}
              >
                {option_data &&
                  option_data.options &&
                  option_data.options.length > 0 &&
                  i === Math.floor(lines.length / 2) && (
                    <div className={cls.line_inner}>
                      <div className={cls.line_option}>
                        {option_data.options?.length}
                      </div>
                    </div>
                  )}
              </div>
            )
          })}
          <div
            className={classNames(cls.traingle, {}, [className])}
            style={arrowStyles}
          >
            <div className={cls.traingle_inner}></div>
          </div>
        </>
      )
    } else {
      return <></>
    }
  }, [from, to, pos_from, pos_to, option_data, dots])

  return <>{lines}</>
})
