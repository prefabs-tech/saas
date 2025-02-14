import { InvitationsTable } from "@/components/customers/Invitations";
import { useQuery } from "@/hooks/useQuery";
import { GetInvitationsResponse, TSingleFilter } from "@/types";
import { useTranslation } from "@dzangolab/react-i18n";
import { Page, TRequestJSON } from "@dzangolab/react-ui";
import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";

type Properties = {
  page?: boolean;
};

export const CustomerInvitations = ({ page = true }: Properties) => {
  const { t } = useTranslation("user");
  const [requestJSON, setRequestJSON] = useState<TRequestJSON>();

  const parameters = useParams();

  const { data, loading, trigger } = useQuery<GetInvitationsResponse>(
    `customers/${parameters.id}/invitations`,
    requestJSON,
    {
      lazy: false,
    },
  );

  const handleFetch = useCallback((requestJSON: TRequestJSON) => {
    let filters = [
      { key: "acceptedAt", operator: "eq", value: "null" },
      {
        key: "expiresAt",
        operator: "gt",
        value: new Date().toISOString(),
      },
      { key: "revokedAt", operator: "eq", value: "null" },
    ];

    if (requestJSON.filter) {
      if ("AND" in requestJSON.filter) {
        filters = filters.concat(
          requestJSON.filter.AND as Array<TSingleFilter>,
        );
      } else {
        filters.push(requestJSON.filter as TSingleFilter);
      }
    }

    requestJSON.filter = { AND: filters };

    setRequestJSON(requestJSON);
  }, []);

  const handleRefetch = () => {
    trigger();
  };

  if (!parameters.id) {
    return null;
  }

  if (!page) {
    <InvitationsTable
      customerId={parameters.id}
      id="invitations-table"
      initialSorting={[{ id: "email", desc: false }]}
      invitationButtonOptions={{
        iconLeft: "pi pi-user",
      }}
      invitations={data || []}
      isLoading={loading}
      persistState
      totalRecords={data?.length || 0}
      fetchInvitations={handleFetch}
      onInvitationAdded={handleRefetch}
      onInvitationDeleted={handleRefetch}
      onInvitationResent={handleRefetch}
      onInvitationRevoked={handleRefetch}
    />;
  }

  return (
    <Page title={t("invitations.table.title")}>
      <InvitationsTable
        customerId={parameters.id}
        id="invitations-table"
        initialSorting={[{ id: "email", desc: false }]}
        invitationButtonOptions={{
          iconLeft: "pi pi-user",
        }}
        invitations={data || []}
        isLoading={loading}
        persistState
        totalRecords={data?.length || 0}
        fetchInvitations={handleFetch}
        onInvitationAdded={handleRefetch}
        onInvitationDeleted={handleRefetch}
        onInvitationResent={handleRefetch}
        onInvitationRevoked={handleRefetch}
      />
    </Page>
  );
};
