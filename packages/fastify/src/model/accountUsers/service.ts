import AccountUserSqlFactory from "./sqlFactory";
import getSaasConfig from "../../config";
import AccountAwareBaseService from "../../service";
import {
  AccountUser,
  AccountUserCreateInput,
  AccountUserUpdateInput,
} from "../../types";

class AccountUserService extends AccountAwareBaseService<
  AccountUser,
  AccountUserCreateInput,
  AccountUserUpdateInput
> {
  async getUsers(): Promise<readonly AccountUser[]> {
    const query = this.factory.getUsersSql();

    const result = await this.database.connect((connection) => {
      return connection.any(query);
    });

    return result as readonly AccountUser[];
  }

  get factory() {
    return super.factory as AccountUserSqlFactory;
  }

  get saasConfig() {
    return getSaasConfig(this.config);
  }

  get sqlFactoryClass() {
    return AccountUserSqlFactory;
  }
}

export default AccountUserService;
