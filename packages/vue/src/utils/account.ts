import type { AccountSignupData, UserSignupData } from "../types/user";

type PrepareSignupData = {
  accountSignup?: boolean;
  data: AccountSignupData | UserSignupData;
};

export const prepareSignupData = ({
  accountSignup = true,
  data,
}: PrepareSignupData) => {
  if (!accountSignup) {
    return {
      formFields: [
        {
          id: "email",
          value: data.email,
        },
        {
          id: "password",
          value: data.password,
        },
      ],
    };
  }

  const {
    email,
    individual,
    name,
    password,
    registeredNumber,
    slug,
    taxId,
    useSeparateDatabase,
  } = data as AccountSignupData;

  return {
    accountFormFields: [
      {
        id: "name",
        value: name,
      },
      {
        id: "individual",
        value: individual,
      },
      {
        id: "registeredNumber",
        value: !individual ? registeredNumber : null,
      },
      {
        id: "taxId",
        value: !individual ? taxId : null,
      },
      {
        id: "slug",
        value: slug,
      },
      {
        id: "useSeparateDatabase",
        value: slug ? useSeparateDatabase : false,
      },
    ],
    formFields: [
      {
        id: "email",
        value: email,
      },
      {
        id: "password",
        value: password,
      },
    ],
  };
};
