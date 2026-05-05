import {
  AdditionalFormFields,
  emailSchema,
  Provider,
} from "@prefabs.tech/react-form";
import { useTranslation } from "@prefabs.tech/react-i18n";
import React, { useCallback } from "react";
import { toast } from "react-toastify";
import * as zod from "zod";

import type {
  AddAccountInvitationResponse,
  InvitationExpiryDateField,
} from "@/types";

import { SAAS_ACCOUNT_ROLES_DEFAULT } from "@/constants";
import { useAddInvitationMutation, useConfig } from "@/hooks";

import { AccountInvitationFormFields } from "./InvitationFormFields";

interface Properties {
  accountId: string;
  additionalInvitationFields?: AdditionalFormFields;
  expiryDateField?: InvitationExpiryDateField;
  onCancel?: () => void;
  onSubmitted?: (response: AddAccountInvitationResponse) => void; // afterSubmit
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prepareData?: (rawFormData: any) => any;
  roles?: string[];
}

export const AccountInvitationForm = ({
  accountId,
  additionalInvitationFields,
  expiryDateField,
  onCancel,
  onSubmitted,
  prepareData,
  roles: customRoles,
}: Properties) => {
  const { i18n, t } = useTranslation("account");

  const { saasAccountRoles = SAAS_ACCOUNT_ROLES_DEFAULT } = useConfig();

  const roles = customRoles || saasAccountRoles;

  const { loading: addLoading, trigger: triggerAdd } = useAddInvitationMutation(
    {
      onError: () => {
        toast.error(t("invitations.messages.invite.error"));
      },
      onSuccess: (response) => {
        toast.success(t("invitations.messages.invite.success"));

        if (onSubmitted) {
          onSubmitted(response);
        }
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
  }, [roles, additionalInvitationFields, expiryDateField?.display]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getFormData = (data: any) => {
    const parsedData: {
      email: string;
      expiresAt?: Date;
      role: string;
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
      defaultValues={getDefaultValues()}
      onSubmit={onSubmit}
      validationSchema={InvitationFormSchema}
      validationTriggerKey={i18n.language}
    >
      <AccountInvitationFormFields
        expiryDateField={expiryDateField}
        loading={addLoading}
        onCancel={onCancel}
        renderAdditionalFields={additionalInvitationFields?.renderFields}
        roles={roles}
      />
    </Provider>
  );
};
