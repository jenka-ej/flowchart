import styles from "../Container.module.scss"

interface IZoomInformation {
  zoom: number
}

export const ZoomInformation = ({ zoom }: IZoomInformation) => (
  <div className={styles.zoomInformation}>{`${Math.round(zoom * 100)} %`}</div>
)
