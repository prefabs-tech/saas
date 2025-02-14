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

import { InvitationExpiryDateField, InvitationRoleOption } from "@/types";

interface IProperties {
  expiryDateField?: InvitationExpiryDateField;
  roles?: InvitationRoleOption[];
  loading?: boolean;
  onCancel?: () => void;
  renderAdditionalFields?: RenderAdditionalFormFields;
}
export const InvitationFormFields: React.FC<IProperties> = ({
  expiryDateField,
  loading,
  roles,
  onCancel,
  renderAdditionalFields,
}) => {
  const { t } = useTranslation("invitations");

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
          label={t("form.fields.expiresAt.label")}
          minDate={new Date()}
          name="expiresAt"
          panelClassName="expires-at-panel"
          placeholder={t("form.fields.expiresAt.placeholder")}
        />
      ) : (
        <DaysInput
          getFieldState={getFieldState}
          label={t("form.fields.expiresAfter.label")}
          name="expiresAt"
          placeholder={t("form.fields.expiresAfter.placeholder")}
          register={register}
        />
      )}
    </>
  );

  return (
    <>
      <Email
        label={t("form.fields.email.label")}
        name="email"
        placeholder={t("form.fields.email.placeholder")}
        submitCount={submitCount}
      />

      {roles?.length ? (
        <Select
          autoSelectSingleOption
          disabled={roles.length <= 1 && true}
          name="role"
          label={t("form.fields.role.label")}
          placeholder={t("form.fields.role.placeholder")}
          options={roles.map((role) => {
            return {
              label: role.name,
              value: role.name,
            };
          })}
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
            label: t("form.actions.cancel"),
          },
          {
            id: "submit",
            label: t("form.actions.submit"),
            disabled: !!Object.values(errors).length,
          },
        ]}
        loading={loading}
        alignment="fill"
      />
    </>
  );
};
