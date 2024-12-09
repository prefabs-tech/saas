import create from "./create";
import remove from "./delete";
import getById from "./getById";
import list from "./list";
import update from "./update";

export default {
  create,
  delete: remove,
  list,
  getById,
  update,
};
