# REZoning Web

Web application to explore Renewable Energy Zones.

## Gulp for building
The build system currently supports:

- Image optimization
- Watchify for JS bundling
- Minification/uglification where appropriate
- Serving and live reloading of pages

There are two commands, both run via [`yarn`](https://yarnpkg.com/en/).

- `yarn build` - clean & build everything and put it into dist folder
- `yarn serve` - serve the pages and utilize live reload on changes to fonts, images, scripts and HTML.


## Assets Structure

```
app/assets/
|
+- scripts/: The user scripts
|  |
|  +- config/: configuration files (see configuration section)
|  |
|  +- styles/: the styled components
|
+- vendor/: Any third-party script that can't be required()
|
+- graphics/: Images for the site divided in:
|  |
|  +- layout/: Images for layout elements (Ex: background images)
|  +- meta/: Images for the meta tags (Mostly icons and facebook images)
|  +- content/: Content image
|
```

### Configurations and environment variables

At times, it may be necessary to include options/variables specific to `production`, `staging` or `local` in the code. To handle this, there is a master config.js file. This file should not be modified.  Instead, modify one of:

- config/production.js - production settings
- config/staging.js - overrides the production settings for staging server (basically Travis not on the DEPLOY branch)
- config/local.js - local (development) overrides. This file is gitignored, so you can safely change it without polluting the repo.

When developing locally with `yarn run serve`, the default will be to use `production.js` (with overrides from `local.js`).  However, if you need to run with the staging settings, use: `yarn run stage` (this will not start a server)

### Development

This project uses components of [ui-library-seed](https://github.com/developmentseed/ui-library-seed). Published components can be added from the NPM registry with `yarn add @devseed-ui/{COMPONENT}`. To develop locally in parallel, follow the [documentation](https://github.com/developmentseed/ui-library-seed/blob/develop/DEVELOPMENT.md).

### How scripts are built

The script build, which uses `browserify`, outputs two js files: `bundle.js` and
`vendor.js`:
 - `bundle.js`, created by the `javascript` task in deployment and by
   `watchify` during development, contains all the app-specific code:
   `app/scripts/main.js` and all the scripts it `require`s that are local to
   this app.
 - `vendor.js`, created by the `vendorBundle` task, contains all the external
   dependencies of the app: namely, all the packages you install using `yarn
   add ...`.

## Circle CI for testing and deployment
The `.circleci/config.yml` file enables the usage of [Circle CI](http://circleci.com/) as a test and deployment system. In this particular case, circle uses workflows with the linting, test, a build phases running simultaneously. When a commit is made to master the deploy phase will also run, given that the previous succeed.
## Linting

Our [ESLint rules](.eslintrc) are based on `standard` rules, with some custom options. To check linting errors run:

    yarn lint

## Coding style

File [.editorconfig](.editorconfig) defines basic code styling rules, like indent sizes. 

[Prettier](https://prettier.io) is the recommended code formatter. Atom and VSCode have extensions supporting Prettier-ESLint integration, which will help maintain style consistency while following linting rules.
