import { Op } from "sequelize";
function buildSearchClause(searchTerm) {
  if (!searchTerm || searchTerm.trim() === "") {
    return {};
  }

  const trimmed = searchTerm.trim();

  return {
    [Op.or]: [
      { title: { [Op.iLike]: `%${trimmed}%` } },
      { description: { [Op.iLike]: `%${trimmed}%` } },
    ],
  };
}

export default buildSearchClause;