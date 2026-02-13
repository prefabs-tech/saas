import { AdditionalFormFields } from "@prefabs.tech/react-form";
import { useTranslation } from "@prefabs.tech/react-i18n";
import {
  TDataTable as DataTable,
  TDataTableProperties,
  IButtonProperties,
  TableColumnDefinition,
  Tag,
  formatDateTime,
} from "@prefabs.tech/react-ui";
import { useCallback } from "react";
import { toast } from "react-toastify";

import { SAAS_ACCOUNT_OWNER } from "@/constants";
import { useGetInvitationsQuery } from "@/hooks";
import {
  useDeleteInvitationMutation,
  useResendInvitationMutation,
  useRevokeInvitationMutation,
} from "@/hooks/accounts";
import { DeleteAccountInvitationResponse } from "@/types/account-invitation";

import { AccountInvitationModal } from "./InvitationModal";

import type {
  AddAccountInvitationResponse,
  ResendAccountInvitationResponse,
  RevokeAccountInvitationResponse,
  AccountInvitation,
  InvitationExpiryDateField,
} from "../../../types";

type VisibleColumn =
  | "email"
  | "role"
  | "expiresAt"
  | "status"
  | "actions"
  | string;

export type InvitationsTableProperties = Partial<
  Omit<
    TDataTableProperties<AccountInvitation>,
    "data" | "visibleColumns" | "fetchData"
  >
> & {
  accountId: string;
  additionalInvitationFields?: AdditionalFormFields;
  invitationButtonOptions?: IButtonProperties;
  invitationExpiryDateField?: InvitationExpiryDateField;
  roles?: string[];
  showInviteAction?: boolean;
  visibleColumns?: VisibleColumn[];
  onInvitationAdded?: (response: AddAccountInvitationResponse) => void;
  onInvitationDeleted?: (response: DeleteAccountInvitationResponse) => void;
  onInvitationResent?: (response: ResendAccountInvitationResponse) => void;
  onInvitationRevoked?: (response: RevokeAccountInvitationResponse) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prepareInvitationData?: (data: any) => any;
};

