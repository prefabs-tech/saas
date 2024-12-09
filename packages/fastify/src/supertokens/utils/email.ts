const Email = {
  addIdPrefix: (email: string, id?: string) => {
    if (id) {
      email = id + "_" + email;
    }

    return email;
  },
  removeIdPrefix: (email: string, id?: string) => {
    if (
      id &&
      id == email.slice(0, Math.max(0, Math.max(0, email.indexOf("_"))))
    ) {
      email = email.slice(Math.max(0, email.indexOf("_") + 1));
    }

    return email;
  },
};

export default Email;
