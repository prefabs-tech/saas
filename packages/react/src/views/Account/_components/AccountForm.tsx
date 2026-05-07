import { useTranslation } from "@prefabs.tech/react-i18n";
import { useLocation, useNavigate } from "react-router-dom";
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

  const { loading: addLoading, trigger: triggerAdd } = useAddAccountMutation({
    onError: (error) => {
      toast.error(t("form.messages.error.create"));
    },
    onSuccess: (response) => {
      toast.success(t("form.messages.success.create"));
      navigate(DEFAULT_PATHS.ACCOUNTS_VIEW.replace(":id", `${response?.id}`));
    },
  });

  const { loading: editLoading, trigger: triggerEdit } = useEditAccountMutation(
    {
      onError: (error) => {
        toast.error(t("form.messages.error.edit"));
      },
      onSuccess: (response) => {
        location.state
          ? navigate(location.state.previousUrl)
          : navigate(
              DEFAULT_PATHS.ACCOUNTS_VIEW.replace(":id", `${response?.id}`),
            );

        toast.success(t("form.messages.success.edit"));
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
      account={account}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      loading={addLoading || editLoading}
    />
  );
};
