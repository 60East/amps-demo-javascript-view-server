## AMPS ag-Grid React View Server Demo

This project provides a quick introduction into using ag-Grid together with React
and AMPS JavaScript client by building a simple web application which utilizes the AMPS 
technologies in order to provide web UI for a view server.


#### Prerequisites

- Node.js (**v6.9.1** or higher) with NPM (Node Package Manager). It can be 
  downloaded from [the official website](https://nodejs.org/en/download/) or via 
  your operating system's [package manager](https://nodejs.org/en/download/package-manager/) (preferred).
- AMPS Server **v5.2** or higher.


#### Installation

From the project directory, run the following command:

```bash
npm install --save

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

Settings are available in `src/constants.ts`, such as:

- *URI*: the URI the AMPS server instance;


#### Modifying the source code

All code of the application is located in the `src` directory. When `npm start` is running, any modifications to the 
source code will recompile and refresh the web interface.

