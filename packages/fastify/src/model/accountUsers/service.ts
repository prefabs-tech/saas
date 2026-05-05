import getSaasConfig from "../../config";
import AccountAwareBaseService from "../../service";
import {
  AccountUser,
  AccountUserCreateInput,
  AccountUserUpdateInput,
} from "../../types";
import AccountUserSqlFactory from "./sqlFactory";

class AccountUserService extends AccountAwareBaseService<
  AccountUser,
  AccountUserCreateInput,
  AccountUserUpdateInput
> {
  get factory() {
    return super.factory as AccountUserSqlFactory;
  }

  get saasConfig() {
    return getSaasConfig(this.config);
  }

  get sqlFactoryClass() {
    return AccountUserSqlFactory;
  }

  async getUsers(): Promise<readonly AccountUser[]> {
    const query = this.factory.getUsersSql();

    const result = await this.database.connect((connection) => {
      return connection.any(query);
    });

    return result as readonly AccountUser[];
  }
}

export default AccountUserService;
