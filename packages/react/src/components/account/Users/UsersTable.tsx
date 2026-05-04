import { AdditionalFormFields } from "@prefabs.tech/react-form";
import { useTranslation } from "@prefabs.tech/react-i18n";
import {
  type DataActionsMenuProperties,
  TDataTable as DataTable,
  formatDate,
  IButtonProperties,
  TableColumnDefinition,
  Tag,
  TDataTableProperties,
} from "@prefabs.tech/react-ui";
import { toast } from "react-toastify";

import type {
  AccountUser,
  AddAccountInvitationResponse,
  InvitationExpiryDateField,
} from "@/types";

import { SAAS_ACCOUNT_OWNER } from "@/constants";
import {
  useDisableUserMutation,
  useEnableUserMutation,
  useGetUsersQuery,
} from "@/hooks";

import { AccountInvitationModal } from "../Invitations";

export type UsersTableProperties = Partial<
  Omit<
    TDataTableProperties<AccountUser>,
    "data" | "dataActionsMenu" | "fetchData" | "visibleColumns"
  >
> & {
  accountId: string;
  additionalInvitationFields?: AdditionalFormFields;
  dataActionsMenu?:
    | ((
        user: AccountUser,
        defaultActionsMenu: DataActionsMenuProperties<AccountUser>,
      ) => DataActionsMenuProperties<AccountUser>)
    | DataActionsMenuProperties<AccountUser>;
  invitationButtonOptions?: IButtonProperties;
  invitationExpiryDateField?: InvitationExpiryDateField;
  onInvitationAdded?: (response: AddAccountInvitationResponse) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUserDisabled?: (data: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUserEnabled?: (data: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prepareInvitationData?: (data: any) => any;
  roles?: string[];
  showInviteAction?: boolean;
  visibleColumns?: VisibleColumn[];
};

type VisibleColumn =
  | "actions"
  | "email"
  | "name"
  | "roles"
  | "signedUpAt"
  | "status"
  | string;

export const AccountUsersTable = ({
  accountId,
  additionalInvitationFields,
  className = "table-users",
  columns = [],
  dataActionsMenu,
  invitationButtonOptions,
  invitationExpiryDateField,
  onInvitationAdded,
  onUserDisabled,
  onUserEnabled,
  prepareInvitationData,
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
  ...tableProperties
}: UsersTableProperties) => {
  const { t } = useTranslation("account");

  const { data, loading, trigger: refetch } = useGetUsersQuery(accountId);

  const { trigger: triggerDisable } = useDisableUserMutation({
    onError: () => {
      toast.error(t("users.messages.disable.error"));
    },
    onSuccess: (response) => {
      toast.success(t("users.messages.disable.success"));

      if (onUserDisabled) {
        onUserDisabled(response);
      }

      refetch();
    },
  });

  const { trigger: triggerEnable } = useEnableUserMutation({
    onError: () => {
      toast.error(t("users.messages.enable.error"));
    },
    onSuccess: (response) => {
      toast.success(t("users.messages.enable.success"));

      if (onUserEnabled) {
        onUserEnabled(response);
      }

      refetch();
    },
  });

  const handleDisableUser = (user: AccountUser) => {
    triggerDisable(user.id);
  };

  const handleEnableUser = (user: AccountUser) => {
    triggerEnable(user.id);
  };

  const defaultColumns: Array<TableColumnDefinition<AccountUser>> = [
    {
      accessorKey: "email",
      enableColumnFilter: true,
      enableSorting: true,
      header: t("users.table.columns.email"),
    },
    {
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
      header: t("users.table.columns.name"),
      id: "name",
    },
    {
      align: "center",
      cell: ({ row: { original } }) => {
        const role = original.role || "";

        return (
          <>
            <Tag
              color={role === SAAS_ACCOUNT_OWNER ? "default" : "green"}
              fullWidth
              label={t(`users.roles.${role}`)}
            />
          </>
        );
      },
      header: t("users.table.columns.roles"),
      id: "roles",
    },
    {
      accessorKey: "signedUpAt",
      cell: ({ row: { original } }) => {
        if (original.signedUpAt) {
          return formatDate(original.signedUpAt);
        }

        return "-";
      },
      header: t("users.table.columns.signedUpOn"),
    },
    {
      accessorKey: "status",
      align: "center",
      cell: ({ row: { original } }) => {
        const color = original.disabled ? "red" : "green";

        return (
          <Tag
            color={color}
            fullWidth
            label={
              original.disabled
                ? t("users.status.disabled")
                : t("users.status.enabled")
            }
          />
        );
      },
      header: t("users.table.columns.status"),
    },
  ];

  const defaultActionsMenu: DataActionsMenuProperties<AccountUser> = {
    actions: [
      {
        confirmationOptions: {
          header: t("users.table.confirmation.header"),
          message: t("users.table.confirmation.messages.enable"),
        },
        disabled: (user) => !user.disabled,
        icon: "pi pi-check",
        label: t("users.table.actions.enable"),
        onClick: handleEnableUser,
        requireConfirmationModal: true,
      },
      {
        className: "danger",
        confirmationOptions: {
          header: t("users.table.confirmation.header"),
          message: t("users.table.confirmation.messages.disable"),
        },
        disabled: (user) => user.disabled,
        icon: "pi pi-times",
        label: t("users.table.actions.disable"),
        onClick: handleDisableUser,
        requireConfirmationModal: true,
      },
    ],
  };

  const renderToolbar = () => {
    if (showInviteAction) {
      return (
        <div className="table-actions">
          <AccountInvitationModal
            accountId={accountId}
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
      dataActionsMenu={
        dataActionsMenu
          ? typeof dataActionsMenu === "function"
            ? (data) => dataActionsMenu(data, defaultActionsMenu)
            : dataActionsMenu
          : defaultActionsMenu
      }
      emptyTableMessage={t("app:table.emptyMessage")}
      id="account-users-table"
      isLoading={loading}
      paginationOptions={{
        itemsPerPageControlLabel: t("users.table.pagination.rowsPerPage"),
        pageInputLabel: t("users.table.pagination.pageControl"),
      }}
      persistState={true}
      renderToolbarItems={showInviteAction ? renderToolbar : undefined}
      totalRecords={data?.length || 0}
      visibleColumns={visibleColumns}
      {...tableProperties}
    ></DataTable>
  );
};
