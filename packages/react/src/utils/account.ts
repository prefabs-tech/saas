import { AccountSignupData, UserSignupData } from "@/types/account";

type PrepareSignupData = {
  data: AccountSignupData | UserSignupData;
  accountSignup?: boolean;
};

export const prepareSignupData = ({
  data,
  accountSignup = true,
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
    password,
    name,
    individual,
    organizationName,
    registeredNumber,
    taxId,
    slug,
    useSeparateDatabase,
  } = data as AccountSignupData;

  return {
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
        id: "organizationName",
        value: !individual ? organizationName : null,
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
  };
};
