import { useTranslation } from "@prefabs.tech/react-i18n";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import { AccountForm as AccountFormBase } from "@/components/account";
import { DEFAULT_PATHS } from "@/constants";
import {
  useAddAccountMutation,
  useEditAccountMutation,
} from "@/hooks/accounts";
import { Account, AccountCreateInput, AccountUpdateInput } from "@/types";

type Properties = {
  account?: Account;
};

export const AccountForm = ({ account }: Properties) => {
  const { t } = useTranslation("account");

  const navigate = useNavigate();
  const location = useLocation();

  const { trigger: triggerAdd, loading: addLoading } = useAddAccountMutation({
    onSuccess: (response) => {
      toast.success(t("form.messages.success.create"));
      navigate(DEFAULT_PATHS.ACCOUNTS_VIEW.replace(":id", `${response?.id}`));
    },
    onError: (error) => {
      toast.error(t("form.messages.error.create"));
    },
  });

  const { trigger: triggerEdit, loading: editLoading } = useEditAccountMutation(
    {
      onSuccess: (response) => {
        location.state
          ? navigate(location.state.previousUrl)
          : navigate(
              DEFAULT_PATHS.ACCOUNTS_VIEW.replace(":id", `${response?.id}`),
            );

        toast.success(t("form.messages.success.edit"));
      },
      onError: (error) => {
        toast.error(t("form.messages.error.edit"));
      },
    },
  );

  const createAccount = (data: AccountCreateInput) => {
    triggerAdd(data);
  };

  const updateAccount = (data: AccountCreateInput) => {
    const { useSeparateDatabase, ...updatedData } = data;

    triggerEdit(account!.id, updatedData);
  };

  const handleCancel = () => {
    if (account) {
      if (location.state) {
        navigate(location.state.previousUrl);
      } else {
        navigate(DEFAULT_PATHS.ACCOUNTS_VIEW.replace(":id", `${account.id}`));
      }
    } else {
      navigate(DEFAULT_PATHS.ACCOUNTS);
    }
  };

  const handleSubmit = (data: AccountCreateInput | AccountUpdateInput) => {
    if (account) {
      updateAccount(data as AccountCreateInput);
    } else {
      createAccount(data as AccountCreateInput);
    }
  };

  return (
    <AccountFormBase
      loading={addLoading || editLoading}
      account={account}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
    />
  );
};
