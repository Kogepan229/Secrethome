import 'server-only'
import css from './PageSelector.module.scss'

const PageNumButton = ({ baseURL, num, isCurrent }: { baseURL: string; num: number; isCurrent: boolean }) => {
  let url = baseURL
  if (num != 1) {
    if (url.includes('?')) {
      url = `${url}&page=${num}`
    } else {
      url = `${url}?page=${num}`
    }
  }

  return (
    <a href={url}>
      <div className={css.page_num_button} data-current={isCurrent}>
        {num}
      </div>
    </a>
  )
}

const PageSelector = async ({
  baseURL,
  totalPageNum,
  currentPageIndex,
}: {
  baseURL: string
  totalPageNum: number
  currentPageIndex: number
}) => {
  let pageNums = []

  if (totalPageNum <= 5) {
    for (let i = 1; i <= totalPageNum; i++) {
      pageNums.push(i)
    }
  } else if (currentPageIndex <= 2) {
    pageNums = [1, 2, 3, totalPageNum - 1, totalPageNum]
  } else if (currentPageIndex >= totalPageNum - 1) {
    pageNums = [1, 2, totalPageNum - 2, totalPageNum - 1, totalPageNum]
  } else {
    pageNums = [1, currentPageIndex - 1, currentPageIndex, currentPageIndex + 1, totalPageNum]
  }

  const buttons = pageNums.map(num => {
    return <PageNumButton baseURL={baseURL} num={num} isCurrent={num == currentPageIndex} key={num} />
  })

  return <div className={css.page_selector}>{buttons}</div>
}

export default PageSelector
