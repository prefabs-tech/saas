import EmailVerification from "supertokens-web-js/recipe/emailverification";

const getVerificationStatus = async () => {
  return (await EmailVerification.isEmailVerified()).isVerified;
};

const verifyEmail = async () => {
  const isVerified = await getVerificationStatus();

  if (isVerified) {
    return { status: "EMAIL_ALREADY_VERIFIED" };
  } else {
    const response = await EmailVerification.verifyEmail();

    return { status: response.status };
  }
};

export { getVerificationStatus };

export default verifyEmail;
