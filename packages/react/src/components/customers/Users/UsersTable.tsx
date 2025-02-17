import { AdditionalFormFields } from "@dzangolab/react-form";
import { useTranslation } from "@dzangolab/react-i18n";
import {
  TDataTable as DataTable,
  TDataTableProperties,
  TRequestJSON,
  IButtonProperties,
  TableColumnDefinition,
  Tag,
  formatDate,
  type DataActionsMenuProperties,
} from "@dzangolab/react-ui";
import { toast } from "react-toastify";

import { useDisableUserMutation } from "@/hooks/customers/UseDisableUserMutation";
import { useEnableUserMutation } from "@/hooks/customers/UseEnableUserMutation";
import { useGetUsersQuery } from "@/hooks/customers/UseGetUsersQuery";

import { CustomerInvitationModal } from "../Invitations";

import type {
  AddInvitationResponse,
  InvitationRoleOption,
  InvitationExpiryDateField,
  CustomerUser,
} from "@/types";

type VisibleColumn =
  | "name"
  | "email"
  | "roles"
  | "signedUpAt"
  | "status"
  | "actions"
  | string;

export type UsersTableProperties = Partial<
  Omit<
    TDataTableProperties<CustomerUser>,
    "data" | "dataActionsMenu" | "visibleColumns" | "fetchData"
  >
> & {
  customerId: string;
  additionalInvitationFields?: AdditionalFormFields;
  dataActionsMenu?:
    | ((
        user: CustomerUser,
        defaultActionsMenu: DataActionsMenuProperties<CustomerUser>,
      ) => DataActionsMenuProperties<CustomerUser>)
    | DataActionsMenuProperties<CustomerUser>;
  invitationButtonOptions?: IButtonProperties;
  invitationExpiryDateField?: InvitationExpiryDateField;
  roles?: Array<InvitationRoleOption>;
  showInviteAction?: boolean;
  visibleColumns?: VisibleColumn[];
  fetchUsers?: (arguments_: TRequestJSON) => void;
  onInvitationAdded?: (response: AddInvitationResponse) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUserEnabled?: (data: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUserDisabled?: (data: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prepareInvitationData?: (data: any) => any;
};

export const CustomerUsersTable = ({
  additionalInvitationFields,
  className = "table-customer-users",
  columns = [],
  customerId,
  dataActionsMenu,
  invitationButtonOptions,
  invitationExpiryDateField,
  roles,
  showInviteAction = true,
  totalRecords = 0,
  visibleColumns = [
    "email",
    "name",
    "roles",
    "signedUpAt",
    "status",
    "actions",
  ],
  fetchUsers,
  onInvitationAdded,
  onUserDisabled,
  onUserEnabled,
  prepareInvitationData,
  ...tableProperties
}: UsersTableProperties) => {
  const { t } = useTranslation("customer");

  const { data, loading, trigger: refetch } = useGetUsersQuery(customerId);

  const { trigger: triggerDisable } = useDisableUserMutation({
    onSuccess: (response) => {
      toast.success(t("users.messages.disable.success"));

      if (onUserDisabled) {
        onUserDisabled(response);
      }

      refetch();
    },
    onError: () => {
      toast.error(t("users.messages.disable.error"));
    },
  });

  const { trigger: triggerEnable } = useEnableUserMutation({
    onSuccess: (response) => {
      toast.success(t("users.messages.enable.success"));

      if (onUserEnabled) {
        onUserEnabled(response);
      }

      refetch();
    },
    onError: () => {
      toast.error(t("users.messages.enable.error"));
    },
  });

  const handleDisableUser = (user: CustomerUser) => {
    triggerDisable(customerId, user.id);
  };

  const handleEnableUser = (user: CustomerUser) => {
    triggerEnable(customerId, user.id);
  };

  const defaultColumns: Array<TableColumnDefinition<CustomerUser>> = [
    {
      accessorKey: "email",
      header: t("users.table.columns.email"),
      enableSorting: true,
      enableColumnFilter: true,
    },
    {
      id: "name",
      header: t("users.table.columns.name"),
      accessorFn: (original) => {
        return (
          (original.givenName ? original.givenName : "") +
            (original.middleNames ? " " + original.middleNames : "") +
            (original.surname ? " " + original.surname : "") || "-"
        );
      },
      cell: ({ getValue }) => {
        const value = getValue();

        return value;
      },
      enableColumnFilter: true,
    },
    {
      align: "center",
      id: "roles",
      header: t("users.table.columns.roles"),
      cell: ({ row: { original } }) => {
        const role = original.role || "";

        return (
          <>
            <Tag
              label={role}
              color={role === "SAAS_ACCOUNT_MEMBER" ? "default" : "green"}
              fullWidth
            />
          </>
        );
      },
    },
    {
      accessorKey: "signedUpAt",
      header: t("users.table.columns.signedUpOn"),
      cell: ({ row: { original } }) => {
        if (original.signedUpAt) {
          return formatDate(original.signedUpAt);
        }

        return "-";
      },
    },
    {
      align: "center",
      accessorKey: "status",
      header: t("users.table.columns.status"),
      cell: ({ row: { original } }) => {
        const color = original.disabled ? "red" : "green";

        return (
          <Tag
            label={
              original.disabled
                ? t("users.status.disabled")
                : t("users.status.enabled")
            }
            color={color}
            fullWidth
          />
        );
      },
    },
  ];

  const defaultActionsMenu: DataActionsMenuProperties<CustomerUser> = {
    actions: [
      {
        label: t("users.table.actions.enable"),
        icon: "pi pi-check",
        disabled: (user) => !user.disabled,
        onClick: handleEnableUser,
        requireConfirmationModal: true,
        confirmationOptions: {
          message: t("users.table.confirmation.messages.enable"),
          header: t("users.table.confirmation.header"),
        },
      },
      {
        label: t("users.table.actions.disable"),
        className: "danger",
        icon: "pi pi-times",
        disabled: (user) => user.disabled,
        onClick: handleDisableUser,
        requireConfirmationModal: true,
        confirmationOptions: {
          message: t("users.table.confirmation.messages.disable"),
          header: t("users.table.confirmation.header"),
        },
      },
    ],
  };

  const renderToolbar = () => {
    if (showInviteAction) {
      return (
        <div className="table-actions">
          <CustomerInvitationModal
            customerId={customerId}
            additionalInvitationFields={additionalInvitationFields}
            expiryDateField={invitationExpiryDateField}
            invitationButtonOptions={invitationButtonOptions}
            onSubmitted={onInvitationAdded}
            prepareData={prepareInvitationData}
            roles={roles}
          />
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <DataTable
      className={className}
      columns={[...defaultColumns, ...columns]}
      data={data || []}
      emptyTableMessage={t("app:table.emptyMessage")}
      renderToolbarItems={showInviteAction ? renderToolbar : undefined}
      totalRecords={data?.length || 0}
      visibleColumns={visibleColumns}
      paginationOptions={{
        pageInputLabel: t("users.table.pagination.pageControl"),
        itemsPerPageControlLabel: t("users.table.pagination.rowsPerPage"),
      }}
      dataActionsMenu={
        dataActionsMenu
          ? typeof dataActionsMenu === "function"
            ? (data) => dataActionsMenu(data, defaultActionsMenu)
            : dataActionsMenu
          : defaultActionsMenu
      }
      isLoading={loading}
      {...tableProperties}
    ></DataTable>
  );
};
