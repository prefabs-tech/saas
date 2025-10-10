const getHost = (url: string) => {
  let host: string;

  try {
    host = new URL(url).host;

    if (!host) {
      throw new Error("Host is empty");
    }
  } catch {
    host = url;
  }

  return host;
};

export default getHost;
