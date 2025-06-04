function getPagination(totalItems, currentPage = 1, limit = 10) {
  const totalPages = Math.ceil(totalItems / limit);
  const hasNext = currentPage < totalPages;
  const hasPrev = currentPage > 1;

  return {
    totalPages,
    hasNext,
    hasPrev,
  };
}

export default getPagination;