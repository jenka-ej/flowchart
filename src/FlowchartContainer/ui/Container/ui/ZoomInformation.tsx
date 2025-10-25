import styles from "../Container.module.scss"

interface IZoomInformationProps {
  zoom: number
}

export const ZoomInformation = ({ zoom }: IZoomInformationProps) => (
  <div className={styles.zoomInformation}>{`${Math.round(zoom * 100)} %`}</div>
)
