import {
  Select,
  DaysInput,
  DatePicker,
  Email,
  useFormContext,
  RenderAdditionalFormFields,
  FormActions,
} from "@dzangolab/react-form";
import { useTranslation } from "@dzangolab/react-i18n";
import React from "react";

import { InvitationExpiryDateField } from "@/types";

interface IProperties {
  expiryDateField?: InvitationExpiryDateField;
  roles?: string[];
  loading?: boolean;
  onCancel?: () => void;
  renderAdditionalFields?: RenderAdditionalFormFields;
}
export const AccountInvitationFormFields: React.FC<IProperties> = ({
  expiryDateField,
  loading,
  roles,
  onCancel,
  renderAdditionalFields,
}) => {
  const { t } = useTranslation("account");

  const {
    register,
    getFieldState,
    formState: { errors, submitCount },
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
          name="role"
          label={t("invitations.form.fields.role.label")}
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
            id: "cancel",
            onClick: (event) => {
              event.preventDefault();
              onCancel && onCancel();
            },
            label: t("invitations.form.actions.cancel"),
          },
          {
            id: "submit",
            label: t("invitations.form.actions.submit"),
            disabled: !!Object.values(errors).length,
          },
        ]}
        loading={loading}
        alignment="fill"
      />
    </>
  );
};
