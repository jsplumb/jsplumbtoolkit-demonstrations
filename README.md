# jsplumbtoolkit-demonstrations

A set of demonstrations for the Toolkit edition. Previously these were all in separate repositories in the jsplumb-toolkit-demonstrations organisation. These demonstrations require a 6.x version of the Toolkit.

## Repository organisation

The demonstrations all reside inside the `src` directory, which itself is broken up into several subdirectories:

- `angular` Angular demonstrations, supporting up to Angular 16 (although for 16+ you need to be using at least version 6.1.0 of the Toolkit). These demonstrations are of course all written in Typescript.

- `react` React demonstrations, supporting React 16+.  Currently, the Database Visualizer and Skeleton React demonstrations are written in ES6, and the Flowchart Builder is written in Typescript.

- `vue2` Vue 2 demonstrations. These are written in ES6.

- `vue3` Vue 3 demonstrations. These are written in ES6.

- `svelte` Svelte 3 demonstrations. These are written in ES6.

- `vanilla` Demonstrations that do not use a library integration. Some of these demonstrations have examples in ES5, ES6 and Typescript, others are written only in Typescript or ES6.

## Initialisation

To get started, first run this command from the project root:

```
npm run init
```

This will take a few minutes as it installs common dependencies and then builds the `vanilla` demonstrations. 

If you wish to build the demonstrations for one of the library integrations, you can use one of these commands:

```
npm run build:angular
```

```
npm run build:react
```

```
npm run build:vue2
```

```
npm run build:vue3
```

```
npm run build:svelte
```

If you just want to build everything before you start, run:

```
npm run build:all
```

This will take several minutes to run.

## Accessing demonstrations

### Via embedded web server

Run the embedded web server with this command:

```
npm run serve
```

This uses the `http-server` package and will spin up a server on port 8080 by default. The landing page for this server will contain links to the various demonstrations, and will warn you if a specific set of demonstrations have not been built.

### Accessing individually

The Angular, Vue 2/3 and React demonstrations are all stand-alone apps that can be run individually. Navigate to the appropriate demonstration directory and then:

#### Angular

```
npm i
ng serve
```

#### React

```
npm i
npm run start
```

NOTE: the `index.html` in the React demonstrations is configured to access the JS bundle at:

```
<script src="dist/bundle.js"></script>
```

If you run the demonstration stand alone via npm you will need to alter the path to the bundle:

```
<script src="bundle.js"></script>
```

#### Vue 2 / Vue 3

```
npm i
npm run serve
```