export const AccountInvitationsTable = ({
  additionalInvitationFields,
  className = "table-invitations",
  columns = [],
  accountId,
  invitationButtonOptions,
  invitationExpiryDateField,
  roles,
  showInviteAction = true,
  visibleColumns = ["email", "role", "expiresAt", "status", "actions"],
  onInvitationDeleted,
  onInvitationAdded,
  onInvitationResent,
  onInvitationRevoked,
  prepareInvitationData,
  ...tableOptions
}: InvitationsTableProperties) => {
  const { t } = useTranslation("account");

  const { data, loading, trigger: refetch } = useGetInvitationsQuery(accountId);

  const { trigger: triggerResend } = useResendInvitationMutation({
    onSuccess: (response) => {
      toast.success(t("invitations.messages.resend.success"));

      if (onInvitationResent) {
        onInvitationResent(response);
      }

      refetch();
    },
    onError: () => {
      toast.error(t("invitations.messages.resend.error"));
    },
  });

  const { trigger: triggerRevoke } = useRevokeInvitationMutation({
    onSuccess: (response) => {
      toast.success(t("invitations.messages.revoke.success"));

      if (onInvitationRevoked) {
        onInvitationRevoked(response);
      }

      refetch();
    },
    onError: () => {
      toast.error(t("invitations.messages.revoke.error"));
    },
  });

  const { trigger: triggereDelete } = useDeleteInvitationMutation({
    onSuccess: (response) => {
      toast.success(t("invitations.messages.delete.success"));

      if (onInvitationDeleted) {
        onInvitationDeleted(response);
      }

      refetch();
    },
    onError: () => {
      toast.error(t("invitations.messages.delete.error"));
    },
  });

  const handleResendInvitation = (invitation: AccountInvitation) => {
    triggerResend(accountId, invitation.id);
  };

  const handleRevokeInvitation = (invitation: AccountInvitation) => {
    triggerRevoke(accountId, invitation.id);
  };

  const handleDeleteInvitation = (invitation: AccountInvitation) => {
    triggereDelete(accountId, invitation.id);
  };

  const onInvitationSubmitted = useCallback(
    (invitation: AccountInvitation) => {
      onInvitationAdded && onInvitationAdded(invitation);
      refetch();
    },
    [onInvitationAdded, refetch],
  );

  const isExpired = (date?: string | Date | number) => {
    return !!(date && new Date(date) < new Date());
  };

  const defaultColumns: Array<TableColumnDefinition<AccountInvitation>> = [
    {
      accessorKey: "email",
      header: t("invitations.table.columns.email"),
      enableSorting: true,
      enableColumnFilter: true,
      enableGlobalFilter: true,
    },
    {
      align: "center",
      accessorKey: "role",
      header: t("invitations.table.columns.role"),
      cell: ({ getValue }) => {
        const role = (getValue() as string) || "";

        return (
          <Tag
            label={t(`users.roles.${role}`)}
            color={role === SAAS_ACCOUNT_OWNER ? "default" : "green"}
            fullWidth
          />
        );
      },
    },
    {
      align: "center",
      accessorKey: "status",
      header: t("invitations.table.columns.status"),
      cell: ({ row: { original } }) => {
        const { acceptedAt, revokedAt, expiresAt } = original;

        const getLabel = () => {
          if (acceptedAt) {
            return t("invitations.status.accepted");
          }
          if (revokedAt) {
            return t("invitations.status.revoked");
          }
          if (isExpired(expiresAt)) {
            return t("invitations.status.expired");
          }

          return t("invitations.status.pending");
        };

        const getColor = () => {
          if (acceptedAt) {
            return "green";
          }
          if (revokedAt) {
            return "red";
          }
          if (isExpired(expiresAt)) {
            return "gray";
          }

          return "yellow";
        };

        return <Tag label={getLabel()} color={getColor()} fullWidth />;
      },
    },
    {
      accessorKey: "expiresAt",
      header: t("invitations.table.columns.expiresAt"),
      cell: ({ getValue }) => {
        return formatDateTime(getValue() as string);
      },
    },
  ];

  const renderToolbar = useCallback(() => {
    if (showInviteAction) {
      return (
        <div className="table-actions">
          <AccountInvitationModal
            accountId={accountId}
            additionalInvitationFields={additionalInvitationFields}
            invitationButtonOptions={invitationButtonOptions}
            expiryDateField={invitationExpiryDateField}
            onSubmitted={onInvitationSubmitted}
            prepareData={prepareInvitationData}
            roles={roles}
          />
        </div>
      );
    }
  }, [
    showInviteAction,
    accountId,
    additionalInvitationFields,
    invitationButtonOptions,
    invitationExpiryDateField,
    onInvitationSubmitted,
    prepareInvitationData,
    roles,
  ]);

  return (
    <DataTable
      id="account-invitations-table"
      className={className}
      columns={[...defaultColumns, ...columns]}
      data={data || []}
      emptyTableMessage={t("invitations.table.emptyMessage")}
      renderToolbarItems={renderToolbar}
      totalRecords={data?.length || 0}
      visibleColumns={visibleColumns}
      paginationOptions={{
        pageInputLabel: t("invitations.table.pagination.pageControl"),
        itemsPerPageControlLabel: t("invitations.table.pagination.rowsPerPage"),
      }}
      dataActionsMenu={{
        actions: [
          {
            label: t("invitations.table.actions.resend"),
            icon: "pi pi-replay",
            disabled: (invitation) =>
              !!invitation.acceptedAt ||
              !!invitation.revokedAt ||
              isExpired(invitation.expiresAt),
            onClick: (invitation) => handleResendInvitation(invitation),
            requireConfirmationModal: true,
            confirmationOptions: {
              message: t("invitations.table.confirmation.messages.resend"),
              header: t("invitations.table.confirmation.header"),
            },
          },
          {
            label: t("invitations.table.actions.revoke"),
            icon: "pi pi-times",
            className: "danger",
            disabled: (invitation) =>
              !!invitation.acceptedAt ||
              !!invitation.revokedAt ||
              isExpired(invitation.expiresAt),
            onClick: (invitation) => handleRevokeInvitation(invitation),
            requireConfirmationModal: true,
            confirmationOptions: {
              message: t("invitations.table.confirmation.messages.revoke"),
              header: t("invitations.table.confirmation.header"),
            },
          },
          {
            label: t("invitations.table.actions.delete"),
            icon: "pi pi-trash",
            className: "danger",
            onClick: (invitation) => handleDeleteInvitation(invitation),
            requireConfirmationModal: true,
            confirmationOptions: {
              message: t("invitations.table.confirmation.messages.delete"),
              header: t("invitations.table.confirmation.header"),
            },
          },
        ],
      }}
      isLoading={loading}
      persistState={true}
      {...tableOptions}
    ></DataTable>
  );
};
