var Query = (function() {

  function query(orderBy) {
    this.page = 0;
    this.pageSize = 10;
    this.orderBy = orderBy;
    this.orderByDirection = 1;
  }

  query.prototype.setOrder = function (orderBy) {
    if (this.orderBy == orderBy)
      this.orderByDirection *= -1;
    else {
      this.orderByDirection = 1;
      this.orderBy = orderBy;
    }
  };

  return query;
}());
