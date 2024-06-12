export const paginateData = (
  page: number,
  pageSize: number,
  count: number,
  data: any,
) => {
  // calculate prevPage and nextPage
  const prevPage = page > 1 ? page - 1 : null;
  const nextPage = pageSize * page < count ? page + 1 : null;

  // pagination metadata
  const pagination = {
    totalData: count,
    totalPages: Math.ceil(count / pageSize),
    currentPage: page,
    pageSize: pageSize,
    nextPage: nextPage,
    prevPage: prevPage,
  };

  return {
    pagination,
    data,
  };
};
