import { AdditionalFormFields } from "@dzangolab/react-form";
import { useTranslation } from "@dzangolab/react-i18n";
import {
  TDataTable as DataTable,
  TDataTableProperties,
  TRequestJSON,
  IButtonProperties,
  TableColumnDefinition,
  Tag,
  formatDateTime,
} from "@dzangolab/react-ui";
import { useCallback } from "react";
import { toast } from "react-toastify";

import {
  deleteInvitation,
  resendInvitation,
  revokeInvitation,
} from "@/api/customers";
import { useConfig } from "@/hooks";
import { DeleteInvitationResponse } from "@/types/invitation";

import { InvitationModal } from "./InvitationModal";

import type {
  AddInvitationResponse,
  InvitationRoleOption,
  InvitationExpiryDateField,
  ResendInvitationResponse,
  RevokeInvitationResponse,
  Invitation,
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
    TDataTableProperties<Invitation>,
    "data" | "visibleColumns" | "fetchData"
  >
> & {
  customerId: string;
  additionalInvitationFields?: AdditionalFormFields;
  invitationButtonOptions?: IButtonProperties;
  invitationExpiryDateField?: InvitationExpiryDateField;
  invitations: Array<Invitation>;
  roles?: Array<InvitationRoleOption>;
  showAppColumn?: boolean;
  showInviteAction?: boolean;
  visibleColumns?: VisibleColumn[];
  fetchInvitations?: (arguments_: TRequestJSON) => void;
  onInvitationAdded?: (response: AddInvitationResponse) => void;
  onInvitationDeleted?: (response: DeleteInvitationResponse) => void;
  onInvitationResent?: (data: ResendInvitationResponse) => void;
  onInvitationRevoked?: (data: RevokeInvitationResponse) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prepareInvitationData?: (data: any) => any;
};

export const InvitationsTable = ({
  additionalInvitationFields,
  className = "table-invitations",
  columns = [],
  customerId,
  invitationButtonOptions,
  invitationExpiryDateField,
  invitations,
  roles,
  showInviteAction = true,
  totalRecords = 0,
  visibleColumns = ["email", "role", "expiresAt", "status", "actions"],
  fetchInvitations,
  onInvitationDeleted,
  onInvitationAdded,
  onInvitationResent,
  onInvitationRevoked,
  prepareInvitationData,
  ...tableOptions
}: InvitationsTableProperties) => {
  const config = useConfig();

  const { t } = useTranslation("invitations");

  const handleResendInvitation = (invitation: Invitation) => {
    resendInvitation(invitation.id, config.apiBaseUrl)
      .then((response) => {
        if ("data" in response && response.data.status === "ERROR") {
          // TODO better handle errors
          toast.error(t("messages.resend.error"));
        } else {
          toast.success(t("messages.resend.success"));

          if (onInvitationResent) {
            onInvitationResent(response);
          }
        }
      })
      .catch(() => {
        toast.error(t("messages.resend.error"));
      });
  };

  const handleRevokeInvitation = (invitation: Invitation) => {
    revokeInvitation(invitation.id, config.apiBaseUrl)
      .then((response) => {
        if ("data" in response && response.data.status === "ERROR") {
          // TODO better handle errors
          toast.error(t("messages.revoke.error"));
        } else {
          toast.success(t("messages.revoke.success"));

          if (onInvitationRevoked) {
            onInvitationRevoked(response);
          }
        }
      })
      .catch(() => {
        toast.error(t("messages.revoke.error"));
      });
  };

  const handleDeleteInvitation = async (id: number) => {
    deleteInvitation(id, config.apiBaseUrl)
      .then((response) => {
        if ("data" in response && response.data.status === "ERROR") {
          toast.error(t("messages.delete.error"));
        } else {
          toast.success(t("messages.delete.success"));

          if (onInvitationDeleted) {
            onInvitationDeleted(response);
          }
        }
      })
      .catch(() => {
        toast.error(t("messages.delete.error"));
      });
  };

  const isExpired = (date?: string | Date | number) => {
    return !!(date && new Date(date) < new Date());
  };

  const defaultColumns: Array<TableColumnDefinition<Invitation>> = [
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
          <InvitationModal
            additionalInvitationFields={additionalInvitationFields}
            invitationButtonOptions={invitationButtonOptions}
            expiryDateField={invitationExpiryDateField}
            onSubmitted={onInvitationAdded}
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
      data={invitations}
      emptyTableMessage={t("table.emptyMessage")}
      fetchData={fetchInvitations}
      renderToolbarItems={renderToolbar}
      totalRecords={totalRecords}
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
            onClick: (invitation) => handleDeleteInvitation(invitation.id),
            requireConfirmationModal: true,
            confirmationOptions: {
              message: t("confirmation.confirm.delete.message"),
              header: t("confirmation.header"),
            },
          },
        ],
      }}
      {...tableOptions}
    ></DataTable>
  );
};
