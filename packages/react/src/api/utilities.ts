const encodeURIParameter = <T>(argument: T) => {
  return !argument ? undefined : JSON.stringify(argument);
};

export { encodeURIParameter };
