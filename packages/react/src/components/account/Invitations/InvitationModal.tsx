import { AdditionalFormFields } from "@prefabs.tech/react-form";
import { useTranslation } from "@prefabs.tech/react-i18n";
import { Button, IButtonProperties, Modal } from "@prefabs.tech/react-ui";
import React, { useState } from "react";

import { AccountInvitationForm } from "./InvitationForm";

import type {
  AddAccountInvitationResponse,
  InvitationExpiryDateField,
} from "@/types";

interface Properties {
  accountId: string;
  additionalInvitationFields?: AdditionalFormFields;
  expiryDateField?: InvitationExpiryDateField;
  invitationButtonOptions?: IButtonProperties;
  roles?: string[];
  onSubmitted?: (response: AddAccountInvitationResponse) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prepareData?: (data: any) => any;
}

export const AccountInvitationModal = ({
  accountId,
  additionalInvitationFields,
  expiryDateField,
  invitationButtonOptions,
  onSubmitted,
  prepareData,
  roles,
}: Properties) => {
  const { t } = useTranslation("account");

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  return (
    <div className="flex justify-content-center">
      <Button
        label={t("invitations.table.actions.invite")}
        onClick={() => setModalVisible(true)}
        {...invitationButtonOptions}
      />
      <Modal
        className="invitation-modal"
        header={t("invitations.form.title")}
        visible={modalVisible}
        onHide={() => setModalVisible(false)}
      >
        <AccountInvitationForm
          accountId={accountId}
          additionalInvitationFields={additionalInvitationFields}
          expiryDateField={expiryDateField}
          onCancel={() => {
            setModalVisible(false);
          }}
          onSubmitted={(data) => {
            if (onSubmitted) {
              onSubmitted(data);
            }

            setModalVisible(false);
          }}
          prepareData={prepareData}
          roles={roles}
        />
      </Modal>
    </div>
  );
};
