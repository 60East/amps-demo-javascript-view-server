## AMPS ag-Grid React View Server Demo

This project provides a quick introduction into using ag-Grid together with React
and AMPS JavaScript client by building a simple web application which utilizes the AMPS 
technologies in order to provide web UI for a view server.


#### Prerequisites

- Node.js **20.19+** or **22.12+** (including Node.js 24) with NPM (Node Package Manager). It can be
  downloaded from [the official website](https://nodejs.org/en/download/) or via 
  your operating system's [package manager](https://nodejs.org/en/download/package-manager/) (preferred).
- AMPS Server **v5.2** or higher.


#### Installation

From the project directory, run the following command:

```bash
npm ci

or

yarn install
```

The above command installs packages required for this application to work. The 
command installs these packages locally in the project directory.


#### AMPS Server

In order to run the demo, the AMPS Server 5.2 or higher is required. This package comes with the AMPS server 
configuration file. 

The server demo configuration file is available in `server` directory. Start the AMPS Server with the provided 
configuration file:

```bash
<PATH_TO_AMPS_SERVER_BINARY>/ampServer server/config.xml
```


#### Quick Start

- Start the publishing script:

```bash
node server/data_flow.js
```

- Start the web interface and open it in a browser:

```bash
npm start

or 

yarn start
```

Once started, the web interface will be available at `http://localhost:3000`.

Any code modified in the `src` directory will be recompiled automatically while the `npm start` command is running.

- Click on the "Query and Subscribe" button to see the view server in action.

- *Optionally*, additional parameters, such as `filter`, `options`, and `orderBy` can be set. Try to modify them to see
  how it changes the output.



#### AMPS Application settings

Settings are available in `src/constants.mjs`, such as:

- *URI*: the URI of the AMPS server instance. The browser endpoint can also be set
  with `VITE_AMPS_URI` in `.env.local` before starting or building the app.


#### Modifying the source code

All code of the application is located in the `src` directory. When `npm start` is running, any modifications to the 
source code will recompile and refresh the web interface.


#### Production build

```bash
npm run build
npm run preview
```

Vite builds the application into `build/`. The preview command serves that build
locally at `http://localhost:3000`; deploy the contents of `build/` to your web
server for production. For a subdirectory deployment, pass the base path when
building, for example `npm run build -- --base=/demo/`.

The Vite build replaces Create React App and uses native module workers. It no
longer installs an offline service worker. A retirement worker at
`public/service-worker.js` lets previously installed versions stop serving the
old cached application when they next check for an update.

#### Smoke test

```bash
npm test
```

Run `npm run test:watch` to rerun the test as you edit files.

The Vitest/jsdom test in `src/App.test.jsx` renders the heading and all three
grids, then checks that unmounting disconnects and terminates their workers.
Workers are mocked, so an AMPS server is not required. This checks rendering
and cleanup; it does not verify browser layout or live AMPS data.
