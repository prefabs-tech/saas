import { ACCOUNT_INVITATION_ACCEPT_LINK_PATH } from "../constants";

import type { AccountInvitation } from "../types";
import type { ApiConfig } from "@dzangolab/fastify-config";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { FastifyMailer } from "@dzangolab/fastify-mailer";
import type { FastifyInstance } from "fastify";

const getInvitationLink = (
  config: ApiConfig,
  invitation: AccountInvitation,
  origin: string,
): string => {
  const { token, accountId } = invitation;

  let invitationAcceptPath =
    config.saas.invitation?.acceptLinkPath ||
    ACCOUNT_INVITATION_ACCEPT_LINK_PATH;

  invitationAcceptPath = invitationAcceptPath
    .replaceAll(":token", token)
    .replaceAll(":accountId", accountId);

  const url = new URL(invitationAcceptPath, origin);

  return url.href;
};

const sendEmail = async ({
  fastify,
  subject,
  templateData = {},
  templateName,
  to,
}: {
  fastify: FastifyInstance;
  subject: string;
  templateData?: Record<never, never>;
  templateName: string;
  to: string;
}) => {
  const { config, log, mailer } = fastify;

  return mailer
    .sendMail({
      subject: subject,
      templateName: templateName,
      to: to,
      templateData: {
        appName: config.appName,
        ...templateData,
      },
    })
    .catch((error: Error) => {
      log.error(error.stack);
    });
};

const sendInvitation = async (
  fastify: FastifyInstance,
  invitation: AccountInvitation,
  origin: string,
) => {
  const { config, log } = fastify;

  let subject: string = "You're invited";

  const emailSubject = config.saas.invitation?.emailOverrides?.subject;

  if (emailSubject) {
    subject =
      typeof emailSubject === "function"
        ? await emailSubject(fastify, invitation)
        : emailSubject;
  }

  if (origin) {
    sendEmail({
      fastify,
      subject,
      templateData: {
        invitationLink: getInvitationLink(config, invitation, origin),
        invitation,
      },
      templateName:
        config.saas.invitation?.emailOverrides?.templateName ||
        config.user.emailOverrides?.invitation?.templateName ||
        "user-invitation",
      to: invitation.email,
    });
  } else {
    log.error(`Could not send email for invitation ID ${invitation.id}`);
  }
};

export default sendInvitation;
