import i18Plugin, { useLocaleStore } from "@dzangolab/vue3-i18n";
import { mount, RouterLinkStub } from "@vue/test-utils";
import { createPinia } from "pinia";
import { describe, it, expect } from "vitest";

import appConfig from "../../../components/__test__/config";
import Profile from "../../Profile.vue";
import router from "../router";

import type { VueWrapper } from "@vue/test-utils";

describe("Profile", () => {
  const pinia = createPinia();

  const { setLocale } = useLocaleStore(appConfig.slug);

  const locales = ["en", "fr"];

  for (const locale of locales) {
    setLocale(locale);

    const wrapper: VueWrapper = mount(Profile, {
      global: {
        plugins: [
          pinia,
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
          AccountInfo: true,
          profileForm: true,
        },
      },
    });

    it("matches snapshot in " + locale, () => {
      expect(wrapper.element).toMatchSnapshot();
    });
  }
});
