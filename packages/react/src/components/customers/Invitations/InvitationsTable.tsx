import { AdditionalFormFields } from "@dzangolab/react-form";
import { useTranslation } from "@dzangolab/react-i18n";
import {
  TDataTable as DataTable,
  TDataTableProperties,
  IButtonProperties,
  TableColumnDefinition,
  Tag,
  formatDateTime,
} from "@dzangolab/react-ui";
import { useCallback } from "react";
import { toast } from "react-toastify";

import { SAAS_ACCOUNT_OWNER } from "@/constants";
import { useGetInvitationsQuery } from "@/hooks";
import {
  useDeleteInvitationMutation,
  useResendInvitationMutation,
  useRevokeInvitationMutation,
} from "@/hooks/customers";
import { DeleteInvitationResponse } from "@/types/customer-invitation";

import { CustomerInvitationModal } from "./InvitationModal";

import type {
  AddInvitationResponse,
  ResendInvitationResponse,
  RevokeInvitationResponse,
  CustomerInvitation,
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
    TDataTableProperties<CustomerInvitation>,
    "data" | "visibleColumns" | "fetchData"
  >
> & {
  customerId: string;
  additionalInvitationFields?: AdditionalFormFields;
  invitationButtonOptions?: IButtonProperties;
  invitationExpiryDateField?: InvitationExpiryDateField;
  roles?: string[];
  showInviteAction?: boolean;
  visibleColumns?: VisibleColumn[];
  onInvitationAdded?: (response: AddInvitationResponse) => void;
  onInvitationDeleted?: (response: DeleteInvitationResponse) => void;
  onInvitationResent?: (response: ResendInvitationResponse) => void;
  onInvitationRevoked?: (response: RevokeInvitationResponse) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prepareInvitationData?: (data: any) => any;
};

export const CustomerInvitationsTable = ({
  additionalInvitationFields,
  className = "table-invitations",
  columns = [],
  customerId,
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
  const { t } = useTranslation("customer");

  const {
    data,
    loading,
    trigger: refetch,
  } = useGetInvitationsQuery(customerId);

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

  const handleResendInvitation = (invitation: CustomerInvitation) => {
    triggerResend(customerId, invitation.id);
  };

  const handleRevokeInvitation = (invitation: CustomerInvitation) => {
    triggerRevoke(customerId, invitation.id);
  };

  const handleDeleteInvitation = (invitation: CustomerInvitation) => {
    triggereDelete(customerId, invitation.id);
  };

  const onInvitationSubmitted = (invitation: CustomerInvitation) => {
    onInvitationAdded && onInvitationAdded(invitation);
    refetch();
  };

  const isExpired = (date?: string | Date | number) => {
    return !!(date && new Date(date) < new Date());
  };

  const defaultColumns: Array<TableColumnDefinition<CustomerInvitation>> = [
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
          if (acceptedAt) return t("invitations.status.accepted");
          if (revokedAt) return t("invitations.status.revoked");
          if (isExpired(expiresAt)) return t("invitations.status.expired");

          return t("invitations.status.pending");
        };

        const getColor = () => {
          if (acceptedAt) return "green";
          if (revokedAt) return "red";
          if (isExpired(expiresAt)) return "gray";

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
          <CustomerInvitationModal
            customerId={customerId}
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
  }, [showInviteAction]);

  return (
    <DataTable
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
      {...tableOptions}
    ></DataTable>
  );
};
