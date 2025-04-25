import { sendVerificationEmail } from "supertokens-web-js/recipe/emailverification";

type resendEmailStatus = "OK" | "EMAIL_ALREADY_VERIFIED_ERROR";

const resendVerificationEmail = async (): Promise<
  resendEmailStatus | undefined
> => {
  const response = await sendVerificationEmail();

  return response.status;
};

export default resendVerificationEmail;
