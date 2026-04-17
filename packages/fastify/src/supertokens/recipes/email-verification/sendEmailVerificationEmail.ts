import {
  EMAIL_VERIFICATION_PATH,
  getOrigin,
  sendEmail,
} from "@prefabs.tech/fastify-user";
import emailVerification from "supertokens-node/recipe/emailverification";

import getSaasConfig from "../../../config";
import Email from "../../utils/email";

import type { Account } from "../../../types";
import type { FastifyInstance, FastifyRequest } from "fastify";
import type { EmailDeliveryInterface } from "supertokens-node/lib/build/ingredients/emaildelivery/types";
import type { TypeEmailVerificationEmailDeliveryInput } from "supertokens-node/recipe/emailverification/types";

const getProtocol = (
  request: FastifyRequest | undefined,
  fallback: string,
  configuredProtocol?: string,
) => {
  if (request?.protocol) {
    return request.protocol;
  }

  if (configuredProtocol) {
    return configuredProtocol;
  }

  try {
    return new URL(fallback).protocol.replace(":", "");
  } catch {
    return "https";
  }
};

const sendEmailVerificationEmail = (
  originalImplementation: EmailDeliveryInterface<TypeEmailVerificationEmailDeliveryInput>,
  fastify: FastifyInstance,
): typeof emailVerification.sendEmail => {
  const websiteDomain = fastify.config.appOrigin[0] as string;
  const saasConfig = getSaasConfig(fastify.config);

  return async (input) => {
    let origin: string;
    let request: FastifyRequest | undefined;

    try {
      request = input.userContext._default.request.request;
    } catch {
      request = undefined;
    }

    try {
      const url =
        (request?.headers?.referer as string | undefined) ||
        (request?.headers?.origin as string | undefined) ||
        request?.hostname ||
        "";

      origin = getOrigin(url) || websiteDomain;
    } catch {
      origin = websiteDomain;
    }

    const requestAccount =
      (request?.account as Account | undefined) ||
      (input.userContext?.account as Account | undefined);
    const protocol = getProtocol(
      request,
      websiteDomain,
      fastify.config.protocol as string | undefined,
    );

    if (requestAccount?.domain) {
      origin = `${protocol}://${requestAccount.domain}`;
    } else if (requestAccount?.slug && saasConfig.rootDomain) {
      origin = `${protocol}://${requestAccount.slug}.${saasConfig.rootDomain}`;
    }

    const emailVerifyLink = input.emailVerifyLink.replace(
      websiteDomain + "/auth/verify-email",
      origin +
        (fastify.config.user.supertokens.emailVerificationPath ||
          EMAIL_VERIFICATION_PATH),
    );

    let email = input.user.email;

    if (request) {
      email = Email.removePrefix(email, request.authEmailPrefix);
    }

    sendEmail({
      fastify,
      subject:
        fastify.config.user.emailOverrides?.emailVerification?.subject ||
        "Email Verification",
      templateName:
        fastify.config.user.emailOverrides?.emailVerification?.templateName ||
        "email-verification",
      to: email,
      templateData: {
        emailVerifyLink,
      },
    });
  };
};

export default sendEmailVerificationEmail;
