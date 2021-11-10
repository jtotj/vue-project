import { isMobile } from 'mobile-device-detect'
export default class PageHandler {
  point = 0

  constructor(total_count, total_page, cur_page, page_count = 10) {
    if (isMobile) {
      page_count = 5
    }

    let page_group = Math.ceil(cur_page / page_count)

    let last_page = page_group * page_count
    if (last_page > total_page) {
      last_page = total_page
    }

    let first_page = page_count * (page_group - 1) + 1

    if (first_page < 1) {
      first_page = 1
    }
    if (total_page > page_count && first_page + page_count - 1 > total_page) {
      first_page -= first_page + page_count - 1 - total_page
    }
    this.first_page = first_page
    this.last_page = last_page

    if (total_page < this.page_count) {
      this.page_count = total_page
    }
  }

  getNextPage() {
    let page = this.first_page + this.point++
    if (this.point > this.page_count || page > this.last_page) {
      page = 0
    }

    return page
  }

  getPage(offset) {
    return Math.max(Math.min(this.cur_page + offset, this.total_page), 0)
  }
}
