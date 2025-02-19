import { FormActions, useFormContext, useWatch } from "@dzangolab/react-form";
import { useTranslation } from "@dzangolab/react-i18n";

import { useConfig } from "@/hooks";

type Properties = {
  alignment?: "fill" | "left" | "right";
  cancelButtonOptions?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  loading?: boolean;
  showCancel?: boolean;
  submitButtonOptions?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  customerSignup?: boolean;
};

export const SignupFormActions = ({
  alignment = "fill",
  cancelButtonOptions,
  loading,
  showCancel = false,
  submitButtonOptions,
}: Properties) => {
  const { t } = useTranslation("accounts");

  const { accounts } = useConfig();
  const { termsAndConditionsUrl } = accounts?.signup || {};

  const {
    control,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    formState: { errors, submitCount },
  } = useFormContext();

  let isChecked = false;
  if (termsAndConditionsUrl) {
    isChecked = useWatch({ control, name: "termsAndConditions" });
  }

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
    actions.unshift({
      id: "cancel",
      label: t("signup.actions.previous"),
      severity: "secondary",
      variant: "outlined",
      ...(cancelButtonOptions || {}),
      type: "button",
    });
  }

  return (
    <FormActions actions={actions} alignment={alignment} loading={loading} />
  );
};
