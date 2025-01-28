import { Provider } from "@dzangolab/react-form";
import React from "react";

import { SignupFormFields } from "./SignupFormFields";

interface Properties {
  email?: string;
  handleSubmit: (credentials: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  loading?: boolean;
}

export const SignupForm = ({ email, handleSubmit, loading }: Properties) => {
  return (
    <Provider
      onSubmit={handleSubmit}
      defaultValues={{
        customerName: "",
        password: "",
        email: email || "",
        confirmPassword: "",
      }}
    >
      <SignupFormFields disableEmailField={!!email} loading={loading} />
    </Provider>
  );
};
