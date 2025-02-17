export type ErrorResponse = {
  data: { message: string; status: "ERROR" };
};

export type TSingleFilter = {
  key: string;
  operator: string;
  value: string;
};
