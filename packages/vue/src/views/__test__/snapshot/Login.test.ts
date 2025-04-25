import configPlugin from "@dzangolab/vue3-config";
import i18Plugin, { useLocaleStore } from "@dzangolab/vue3-i18n";
import { LoadingButton, LoadingIcon } from "@dzangolab/vue3-ui";
import { mount, RouterLinkStub } from "@vue/test-utils";
import { createPinia } from "pinia";
import { describe, it, expect, vi } from "vitest";

import appConfig from "../../../components/__test__/config";
import Login from "../../Login.vue";
import router from "../router";

import type { VueWrapper } from "@vue/test-utils";

describe("Login", () => {
  const pinia = createPinia();

  const { setLocale } = useLocaleStore(appConfig.slug);

  const locales = ["en", "fr"];

  vi.mock("@/api/user", () => ({
    getIsFirstUser: vi.fn(() => Promise.resolve({ signUp: true })),
  }));

  for (const locale of locales) {
    setLocale(locale);

    const wrapper: VueWrapper = mount(Login, {
      global: {
        components: {
          LoadingButton,
          LoadingIcon,
        },
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
