// Vuetify Documentation https://vuetifyjs.com

import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import ripple from "vuetify/lib/directives/ripple";

Vue.use(Vuetify, { directives: { ripple } });

const theme = {
  primary: "#2b3ff0",
  secondary: "#ff9900",
  accent: "#e62e62",
  info: "#2b3ff0",
  success: "#4CAF50",
  warning: "#ff9900",
  error: "#e62e62",
};


export default new Vuetify({
  breakpoint: { mobileBreakpoint: 960 },
  icons: {
    values: { expand: "mdi-menu-down" },
  },
  theme: {
    themes: {
      dark: theme,
      light: theme,
    },
  },
});
