## AMPS View Server Demo

This project provides a quick introduction into using Webix DataTable with AMPS 
JavaScript client by building a simple web application which utilizes the AMPS 
technologies in order to provide web UI for a view server.


#### Prerequisites

- Node.js (**v6.9.1** or higher) with NPM (Node Package Manager). It can be 
  downloaded from [the official website](https://nodejs.org/en/download/) or via 
  your operating system's 
  [package manager](https://nodejs.org/en/download/package-manager/) (preferred).
- AMPS Server **v5.2** or higher.



#### Installation

From the project directory, run the following command:

```bash
npm install --save
```

The above command installs packages required for this application to work. The 
command installs these packages locally in the project directory.


#### AMPS Server

In order to run the demo, the AMPS Server 5.2 or higher is required. This package comes with the AMPS server 
configuration file. 

The server demo configuration file is available in `server` directory. Start the AMPS Server with the provided 
configuration file:

```bash
<PATH_TO_AMPS_SERVER_BINARY>/ampServer amps_instance/config.xml
```


#### Quick Start

- Start the publishing script:

```bash
node server/data_flow.js
```

- Start the web interface and open it in a browser:

```bash
npm start
```

Once started, the web interface will be available at `http://localhost:8000`.

Any code modified in the `src` directory will be recompiled automatically while
the `npm start` command is running.

- Click on the "Connect" button to see the view server in action.

- *Optionally*, additional parameters, such as `filter`, `topN`, and `orderBy` can be set. Try to modify them to see
  how it changes the output.



#### AMPS Application settings

Settings are available in `src/constants.ts`, such as:

- *CLIENT_NAME*: The JavaScript Client name;
- *TRANSPORT*: either `ws` or `wss` (`websocket` or `websocket secure` protocol)
- *HOST*: the hostname or IP-address of the AMPS server instance;
- *LAST_N_ORDERS*: How many most recent orders to show in the `Orders` table;
- *PORT*: the connection port for sending messages;
- *MESSAGE_TYPE*: the message type will be used for data (`json` by default);
- *TOPIC*: the main topic for the grid (`orders`);
- *VIEW*: the VWAP topic for the grid (`vwap`).




#### Modifying the source code

All code of the application is located in the `src` directory. The application 
consists of the following parts:

- `sql.ts` - Model
- `ui.ts` - View
- `main.ts` - Entry point
- `constants.js` - Client settings
- `server/data_flow.js` - The script that randomly publishes orders
- `server/config.xml` - The AMPS Server configuration file

When `npm start` is running, any modifications to the source code will recompile 
and refresh the web interface.

