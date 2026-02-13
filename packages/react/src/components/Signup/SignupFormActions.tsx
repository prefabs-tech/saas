import {
  FormActions,
  useFormContext,
  useWatch,
} from "@prefabs.tech/react-form";
import { useTranslation } from "@prefabs.tech/react-i18n";

import { useConfig } from "@/hooks";

type Properties = {
  cancelButtonOptions?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  loading?: boolean;
  showCancel?: boolean;
  submitButtonOptions?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
};

export const SignupFormActions = ({
  cancelButtonOptions,
  loading,
  showCancel = false,
  submitButtonOptions,
}: Properties) => {
  const { t } = useTranslation("accounts");

  const { accounts, ui } = useConfig();
  const { termsAndConditionsUrl } = accounts?.signup || {};

  const {
    control,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    formState: { errors, submitCount },
  } = useFormContext();

  const watched = useWatch({
    control,
    name: "termsAndConditions",
    defaultValue: false,
  });
  const isChecked = termsAndConditionsUrl ? watched : true;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const actions: any = [
    {
      label: t("signup.actions.submit"),
      disabled: !!termsAndConditionsUrl && !isChecked,
      ...(submitButtonOptions || {}),
      type: "submit",
    },
  ];

  if (showCancel) {
    actions.push({
      id: "cancel",
      label: t("signup.actions.previous"),
      severity: "secondary",
      variant: "outlined",
      ...(cancelButtonOptions || {}),
      type: "button",
    });
  }

  return (
    <FormActions
      actions={actions}
      alignment={ui?.signup?.form?.actionsAlignment}
      reverse={ui?.signup?.form?.actionsReverse}
      loading={loading}
    />
  );
};
