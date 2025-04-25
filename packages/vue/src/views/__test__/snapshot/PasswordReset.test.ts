import configPlugin from "@dzangolab/vue3-config";
import i18Plugin, { useLocaleStore } from "@dzangolab/vue3-i18n";
import { LoadingButton, LoadingIcon } from "@dzangolab/vue3-ui";
import { mount, RouterLinkStub } from "@vue/test-utils";
import { createPinia } from "pinia";
import { describe, it, expect } from "vitest";

import appConfig from "../../../components/__test__/config";
import PasswordReset from "../../PasswordReset.vue";
import router from "../router";

import type { VueWrapper } from "@vue/test-utils";

describe("PasswordReset", () => {
  const pinia = createPinia();

  const { setLocale } = useLocaleStore(appConfig.slug);

  const locales = ["en", "fr"];

  for (const locale of locales) {
    setLocale(locale);

    const wrapper: VueWrapper = mount(PasswordReset, {
      global: {
        components: {
          LoadingButton,
          LoadingIcon,
        },
        plugins: [
          [
            configPlugin,
            {
              config: appConfig,
            },
          ],
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
        },
      },
    });

    it("matches snapshot in " + locale, () => {
      expect(wrapper.element).toMatchSnapshot();
    });
  }
});
