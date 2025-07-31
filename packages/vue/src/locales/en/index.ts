import type { LocaleMessages, VueMessageType } from "@prefabs.tech/vue3-i18n";

function getLocaleMessages(): LocaleMessages<VueMessageType> {
  const contexts = import.meta.glob("./*.json", { eager: true }) as Record<
    string,
    LocaleMessages<VueMessageType>
  >;

  const messages: LocaleMessages<VueMessageType> = {};

  for (const path in contexts) {
    const matched = path.match(/([A-Za-z0-9-_]+)\./i);

    if (matched && matched.length > 1) {
      const context = matched[1];

      messages[context] = contexts[path].default;
    }
  }

  return messages;
}

export default getLocaleMessages();
