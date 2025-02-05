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
    customerFormFields: [
      {
        id: "name",
        value: (data as CustomerSignupData).name,
      },
      {
        id: "individual",
        value: (data as CustomerSignupData).individual,
      },
      {
        id: "organizationName",
        value: (data as CustomerSignupData).organizationName,
      },
      {
        id: "registeredNumber",
        value: (data as CustomerSignupData).registeredNumber,
      },
      {
        id: "taxId",
        value: (data as CustomerSignupData).taxId,
      },
      {
        id: "slug",
        value: (data as CustomerSignupData).slug,
      },
      {
        id: "useSeparateDatabase",
        value: (data as CustomerSignupData).useSeparateDatabase,
      },
      {
        id: "domain",
        value: (data as CustomerSignupData).domain,
      },
    ],
  };
};
