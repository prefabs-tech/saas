import { AdditionalFormFields } from "@prefabs.tech/react-form";
import { useTranslation } from "@prefabs.tech/react-i18n";
import {
  TDataTable as DataTable,
  formatDateTime,
  IButtonProperties,
  TableColumnDefinition,
  Tag,
  TDataTableProperties,
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
import { DeleteAccountInvitationResponse } from "@/types/AccountInvitation";

import type {
  AccountInvitation,
  AddAccountInvitationResponse,
  InvitationExpiryDateField,
  ResendAccountInvitationResponse,
  RevokeAccountInvitationResponse,
} from "../../../types";

import { AccountInvitationModal } from "./InvitationModal";

export type InvitationsTableProperties = Partial<
  Omit<
    TDataTableProperties<AccountInvitation>,
    "data" | "fetchData" | "visibleColumns"
  >
> & {
  accountId: string;
  additionalInvitationFields?: AdditionalFormFields;
  invitationButtonOptions?: IButtonProperties;
  invitationExpiryDateField?: InvitationExpiryDateField;
  onInvitationAdded?: (response: AddAccountInvitationResponse) => void;
  onInvitationDeleted?: (response: DeleteAccountInvitationResponse) => void;
  onInvitationResent?: (response: ResendAccountInvitationResponse) => void;
  onInvitationRevoked?: (response: RevokeAccountInvitationResponse) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prepareInvitationData?: (data: any) => any;
  roles?: string[];
  showInviteAction?: boolean;
  visibleColumns?: VisibleColumn[];
};

type VisibleColumn =
  | "actions"
  | "email"
  | "expiresAt"
  | "role"
  | "status"
  | string;

export const AccountInvitationsTable = ({
  accountId,
  additionalInvitationFields,
  className = "table-invitations",
  columns = [],
  invitationButtonOptions,
  invitationExpiryDateField,
  onInvitationAdded,
  onInvitationDeleted,
  onInvitationResent,
  onInvitationRevoked,
  prepareInvitationData,
  roles,
  showInviteAction = true,
  visibleColumns = ["email", "role", "expiresAt", "status", "actions"],
  ...tableOptions
}: InvitationsTableProperties) => {
  const { t } = useTranslation("account");

  const { data, loading, trigger: refetch } = useGetInvitationsQuery(accountId);

  const { trigger: triggerResend } = useResendInvitationMutation({
    onError: () => {
      toast.error(t("invitations.messages.resend.error"));
    },
    onSuccess: (response) => {
      toast.success(t("invitations.messages.resend.success"));

      if (onInvitationResent) {
        onInvitationResent(response);
      }

      refetch();
    },
  });

  const { trigger: triggerRevoke } = useRevokeInvitationMutation({
    onError: () => {
      toast.error(t("invitations.messages.revoke.error"));
    },
    onSuccess: (response) => {
      toast.success(t("invitations.messages.revoke.success"));

      if (onInvitationRevoked) {
        onInvitationRevoked(response);
      }

      refetch();
    },
  });

  const { trigger: triggereDelete } = useDeleteInvitationMutation({
    onError: () => {
      toast.error(t("invitations.messages.delete.error"));
    },
    onSuccess: (response) => {
      toast.success(t("invitations.messages.delete.success"));

      if (onInvitationDeleted) {
        onInvitationDeleted(response);
      }

      refetch();
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

  const isExpired = (date?: Date | number | string) => {
    return !!(date && new Date(date) < new Date());
  };

  const defaultColumns: Array<TableColumnDefinition<AccountInvitation>> = [
    {
      accessorKey: "email",
      enableColumnFilter: true,
      enableGlobalFilter: true,
      enableSorting: true,
      header: t("invitations.table.columns.email"),
    },
    {
      accessorKey: "role",
      align: "center",
      cell: ({ getValue }) => {
        const role = (getValue() as string) || "";

        return (
          <Tag
            color={role === SAAS_ACCOUNT_OWNER ? "default" : "green"}
            fullWidth
            label={t(`users.roles.${role}`)}
          />
        );
      },
      header: t("invitations.table.columns.role"),
    },
    {
      accessorKey: "status",
      align: "center",
      cell: ({ row: { original } }) => {
        const { acceptedAt, expiresAt, revokedAt } = original;

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

        return <Tag color={getColor()} fullWidth label={getLabel()} />;
      },
      header: t("invitations.table.columns.status"),
    },
    {
      accessorKey: "expiresAt",
      cell: ({ getValue }) => {
        return formatDateTime(getValue() as string);
      },
      header: t("invitations.table.columns.expiresAt"),
    },
  ];

  const renderToolbar = useCallback(() => {
    if (showInviteAction) {
      return (
        <div className="table-actions">
          <AccountInvitationModal
            accountId={accountId}
            additionalInvitationFields={additionalInvitationFields}
            expiryDateField={invitationExpiryDateField}
            invitationButtonOptions={invitationButtonOptions}
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
      className={className}
      columns={[...defaultColumns, ...columns]}
      data={data || []}
      dataActionsMenu={{
        actions: [
          {
            confirmationOptions: {
              header: t("invitations.table.confirmation.header"),
              message: t("invitations.table.confirmation.messages.resend"),
            },
            disabled: (invitation) =>
              !!invitation.acceptedAt ||
              !!invitation.revokedAt ||
              isExpired(invitation.expiresAt),
            icon: "pi pi-replay",
            label: t("invitations.table.actions.resend"),
            onClick: (invitation) => handleResendInvitation(invitation),
            requireConfirmationModal: true,
          },
          {
            className: "danger",
            confirmationOptions: {
              header: t("invitations.table.confirmation.header"),
              message: t("invitations.table.confirmation.messages.revoke"),
            },
            disabled: (invitation) =>
              !!invitation.acceptedAt ||
              !!invitation.revokedAt ||
              isExpired(invitation.expiresAt),
            icon: "pi pi-times",
            label: t("invitations.table.actions.revoke"),
            onClick: (invitation) => handleRevokeInvitation(invitation),
            requireConfirmationModal: true,
          },
          {
            className: "danger",
            confirmationOptions: {
              header: t("invitations.table.confirmation.header"),
              message: t("invitations.table.confirmation.messages.delete"),
            },
            icon: "pi pi-trash",
            label: t("invitations.table.actions.delete"),
            onClick: (invitation) => handleDeleteInvitation(invitation),
            requireConfirmationModal: true,
          },
        ],
      }}
      emptyTableMessage={t("invitations.table.emptyMessage")}
      id="account-invitations-table"
      isLoading={loading}
      paginationOptions={{
        itemsPerPageControlLabel: t("invitations.table.pagination.rowsPerPage"),
        pageInputLabel: t("invitations.table.pagination.pageControl"),
      }}
      persistState={true}
      renderToolbarItems={renderToolbar}
      totalRecords={data?.length || 0}
      visibleColumns={visibleColumns}
      {...tableOptions}
    ></DataTable>
  );
};
