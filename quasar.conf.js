/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://v2.quasar.dev/quasar-cli/quasar-conf-js

/* eslint-env node */
const ESLintPlugin = require("eslint-webpack-plugin");
const { configure } = require("quasar/wrappers");

const fs = require("fs");
const homedir = require("os").homedir();

function certs() {
  try {
    return {
      key: fs.readFileSync(`${homedir}/.ssh/dev/server-key.pem`),
      cert: fs.readFileSync(`${homedir}/.ssh/dev/server.pem`),
      cacert: fs.readFileSync(`${homedir}/.ssh/dev/ca.pem`),
    };
  } catch {
    console.warn("Using auto-generated certificates");
    return false;
  }
}

module.exports = configure(function (ctx) {
  return {
    // https://v2.quasar.dev/quasar-cli/supporting-ts
    supportTS: true,

    // https://v2.quasar.dev/quasar-cli/prefetch-feature
    // preFetch: true,

    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://v2.quasar.dev/quasar-cli/boot-files
    boot: [
      "i18n",
      "axios",
      "login",
      "invenio",
      "addressbar-color",
      "common-components",
    ],

    // https://v2.quasar.dev/quasar-cli/quasar-conf-js#Property%3A-css
    css: ["app.sass"],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      // 'ionicons-v4',
      // 'mdi-v5',
      // 'fontawesome-v5',
      // 'eva-icons',
      // 'themify',
      // 'line-awesome',
      "roboto-font-latin-ext", // this or either 'roboto-font', NEVER both!

      // 'roboto-font', // optional, you are not bound to it
      "material-icons", // optional, you are not bound to it
    ],

    // Full list of options: https://v2.quasar.dev/quasar-cli/quasar-conf-js#Property%3A-build
    build: {
      vueRouterMode: "history", // available values: 'hash', 'history'
      devtool: "source-map",

      // transpile: false,

      // Add dependencies for transpiling with Babel (Array of string/regex)
      // (from node_modules, which are by default not transpiled).
      // Applies only if "transpile" is set to true.
      // transpileDependencies: [],

      // rtl: false, // https://v2.quasar.dev/options/rtl-support
      // preloadChunks: true,
      // showProgress: false,
      // gzip: true,
      // analyze: true,

      // Options below are automatically set depending on the env, set them if you want to override
      // extractCSS: false,

      // https://v2.quasar.dev/quasar-cli/handling-webpack
      // "chain" is a webpack-chain object https://github.com/neutrinojs/webpack-chain
      chainWebpack(chain) {
        chain
          .plugin("eslint-webpack-plugin")
          .use(ESLintPlugin, [{ extensions: ["js", "vue"] }]);
        chain.module
          .rule("pug")
          .test(/\.pug$/)
          .use("pug-plain-loader")
          .loader("pug-plain-loader");
      },
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli/quasar-conf-js#Property%3A-devServer
    devServer: {
      https: certs() || true,
      port: 5000,
      open: false, // opens browser window automatically
      proxy: {
        "/": {
          target: "https://127.0.0.1:8080/",
          changeOrigin: false,
          secure: false,
          debug: true,
          bypass: function (req, res, proxyOptions) {
            if (
              req.headers.accept.indexOf("html") !== -1 &&
              !req.path.startsWith("/oauth") &&
              !req.path.startsWith("/2.0") &&
              !req.path.startsWith("/api/oauth")
            ) {
              // TODO: check query here
              console.log("Skipping proxy for browser request.", req.path);
              return "/index.html";
            }
          },
        },
      },
    },

    // https://v2.quasar.dev/quasar-cli/quasar-conf-js#Property%3A-framework
    framework: {
      config: {},

      // iconSet: 'material-icons', // Quasar icon set
      // lang: 'cs', // Quasar language pack

      // For special cases outside of where the auto-import stategy can have an impact
      // (like functional components as one of the examples),
      // you can manually specify Quasar components/directives to be available everywhere:
      //
      components: [
        "QExpansionItem",
        "QList",
        "QItem",
        "QSeparator",
        "QItemSection",
        "QBadge",
        "QCheckbox",
        "QStepper",
        "QStep",
        "QStepperNavigation",
        "QInnerLoading",
        "QCarousel",
        "QTabs",
        "QTab",
        "QBtn",
        "QChip",
        "QTooltip",
        "QBtnDropdown",
        "QSpinnerDots",
        "QCircularProgress",
        "QPageSticky",
      ],
      // directives: [],

      // Quasar plugins
      plugins: [
        "Dialog",
        "AddressbarColor",
        "Meta",
        "BottomSheet",
        "Notify",
        "Loading",
      ],
    },

    // animations: 'all', // --- includes all animations
    // https://v2.quasar.dev/options/animations
    animations: ["fadeIn", "fadeOut"],

    // https://v2.quasar.dev/quasar-cli/developing-ssr/configuring-ssr
    ssr: {
      pwa: false,
      // manualStoreHydration: true,
      prodPort: 3000, // The default port that the production server should use
      // (gets superseded if process.env.PORT is specified at runtime)

      maxAge: 1000 * 60 * 60 * 24 * 30,
      // Tell browser when a file from the server should expire from cache (in ms)

      chainWebpackWebserver(chain) {
        chain
          .plugin("eslint-webpack-plugin")
          .use(ESLintPlugin, [{ extensions: ["js", "vue"] }]);
      },

      middlewares: [
        ctx.prod ? "compression" : "",
        "render", // keep this as last one
      ],
    },

    // https://v2.quasar.dev/quasar-cli/developing-pwa/configuring-pwa
    pwa: {
      workboxPluginMode: "GenerateSW", // 'GenerateSW' or 'InjectManifest'
      workboxOptions: {}, // only for GenerateSW

      // for the custom service worker ONLY (/src-pwa/custom-service-worker.[js|ts])
      // if using workbox in InjectManifest mode
      chainWebpackCustomSW(chain) {
        chain
          .plugin("eslint-webpack-plugin")
          .use(ESLintPlugin, [{ extensions: ["js"] }]);
      },

      manifest: {
        name: `Czech national repository`,
        short_name: `NR`,
        description: `Czech national repository UI app`,
        display: "standalone",
        orientation: "portrait",
        background_color: "#ffffff",
        theme_color: "#027be3",
        icons: [
          {
            src: "icons/icon-128x128.png",
            sizes: "128x128",
            type: "image/png",
          },
          {
            src: "icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icons/icon-256x256.png",
            sizes: "256x256",
            type: "image/png",
          },
          {
            src: "icons/icon-384x384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli/developing-cordova-apps/configuring-cordova
    cordova: {
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli/developing-capacitor-apps/configuring-capacitor
    capacitor: {
      hideSplashscreen: true,
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli/developing-electron-apps/configuring-electron
    electron: {
      bundler: "packager", // 'packager' or 'builder'

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',
        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        appId: "nr-ui-quasar2",
      },

      // "chain" is a webpack-chain object https://github.com/neutrinojs/webpack-chain
      chainWebpackMain(chain) {
        chain
          .plugin("eslint-webpack-plugin")
          .use(ESLintPlugin, [{ extensions: ["js"] }]);
      },

      // "chain" is a webpack-chain object https://github.com/neutrinojs/webpack-chain
      chainWebpackPreload(chain) {
        chain
          .plugin("eslint-webpack-plugin")
          .use(ESLintPlugin, [{ extensions: ["js"] }]);
      },
    },
  };
});
