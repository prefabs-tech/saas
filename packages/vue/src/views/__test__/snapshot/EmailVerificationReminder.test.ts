import i18Plugin, { useLocaleStore } from "@dzangolab/vue3-i18n";
import { mount} from "@vue/test-utils";
import { describe, it, expect } from "vitest";

import appConfig from "../../../components/__test__/config";
import EmailVerificationReminder from "../../EmailVerificationReminder.vue";

import type { VueWrapper } from "@vue/test-utils";

describe("EmailVerificationReminder", () => {
  const { setLocale } = useLocaleStore(appConfig.slug);

  const locales = ["en", "fr"];

  for (const locale of locales) {
    setLocale(locale);

    const wrapper: VueWrapper = mount(EmailVerificationReminder, {
      global: {
        plugins: [
          [
            i18Plugin,
            {
              config: appConfig,
            },
          ],
        ],
      },
    });

    it("matches snapshot in " + locale, () => {
      expect(wrapper.element).toMatchSnapshot();
    });
  }
});
