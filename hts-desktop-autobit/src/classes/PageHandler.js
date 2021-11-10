import php from 'phpjs'

var Self = function (total_count, total_page, cur_page, page_count) {

  if(typeof page_count === 'undefined') {
    page_count = 10;
  }

  this.total_count = total_count;
  this.total_page = total_page;
  this.cur_page = cur_page;
  this.page_count = page_count;
  this.point = 0;

  var first_page = cur_page - Math.floor(page_count / 2);
  if(first_page < 1) {
    first_page = 1;
  }

  if(total_page > page_count && first_page + page_count - 1 > total_page) {
    first_page -= first_page + page_count - 1 - total_page;
  }

  var last_page = total_page;
  if(last_page > total_page) {
    last_page = total_page;
  }

  this.first_page = first_page;
  this.last_page = last_page;

  if(total_page < this.page_count) {
    this.page_count = total_page;
  }
};

/**
 * request next page
 * @return int next page number
 */
Self.prototype.getNextPage = function() {
  var page = this.first_page + this.point++;
  if(this.point > this.page_count || page > this.last_page) {
    page = 0;
  }

  return page;
};

/**
 * return number of page that added offset.
 * @param int $offset
 * @return int
 */
Self.prototype.getPage = function(offset) {
  return php.max(php.min(this.cur_page + offset, this.total_page), '');
};

export default Self;
