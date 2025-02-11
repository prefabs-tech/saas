import { formatDate, BaseService } from "@dzangolab/fastify-slonik";

import CustomerInvitationSqlFactory from "./sqlFactory";
import getSaasConfig from "../../config";

import type { FilterInput, Service } from "@dzangolab/fastify-slonik";
import type { QueryResultRow } from "slonik";

class CustomerInvitationService<
    CustomerInvitation extends QueryResultRow,
    CustomerInvitationCreateInput extends QueryResultRow,
    CustomerInvitationUpdateInput extends QueryResultRow,
  >
  extends BaseService<
    CustomerInvitation,
    CustomerInvitationCreateInput,
    CustomerInvitationUpdateInput
  >
  // eslint-disable-next-line prettier/prettier
  implements Service<CustomerInvitation, CustomerInvitationCreateInput, CustomerInvitationUpdateInput> {
  deleteByIdAndCustomerId = async (
    id: number | string,
    customerId: string,
  ): Promise<CustomerInvitation | null> => {
    const query = this.factory.getDeleteByIdAndCustomerIdSql(id, customerId);

    const result = await this.database.connect((connection) => {
      return connection.maybeOne(query);
    });

    return result;
  };

  create = async (
    data: CustomerInvitationCreateInput,
  ): Promise<CustomerInvitation | undefined> => {
    const filters = {
      AND: [
        { key: "customerId", operator: "eq", value: data.customerId },
        { key: "email", operator: "eq", value: data.email },
        { key: "acceptedAt", operator: "eq", value: "null" },
        { key: "expiresAt", operator: "gt", value: formatDate(new Date()) },
        { key: "revokedAt", operator: "eq", value: "null" },
      ],
    } as FilterInput;

    const validInvitationCount = await this.count(filters);

    // only one valid invitation is allowed per email per customer
    if (validInvitationCount > 0) {
      throw new Error(
        `Invitation already exists for email '${data.email}' for customerId '${data.customerId}'`,
      );
    }

    const query = this.factory.getCreateSql(data);

    const result = (await this.database.connect(async (connection) => {
      return connection.query(query).then((data) => {
        return data.rows[0];
      });
    })) as CustomerInvitation;

    return result ? this.postCreate(result) : undefined;
  };

  findByToken = async (token: string): Promise<CustomerInvitation | null> => {
    if (!this.validateUUID(token)) {
      // eslint-disable-next-line unicorn/no-null
      return null;
    }

    const query = this.factory.getFindByTokenSql(token);

    const result = await this.database.connect((connection) => {
      return connection.maybeOne(query);
    });

    return result;
  };

  get factory() {
    if (!this.table) {
      throw new Error(`Service table is not defined`);
    }

    if (!this._factory) {
      this._factory = new CustomerInvitationSqlFactory<
        CustomerInvitation,
        CustomerInvitationCreateInput,
        CustomerInvitationUpdateInput
      >(this);
    }

    return this._factory as CustomerInvitationSqlFactory<
      CustomerInvitation,
      CustomerInvitationCreateInput,
      CustomerInvitationUpdateInput
    >;
  }

  get saasConfig() {
    return getSaasConfig(this.config);
  }

  get table() {
    return this.saasConfig.tables.customerInvitations.name;
  }

  protected validateUUID = (uuid: string): boolean => {
    const regexp = /^[\da-f]{8}(?:\b-[\da-f]{4}){3}\b-[\da-f]{12}$/gi;

    return regexp.test(uuid);
  };
}

export default CustomerInvitationService;
