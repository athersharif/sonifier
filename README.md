# Sonifier

Sonifier is a simple JavaScript library that converts a two-dimensional data into a sonified response (also known as "audio graphs"). Sonification assists people who use screen readers (for e.g., blind and people with low-vision) to understand the "ups-and-downs" of the data such as trends in a temporal data set. 

This library is part of an ongoing research project being conducted at the University of Washington, led by [Ather Sharif](https://athersharif.me).

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/athersharif/sonifier/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/sonifier.svg?style=flat)](https://www.npmjs.com/package/sonifier) [![CircleCI](https://circleci.com/gh/athersharif/sonifier/tree/main.svg?style=svg)](https://circleci.com/gh/athersharif/sonifier/?branch=main)

## Installation

```npm i sonifier --save```

## Examples

Examples are provided under the `example` folder.

## Dev Tools

### Lint

[ESLint](https://github.com/eslint/eslint) is used for linting.

Command: `make lint` / `npm run lint`

### Tests

[Jest](https://jestjs.io/) and [Enzyme](https://airbnb.io/enzyme/) are used as testing frameworks and for coverage. Adding/modifying tests for the proposed changes and ensuring that the coverage is at 100% is crucial. To run tests in watch mode:

`npm run test`

To generate coverage report:

`npm run test:coverage`

### Docs

[JSDoc](https://github.com/jsdoc/jsdoc) is used for documentation. It's important to follow the guidelines for JSDoc to add informative and descriptive comments and documentation to the code. Documentation can be found [here](https://athersharif.github.io/sonifier/).

Command: `make docs` / `npm run docs`

### Code formatter

[Prettier](https://github.com/prettier/prettier) is used for code formatting.

Command: `make prettier` / `npm run prettier`

### Build

[Babel](https://babeljs.io/) is used for build purposes. Runs lint, tests, code formatter and docs as well.

Command: `make build` / `npm run prepublish`

## Contributing

Pull requests are welcome and appreciated. Contributing guidelines can be found [here](https://github.com/athersharif/sonifier/blob/master/CONTRIBUTING.md).

## License

Licensed under BSD. Can be found [here](https://github.com/athersharif/sonifier/blob/master/LICENSE).

## Citations

Ather Sharif, Olivia H. Wang, Alida T. Muongchan, Katharina Reinecke, and Jacob O. Wobbrock. 2022. VoxLens: Making Online Data Visualizations Accessible with an Interactive JavaScript Plug-In. In Proceedings of the 2022 CHI Conference on Human Factors in Computing Systems (CHI '22). Association for Computing Machinery, New York, NY, USA, Article 478, 1–19.

[PDF](https://athersharif.me/documents/chi-2022-voxlens.pdf) | [Presentation](https://www.youtube.com/watch?v=_ACIJafIRuU)

Ather Sharif, Olivia H. Wang, and Alida T. Muongchan. 2022. "What Makes Sonification User-Friendly?" Exploring Usability and User-Friendliness of Sonified Responses. In The 24th International ACM SIGACCESS Conference on Computers and Accessibility (ASSETS '22). Association for Computing Machinery, New York, NY, USA. To appear.

[PDF](https://athersharif.me/documents/assets-2022-sonification.pdf) | [Presentation]()
