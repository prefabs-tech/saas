import { FormActions, useFormContext } from "@dzangolab/react-form";
import { useTranslation } from "@dzangolab/react-i18n";
import { useEffect, useState } from "react";

import { CustomerFields } from "./CustomerFields";
import { UserFields } from "./UserFields";

export type CustomerSignupFormFieldsProperties = {
  loading?: boolean;
  showTermsAndConditions?: boolean;
  termsAndConditionsLabel?: string;
  onFormStepChange?: (activeStep: number) => void;
};

export const CustomerSignupFormFields = ({
  loading,
  showTermsAndConditions,
  termsAndConditionsLabel,
  onFormStepChange,
}: CustomerSignupFormFieldsProperties) => {
  const { t } = useTranslation("accounts");

  const [activeIndex, setActiveIndex] = useState(0);

  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    formState: { errors, submitCount },
  } = useFormContext();

  useEffect(() => {
    if (onFormStepChange) {
      onFormStepChange(activeIndex);
    }
  }, [activeIndex]);

  const handlePrevious = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const handleNext = () => {
    if (activeIndex < 3) {
      setActiveIndex(activeIndex + 1);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formActions: any = [
    {
      label:
        activeIndex === 3
          ? t("customer.form.actions.submit")
          : t("customer.form.actions.next"),
      type: activeIndex === 3 ? "submit" : "button",
      onClick: handleNext,
    },
  ];

  if (activeIndex > 0) {
    formActions.unshift({
      id: "cancel",
      label: t("customer.form.actions.previous"),
      severity: "secondary",
      type: "button",
      variant: "outlined",
      onClick: handlePrevious,
    });
  }

  const renderFormStep = (step: number) => {
    switch (step) {
      case 0:
        return <CustomerFields step={0} />;
      case 1:
        return <CustomerFields step={1} />;
      case 2:
        return <CustomerFields step={2} />;
      case 3:
        return (
          <UserFields
            showTermsAndConditions={showTermsAndConditions}
            termsAndConditionsLabel={termsAndConditionsLabel}
          />
        );
    }
  };

  return (
    <>
      {renderFormStep(activeIndex)}
      <FormActions actions={formActions} alignment="fill" loading={loading} />
    </>
  );
};
