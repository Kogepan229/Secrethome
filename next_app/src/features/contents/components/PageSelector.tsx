import 'server-only'
import { SearchParams } from 'types/SearchParams'
import css from './PageSelector.module.scss'
import { getCurrentPageIndex, getTotalContentsPageNum } from '../util'

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
  searchParams,
  totalPageNum,
}: {
  baseURL: string
  searchParams?: SearchParams
  totalPageNum?: number
}) => {
  const _totalPageNum = totalPageNum ?? (await getTotalContentsPageNum())
  let pageNums = []

  let currentPageNum = getCurrentPageIndex(searchParams!)

  if (_totalPageNum <= 5) {
    for (let i = 1; i <= _totalPageNum; i++) {
      pageNums.push(i)
    }
  } else if (currentPageNum <= 2) {
    pageNums = [1, 2, 3, _totalPageNum - 1, _totalPageNum]
  } else if (currentPageNum >= _totalPageNum - 1) {
    pageNums = [1, 2, _totalPageNum - 2, _totalPageNum - 1, _totalPageNum]
  } else {
    pageNums = [1, currentPageNum - 1, currentPageNum, currentPageNum + 1, _totalPageNum]
  }

  const buttons = pageNums.map(num => {
    return <PageNumButton baseURL={baseURL} num={num} isCurrent={num == currentPageNum} key={num} />
  })

  return <div className={css.page_selector}>{buttons}</div>
}

export default PageSelector
