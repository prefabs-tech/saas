export const fetchAccounts = async (
  userId: string,
  { apiBaseUrl }: { apiBaseUrl: string },
) => {
  return {
    accounts: [
      { id: "5d0eff43-8e4a-4403-bb47-9c696144c29a", name: "Customer one" },
      { id: "e1b64db1-e932-45c7-9790-2cfed90b9804", name: "Customer two" },
    ],
  };
};
