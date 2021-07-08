# REZoning Explorer

![image](https://user-images.githubusercontent.com/12634024/124962962-3d159580-dfed-11eb-8b4a-ea760ef1cc45.png)

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

### Zone Data

The application uses [GADM](https://gadm.org) national and sub-national boundaries to perform analysis. 

The geofiles are served from the website `public` folder and loaded at runtime. The files can be generated/updated by running the following script:

    ./scripts/create_regions.sh

This will download GADM data to `.tmp`, parse and copy the results to `app/public` folder. The files are already included in the directory, so the script should be executed only when the source files change.

## License

[MIT](LICENSE)
