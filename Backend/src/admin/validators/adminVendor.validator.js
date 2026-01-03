export function validatePagination({ page, limit }) {
  if (page && page < 1) throw new Error("INVALID_PAGE");
  if (limit && limit < 1) throw new Error("INVALID_LIMIT");
}
