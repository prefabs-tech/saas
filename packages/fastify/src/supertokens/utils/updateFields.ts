interface FormField {
  id: string;
  value: string;
}

const updateFields = (formFields: FormField[], prefix: string = "") => {
  if (prefix) {
    formFields.find((field) => {
      if (field.id === "email") {
        field.value = prefix + field.value;
      }
    });
  }

  return formFields;
};

export default updateFields;
