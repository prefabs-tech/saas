import { CustomerSignupData, UserSignupData } from "@/types/customer";

type PrepareSignupData = {
  data: CustomerSignupData | UserSignupData;
  customerSignup?: boolean;
};

export const prepareSignupData = ({
  data,
  customerSignup = true,
}: PrepareSignupData) => {
  if (!customerSignup) {
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
  } = data as CustomerSignupData;

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
    customerFormFields: [
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
