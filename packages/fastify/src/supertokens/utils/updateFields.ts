interface FormField {
  id: string;
  value: string;
}

const updateFields = (formFields: FormField[], id?: string) => {
  if (id) {
    formFields.find((field) => {
      if (field.id === "email") {
        field.value = id + "_" + field.value;
      }
    });
  }

  return formFields;
};

export default updateFields;
