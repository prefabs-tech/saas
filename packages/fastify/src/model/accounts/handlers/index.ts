import create from "./create";
import remove from "./delete";
import getById from "./getById";
import list from "./list";
import myAccount from "./myAccount";
import myAccounts from "./myAccounts";
import update from "./update";
import updateMyAccount from "./updateMyAccount";

export default {
  create,
  delete: remove,
  getById,
  list,
  myAccount,
  myAccounts,
  update,
  updateMyAccount,
};
