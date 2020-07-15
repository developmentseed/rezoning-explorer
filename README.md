# REZoning Web

Web application to explore Renewable Energy Zones.

## Installation and Usage

The following steps will walk through setting up a development environment. Please check [this file](DEVELOPMENT.md) for more details on development process.

### Install modules dependencies

Requirements:

- [git](https://git-scm.com)
- [nvm](https://github.com/creationix/nvm)
- [yarn](https://yarnpkg.com/docs/install)

[Clone this repository locally](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository) and activate required Node.js version:

```
nvm install
```

Install Node.js dependencies:

```
yarn install
```

#### Config files

The config files can be found in `app/assets/scripts/config`. After installing the project, there will be an empty `local.js` that you can use to set the config. This file should not be committed. More details on config file can be found [here](DEVELOPMENT.md#configurations-and-environment-variables).

### Development

Start server with live code reload at [http://localhost:9000](http://localhost:9000):

    yarn serve

### Testing

Jest is available for unit testing on components:

    yarn test

Integration testing is done with Cypress:

    yarn cy:test

To develop new tests with Cypress, start the development server and run:

    yarn run cypress open

### Build to production

This will generate a minified build to `dist` folder:

    yarn build

## License

[MIT](LICENSE)
