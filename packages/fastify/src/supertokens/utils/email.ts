const Email = {
  addPrefix: (email: string, prefix: string = "") => {
    if (prefix) {
      email = prefix + email;
    }

    return email;
  },
  removePrefix: (email: string, prefix: string = "") => {
    if (prefix && email.startsWith(prefix)) {
      email = email.slice(prefix.length);
    }

    return email;
  },
};

export default Email;
