import { CUSTOMER_INVITATION_ACCEPT_LINK_PATH } from "../constants";

import type { CustomerInvitation } from "../types";
import type { ApiConfig } from "@dzangolab/fastify-config";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { FastifyMailer } from "@dzangolab/fastify-mailer";
import type { FastifyInstance } from "fastify";

const getInvitationLink = (
  config: ApiConfig,
  invitation: CustomerInvitation,
  origin: string,
): string => {
  const { token } = invitation;

  let invitationAcceptPath =
    config.saas.invitation?.acceptLinkPath ||
    CUSTOMER_INVITATION_ACCEPT_LINK_PATH;

  invitationAcceptPath = invitationAcceptPath.replaceAll(
    /:token(?!\w)/g,
    token,
  );

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
  templateData?: Record<string, string>;
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
  invitation: CustomerInvitation,
  origin: string,
) => {
  const { config, log } = fastify;

  if (origin) {
    sendEmail({
      fastify,
      subject: "Invitation for Sign Up",
      templateData: {
        invitationLink: getInvitationLink(config, invitation, origin),
      },
      templateName: "user-invitation",
      to: invitation.email,
    });
  } else {
    log.error(`Could not send email for invitation ID ${invitation.id}`);
  }
};

export default sendInvitation;
