import {
  Provider,
  emailSchema,
  AdditionalFormFields,
} from "@prefabs.tech/react-form";
import { useTranslation } from "@prefabs.tech/react-i18n";
import React, { useCallback } from "react";
import { toast } from "react-toastify";
import * as zod from "zod";

import { SAAS_ACCOUNT_ROLES_DEFAULT } from "@/constants";
import { useAddInvitationMutation, useConfig } from "@/hooks";

import { AccountInvitationFormFields } from "./InvitationFormFields";

import type {
  AddAccountInvitationResponse,
  InvitationExpiryDateField,
} from "@/types";

interface Properties {
  accountId: string;
  additionalInvitationFields?: AdditionalFormFields;
  expiryDateField?: InvitationExpiryDateField;
  roles?: string[];
  onCancel?: () => void;
  onSubmitted?: (response: AddAccountInvitationResponse) => void; // afterSubmit
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prepareData?: (rawFormData: any) => any;
}

export const AccountInvitationForm = ({
  accountId,
  additionalInvitationFields,
  expiryDateField,
  roles: customRoles,
  onCancel,
  onSubmitted,
  prepareData,
}: Properties) => {
  const { t, i18n } = useTranslation("account");

  const { saasAccountRoles = SAAS_ACCOUNT_ROLES_DEFAULT } = useConfig();

  const roles = customRoles || saasAccountRoles;

  const { loading: addLoading, trigger: triggerAdd } = useAddInvitationMutation(
    {
      onSuccess: (response) => {
        toast.success(t("invitations.messages.invite.success"));

        if (onSubmitted) {
          onSubmitted(response);
        }
      },
      onError: () => {
        toast.error(t("invitations.messages.invite.error"));
      },
    },
  );

  const getDefaultValues = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let defaultValues: any = { email: "", role: undefined };

    const filteredRoles = roles;

    if (expiryDateField?.display) {
      defaultValues.expiresAt = null;
    }

    if (filteredRoles?.length === 1) {
      defaultValues.role = filteredRoles[0];
    }

    if (additionalInvitationFields?.defaultValues) {
      defaultValues = {
        ...defaultValues,
        ...additionalInvitationFields.defaultValues,
      };
    }

    return defaultValues;
  }, [
    roles,
    additionalInvitationFields?.defaultValues,
    expiryDateField?.display,
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getFormData = (data: any) => {
    const parsedData: {
      email: string;
      role: string;
      expiresAt?: Date;
    } = {
      email: data.email,
      role: data.role,
    };

    if (data.expiresAt) {
      parsedData.expiresAt = data.expiresAt;
    }

    return parsedData;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    const invitationData = prepareData ? prepareData(data) : getFormData(data);

    triggerAdd(accountId, invitationData);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let InvitationFormSchema: Zod.ZodObject<any> = zod.object({
    email: emailSchema({
      invalid: t("invitations.form.validation.messages.validEmail"),
      required: t("invitations.form.validation.messages.email"),
    }),
  });

  if (roles?.length) {
    const RoleFormSchema = zod.object({
      role: zod.string({
        required_error: t("invitations.form.validation.messages.role"),
      }),
    });

    InvitationFormSchema = InvitationFormSchema.merge(RoleFormSchema);
  }

  if (expiryDateField?.display) {
    const ExpiresAtFormSchema = zod.object({
      expiresAt: zod.date({
        required_error: t("invitations.form.validation.messages.expiresAt"),
      }),
    });

    InvitationFormSchema = InvitationFormSchema.merge(ExpiresAtFormSchema);
  }

  if (additionalInvitationFields?.schema) {
    InvitationFormSchema = InvitationFormSchema.merge(
      additionalInvitationFields.schema,
    );
  }

  return (
    <Provider
      onSubmit={onSubmit}
      defaultValues={getDefaultValues()}
      validationSchema={InvitationFormSchema}
      validationTriggerKey={i18n.language}
    >
      <AccountInvitationFormFields
        renderAdditionalFields={additionalInvitationFields?.renderFields}
        expiryDateField={expiryDateField}
        loading={addLoading}
        onCancel={onCancel}
        roles={roles}
      />
    </Provider>
  );
};
