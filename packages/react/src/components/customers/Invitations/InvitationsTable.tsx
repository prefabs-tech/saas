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
  InvitationRoleOption,
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
  roles?: Array<InvitationRoleOption>;
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
  const { t } = useTranslation("invitations");

  const {
    data,
    loading,
    trigger: refetch,
  } = useGetInvitationsQuery(customerId);

  const { trigger: triggerResend } = useResendInvitationMutation({
    onSuccess: (response) => {
      toast.success(t("messages.resend.success"));

      if (onInvitationResent) {
        onInvitationResent(response);
      }

      refetch();
    },
    onError: () => {
      toast.error(t("messages.resend.error"));
    },
  });

  const { trigger: triggerRevoke } = useRevokeInvitationMutation({
    onSuccess: (response) => {
      toast.success(t("messages.revoke.success"));

      if (onInvitationRevoked) {
        onInvitationRevoked(response);
      }

      refetch();
    },
    onError: () => {
      toast.error(t("messages.revoke.error"));
    },
  });

  const { trigger: triggereDelete } = useDeleteInvitationMutation({
    onSuccess: (response) => {
      toast.success(t("messages.delete.success"));

      if (onInvitationDeleted) {
        onInvitationDeleted(response);
      }

      refetch();
    },
    onError: () => {
      toast.error(t("messages.delete.error"));
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
      header: t("table.defaultColumns.email"),
      enableSorting: true,
      enableColumnFilter: true,
      enableGlobalFilter: true,
    },
    {
      align: "center",
      accessorKey: "role",
      header: t("table.defaultColumns.role"),
      cell: ({ getValue, row: { original } }) => {
        const roles = (original as unknown as { roles: string[] })?.roles;

        if (Array.isArray(roles)) {
          return (
            <>
              {roles?.map((role: string, index: number) => (
                <Tag
                  key={role + index}
                  label={role}
                  color={role === "ADMIN" ? "default" : "green"}
                  fullWidth
                />
              ))}
            </>
          );
        }

        const role = (getValue() as string) || "";

        return (
          <Tag
            label={role}
            color={role === "ADMIN" ? "default" : "green"}
            fullWidth
          />
        );
      },
    },
    {
      align: "center",
      accessorKey: "status",
      header: t("table.defaultColumns.status"),
      cell: ({ row: { original } }) => {
        const { acceptedAt, revokedAt, expiresAt } = original;

        const getLabel = () => {
          if (acceptedAt) return t("table.status.accepted");
          if (revokedAt) return t("table.status.revoked");
          if (isExpired(expiresAt)) return t("table.status.expired");

          return t("table.status.pending");
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
      header: t("table.defaultColumns.expiresAt"),
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
      emptyTableMessage={t("table.emptyMessage")}
      renderToolbarItems={renderToolbar}
      totalRecords={data?.length || 0}
      visibleColumns={visibleColumns}
      paginationOptions={{
        pageInputLabel: t("table.pagination.pageControl"),
        itemsPerPageControlLabel: t("table.pagination.rowsPerPage"),
      }}
      dataActionsMenu={{
        actions: [
          {
            label: t("invitations.actions.resend"),
            icon: "pi pi-replay",
            disabled: (invitation) =>
              !!invitation.acceptedAt ||
              !!invitation.revokedAt ||
              isExpired(invitation.expiresAt),
            onClick: (invitation) => handleResendInvitation(invitation),
            requireConfirmationModal: true,
            confirmationOptions: {
              message: t("confirmation.confirm.resend.message"),
              header: t("confirmation.header"),
            },
          },
          {
            label: t("invitations.actions.revoke"),
            icon: "pi pi-times",
            className: "danger",
            disabled: (invitation) =>
              !!invitation.acceptedAt ||
              !!invitation.revokedAt ||
              isExpired(invitation.expiresAt),
            onClick: (invitation) => handleRevokeInvitation(invitation),
            requireConfirmationModal: true,
            confirmationOptions: {
              message: t("confirmation.confirm.revoke.message"),
              header: t("confirmation.header"),
            },
          },
          {
            label: t("invitations.actions.delete"),
            icon: "pi pi-trash",
            className: "danger",
            onClick: (invitation) => handleDeleteInvitation(invitation),
            requireConfirmationModal: true,
            confirmationOptions: {
              message: t("confirmation.confirm.delete.message"),
              header: t("confirmation.header"),
            },
          },
        ],
      }}
      isLoading={loading}
      {...tableOptions}
    ></DataTable>
  );
};
