import configPlugin from "@dzangolab/vue3-config";
import { mount } from "@vue/test-utils";
import { createPinia } from "pinia";
import { describe, expect, it } from "vitest";
import { createRouter, createWebHistory } from "vue-router";

import SidebarOnlyLayout from "../../SidebarOnlyLayout.vue";
import appConfig from "../config";

import type { VueWrapper } from "@vue/test-utils";

describe("SidebarOnlyLayout", () => {
  it("matches snapshot", () => {
    const pinia = createPinia();
    const router = createRouter({
      history: createWebHistory(),
      routes: [
        {
          path: "/",
          name: "home",
          component: SidebarOnlyLayout,
        },
      ],
    });

    const wrapper: VueWrapper = mount(SidebarOnlyLayout, {
      global: {
        plugins: [
          pinia,
          [
            configPlugin,
            {
              config: appConfig,
            },
          ],
          router,
        ],
        stubs: {
          UserMenu: true,
          LocaleSwitcher: true,
        },
      },
      props: {
        menu: [
          {
            name: "Menu1",
            routeName: "menu-1",
            shortName: "M1",
          },
          {
            name: "Menu2",
            routeName: "menu-2",
            shortName: "M2",
          },
        ],
      },
      slots: {
        afterNavLinks: "<div class='after-nav'></div>",
        afterSidebarMenu: "<div class='after-sidebar'></div>",
        default: "<div class='default'></div>",
      },
    });

    expect(wrapper.element).toMatchSnapshot();
  });
});
