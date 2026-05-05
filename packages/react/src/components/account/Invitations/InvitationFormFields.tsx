import {
  DatePicker,
  DaysInput,
  Email,
  FormActions,
  RenderAdditionalFormFields,
  Select,
  useFormContext,
} from "@prefabs.tech/react-form";
import { useTranslation } from "@prefabs.tech/react-i18n";
import React from "react";

import { useConfig } from "@/hooks";
import { InvitationExpiryDateField } from "@/types";

interface IProperties {
  expiryDateField?: InvitationExpiryDateField;
  loading?: boolean;
  onCancel?: () => void;
  renderAdditionalFields?: RenderAdditionalFormFields;
  roles?: string[];
}
export const AccountInvitationFormFields: React.FC<IProperties> = ({
  expiryDateField,
  loading,
  onCancel,
  renderAdditionalFields,
  roles,
}) => {
  const { t } = useTranslation("account");

  const { ui } = useConfig();

  const {
    formState: { errors, submitCount },
    getFieldState,
    register,
  } = useFormContext();

  const renderExpiryDateField = () => (
    <>
      {expiryDateField?.mode === "calendar" ? (
        <DatePicker
          className="expires-at"
          key="calender"
          label={t("invitations.form.fields.expiresAt.label")}
          minDate={new Date()}
          name="expiresAt"
          panelClassName="expires-at-panel"
          placeholder={t("invitations.form.fields.expiresAt.placeholder")}
        />
      ) : (
        <DaysInput
          getFieldState={getFieldState}
          label={t("invitations.form.fields.expiresAfter.label")}
          name="expiresAt"
          placeholder={t("invitations.form.fields.expiresAfter.placeholder")}
          register={register}
        />
      )}
    </>
  );

  return (
    <>
      <Email
        label={t("invitations.form.fields.email.label")}
        name="email"
        placeholder={t("invitations.form.fields.email.placeholder")}
        submitCount={submitCount}
      />

      {roles?.length ? (
        <Select
          autoSelectSingleOption
          disabled={roles.length <= 1 && true}
          label={t("invitations.form.fields.role.label")}
          name="role"
          options={roles.map((role) => {
            return {
              label: t(`users.roles.${role}`),
              value: role,
            };
          })}
          placeholder={t("invitations.form.fields.role.placeholder")}
        />
      ) : null}

      {renderAdditionalFields ? renderAdditionalFields(useFormContext) : null}

      {expiryDateField?.display ? renderExpiryDateField() : null}

      <FormActions
        actions={[
          {
            disabled: !!Object.values(errors).length,
            id: "submit",
            label: t("invitations.form.actions.submit"),
          },
          {
            id: "cancel",
            label: t("invitations.form.actions.cancel"),
            onClick: (event) => {
              event.preventDefault();
              onCancel && onCancel();
            },
          },
        ]}
        alignment={ui?.invitation?.form?.actionsAlignment}
        loading={loading}
        reverse={ui?.invitation?.form?.actionsReverse}
      />
    </>
  );
};
