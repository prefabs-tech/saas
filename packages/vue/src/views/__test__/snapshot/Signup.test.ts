import configPlugin from "@dzangolab/vue3-config";
import i18Plugin, { useLocaleStore } from "@dzangolab/vue3-i18n";
import { mount, RouterLinkStub } from "@vue/test-utils";
import { createPinia } from "pinia";
import { describe, it, expect } from "vitest";

import appConfig from "../../../components/__test__/config";
import SignUp from "../../Signup.vue";
import router from "../router";

import type { VueWrapper } from "@vue/test-utils";

describe("SignUp", () => {
  const pinia = createPinia();

  const { setLocale } = useLocaleStore(appConfig.slug);

  const locales = ["en", "fr"];

  for (const locale of locales) {
    setLocale(locale);

    const wrapper: VueWrapper = mount(SignUp, {
      global: {
        plugins: [
          pinia,
          [
            configPlugin,
            {
              config: appConfig,
            },
          ],
          [
            i18Plugin,
            {
              config: appConfig,
            },
          ],
          router,
        ],
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });

    it("matches snapshot in " + locale, () => {
      expect(wrapper.element).toMatchSnapshot();
    });
  }
});
