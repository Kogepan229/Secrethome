import css from './ContentsGridHeader.module.scss'

export const ContentsGridHeader = ({ title }: { title: string }) => {
  return <h3 className={css.header}>{title}</h3>
}
