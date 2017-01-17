useful links: 

https://semaphoreci.com/community/tutorials/setting-up-angular-2-with-webpack

http://blog.rangle.io/dynamically-creating-components-with-angular-2/

### Creating the NPM Project

The first thing we need to do is create an NPM project. We'll take the following steps:

1.  Create a directory. The name doesn't matter, but it's useful to make it descriptive, e.g. `ng2-webpack-test`,
2.  Change into that directory by doing `cd ng2-webpack-test`, or whatever you named your directory, and
3.  Run `npm init -f`. This will generate a `package.json` file for your project.

The following commands should all be run from the directory you created in step 1 above.

### Angular Dependencies

Angular 2 is broken into a lot of packages under the `@angular` organization in NPM. We'll need to install them and pull in RxJS, Zone.js, and some shims.

This can be accomplished through a single install operation:

    npm i -S @angular/common @angular/compiler @angular/core @angular/platform-browser @angular/platform-browser-dynamic es6-shim reflect-metadata rxjs@5.0.0-beta.6 zone.js

`i` is an alias for `install`, `-S` is an alias for `--save`.

To see what each of these projects is for, [take a look at the Angular 2 documentation](https://angular.io/docs/ts/latest/guide/npm-packages.html "Angular 2 NPM Packages").

Although some of these packages are not immediately necessary for performing unit testing, they will allow us to run our application in the browser when the time comes.

## TypeScript Dependencies

Since TypeScript is going to be used in this project, we'll also need to pull it in as a dependency. To help our code have fewer mistakes and maintain a coding standard, we'll be using code linting through the TypeScript linter, [tslint](https://github.com/palantir/tslint "A linter for TypeScript").

    npm i -D typescript tslint typings

`-D` is an alias for `--save-dev`.

The dependency `typings` is a way to pull in [TypeScript definition files](https://www.typescriptlang.org/docs/handbook/writing-declaration-files.html "Writing TypeScript definition files") so that TypeScript can understand third-party libraries and provide code completion suggestions for those libraries. We'll see how to use this later.

## Webpack Dependencies

We'll also need to pull in all of the dependencies for using Webpack, too. This involves Webpack itself, as well as a list of loaders and plugins we'll need for Angular, TypeScript, and unit testing.

Here's the command we need to run:

    npm i -D webpack webpack-dev-server html-webpack-plugin raw-loader ts-loader tslint-loader

The `html-webpack-plugin` and `webpack-dev-server` will benefit us when we run our application in a web browser. We'll see what the raw-loader does as we develop our application.

## Unit Testing Dependencies

For unit testing, we'll be using Karma as our test runner with Jasmine as the testing framework. There are a multitude of testing libraries out there that could be used, like Mocha and Chai, but by default Angular 2 uses Jasmine, and Karma works well with Webpack.

    npm i -D karma karma-jasmine jasmine-core karma-chrome-launcher karma-phantomjs-launcher phantomjs-prebuilt karma-sourcemap-loader karma-webpack

The Chrome and Phantom launchers provide an environment for Karma to run the tests. Phantom is a ["headless" browser](https://en.wikipedia.org/wiki/Headless_browser), which basically means it doesn't have a GUI. There are also launchers for Firefox, Internet Explorer, Safari, and [others](http://karma-runner.github.io/1.0/config/browsers.html "Karma launchers").

The `karma-sourcemap-loader` will take the sourcemaps that we produce in other steps and load them for use during testing. This will be useful when running tests in Chrome, so we can place breakpoints in the debugger to see where our code may have problems.

## Configurations

The following sections will show how set up our project to run tests and how to run our application in a browser. We'll need to configure setups for:

*   TypeScript,
*   Unit Testing,
*   Webpack, and
*   NPM Scripts.

This may seem like a lot to undertake, but we'll see that the developers of these libraries have established configurations that are easy to understand.

You can follow along with the example files located in `examples/introduction/ng2-webpack-test`. You will need to run `npm i` if you have cloned this repository to get all the Node modules installed.

## TypeScript Configuration

The pieces needed for utilizing TypeScript are type definitions, linting, and the actual configuration for the TypeScript compiler. Let's look at the type definitions first.

### Type Definitions

First, we'll need to create the `typings.json` file by running the following command from the root of our project:

    ./node_modules/.bin/typings init

This will run Typings out of its `node_modules` directory and use its `init` command.

The `typings.json` file will be placed in the root of the project. It will contain the name of the project and an empty `dependencies` object. We'll use the `install` command to fill that object.

There are three files to install, but we need two commands:

    ./node_modules/.bin/typings install dt~jasmine env~node --save --global

Again, we are using Typings to install type definitions for `jasmine` and `node`.

The second flag, `--global`, tells Typings that the definitions being installed are for libraries placed in the global scope, i.e. `window.<var>`. You'll notice that each of the libraries is preceded by a `~` with some letters before it. Those letters correspond to different repositories to look for the type definition files. For information on those repositories, look at the "Sources" section of [the Typings Github page](https://github.com/typings/typings "Typings documentation").

We'll run a second install command for the `es6-promise` shim, as it is not a `window.<var>` library. Notice that there is no prefix required.

    ./node_modules/.bin/typings install es6-shim --save

Your type definitions are now installed.

### Linting

We'll also be instituting code linting for our project. This will help our code stay as error-free as possible, but be aware that it won't completely prevent errors from happening.

As mentioned above, we'll use the _tslint_ library to achieve this goal. It uses the file `tslint.json` to describe the rules for how code linting should behave. Let's take it one section at a time:

`{ "class-name": true,`

This will ensure that all of our class names are in Pascal-case (`LikeThis`).

`"comment-format": [ true, "check-space" ],`

Comments are required to have a space between the slashes and the comment itself (`// like this`).

`"indent": [ true, "spaces" ],`

In the great war of tabs versus spaces, we'll take up in the spaces camp. If you're a fan of tabs, you can always change `"spaces"` to `"tabs"`.

`"no-duplicate-variable": true,`

This will help prevent us from redeclaring variables in the same scope.

`"no-eval": true,`

This disables the use of eval.

`"no-internal-module": true,`

TypeScript's `module` keyword has been known to cause confusion in the past, so we'll prevent its usage in favor of `namespace`.

`"no-trailing-whitespace": true,`

This will ensure we're not leaving spaces or tabs at the end of our lines.

`"no-var-keyword": true,`

ES2015 allows variables to be block-scoped by using `const` and `let`. Since TypeScript is a superset of ES2015, it also supports block-scoped variables. These new variable-declaration keywords provide clarity in our code which `var` does not, namely because `let` and `const` variables are not [hoisted](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var#var_hoisting "Mozilla Developer Network on var hoisting"). To help achieve this clarity, this attribute tells tslint to raise a flag when it sees that we've used the `var` keyword.

`"one-line": [ true, "check-open-brace", "check-whitespace" ],`

This rule says that an opening brace must be on the same line as the statement it is for and it needs to be preceded by a space.

`"quotemark": [ true, "single" ],`

This states that all strings be surrounded by single quotemarks. To use double, change `"single"` to `"double"`.

`"semicolon": true,`

This ensures that our lines will end with a semicolon.

`"triple-equals": [ true, "allow-null-check" ],`

This tells us to use triple equals. The `"allow-null-check"` lets `==` and `!=` for doing `null`-checks.

`"typedef-whitespace": [ true, { "call-signature": "nospace", "index-signature": "nospace", "parameter": "nospace", "property-declaration": "nospace", "variable-declaration": "nospace" } ],`

These rules say that when defining types there should not be any spaces on the left side of the colon. This rule holds for return type of a function, index types, function parameters, properties, or variables.

`"variable-name": [ true, "ban-keywords", "check-format" ],`

We need to make sure we don't accidentally use any TypeScript keywords and that variable names are only in camelCase (`likeThis`) or, for constants, all uppercase (`LIKE_THIS`).

`"whitespace": [ true, "check-branch", "check-decl", "check-operator", "check-separator", "check-type" ]`

We'll do a little more whitespace checking for the last rule. This checks branching statements, the equals sign of variable declarations, operators, separators (`, / ;`), and type definitions to see that there is proper spacing all around them.

### Configuring TypeScript

The TypeScript compiler requires a configuration file, `tsconfig.json`. This file is broken into two sections: `compilerOptions` and `exclude`. There are other attributes which you can see in [this schema](http://json.schemastore.org/tsconfig "TypeScript configuration options"), but we will focus on these two. The compiler options section is composed of more rules:

`"compilerOptions": { "emitDecoratorMetadata": true, "experimentalDecorators": true,`

Angular 2 relies heavily on decorators, e.g. `@Component`, and the above rules let TypeScript know that it can use them. The `reflect-metadata` library we pulled in above is used in conjunction with these rules to utilize decorators properly.

`"module": "commonjs", "moduleResolution": "node",`

With these two rules, the compiler knows we'll be using CommonJS modules and that they should be resolved the way Node resolves its modules. It does so by looking at the `node_modules` directory for modules included with non-relative paths. We could have selected `"es2015"` for `moduleResolution`, but since we will be compiling to ES5, we cannot use it.

`"noImplicitAny": true, "suppressImplicitAnyIndexErrors": true,`

With the typing system, you can specify `any` as a type, the first attribute above prevents us from _not_ specifying a type. If you don't know what the type is, then use `any`. The one spot where we want to avoid errors for not specifying a type is with indexing objects, such as arrays, since it should be understood.

`"removeComments": false,`

When TypeScript compiles our code it will preserve any comments we write.

`"sourceMap": true, "target": "es5" },`

As mentioned above we'll be compiling to ES5\. We're going to have TypeScript create sourcemaps for us so that the code we write can be seen in browser debugging tools.

The `exclude` section will tell the compiler which sections to ignore during compilation. There is a `files` section, but since it does not support globbing, we would end up entering every file we need TypeScript to compile, which becomes a serious problem only after a few files.

`"exclude": [ "node_modules", "typings/main", "typings/main.d.ts" ]`

This will exclude the `node_modules` directory and the use of the type definitions found in the `main` directory, as well as the `main.d.ts` file of the `typings` directory.

## Configuring Karma

Next, we will set up Karma to work with Webpack. If you've ever used Karma before, you're familiar with the fact that its configuration can easily become unwieldy.

Karma relies on its configuration file in which we specify which files should be tested and how. The file, typically named `karma.conf.js`, is usually the only file needed. In our setup, we'll have a second file, named `karma.entry.js` that will contain extra setup to work with Angular 2 and Webpack.

We're going to start developing our folder structure a little more here, to keep things clean as we proceed. Create a directory named `karma` in the root of your project. Save the files described in the following two sections inside this directory.

### Setting Up karma.conf.js

`'use strict'; module.exports = (config) => {`


https://domchristie.github.io/to-markdown/