import 'server-only'
import { DB } from 'util/sql'
import { SearchParams } from 'types/SearchParams'
import { CONTENTS_NUM_PER_PAGE } from 'features/contents/const'
import css from './PageSelector.module.scss'

const getTotalContentsPageNum = async () => {
  let result = await DB.query<any[]>(`select count(*) from park_contents`)
  let totalNum = Math.ceil((result[0]['count(*)'] as number) / CONTENTS_NUM_PER_PAGE)
  return totalNum
}

const PageNumButton = ({ num, isCurrent }: { num: number; isCurrent: boolean }) => {
  return (
    <a href={num == 1 ? `/park/contents` : `/park/contents?page=${num}`}>
      <div className={css.page_num_button} data-current={isCurrent}>
        {num}
      </div>
    </a>
  )
}

const PageSelector = async ({ searchParams }: { searchParams?: SearchParams }) => {
  const totalPageNum = await getTotalContentsPageNum()
  let pageNums = []

  let currentPageNum = Number(searchParams?.page)
  currentPageNum = Number.isNaN(currentPageNum) || currentPageNum <= 0 ? 1 : currentPageNum

  if (totalPageNum <= 5) {
    for (let i = 1; i <= totalPageNum; i++) {
      pageNums.push(i)
    }
  } else if (currentPageNum <= 2) {
    pageNums = [1, 2, 3, totalPageNum - 1, totalPageNum]
  } else if (currentPageNum >= totalPageNum - 1) {
    pageNums = [1, 2, totalPageNum - 2, totalPageNum - 1, totalPageNum]
  } else {
    pageNums = [1, currentPageNum - 1, currentPageNum, currentPageNum + 1, totalPageNum]
  }

  const buttons = pageNums.map(num => {
    return <PageNumButton num={num} isCurrent={num == currentPageNum} key={num} />
  })

  return <div className={css.page_selector}>{buttons}</div>
}

export default PageSelector
