// Here are the main project controls
const CLIENT_NAME = 'amps-view-server-demo';
const TRANSPORT = 'ws';
const HOST = 'localhost';
const PROTOCOL = 'amps';
const MESSAGE_TYPE = 'json';
const TOPIC = 'orders';
const VIEW = 'vwap';
const PORT = '9000';
const LAST_N_ORDERS = 50;
const URI = TRANSPORT + '://' + HOST + ':' + PORT + '/' + PROTOCOL + '/' + MESSAGE_TYPE;


module.exports = {
    CLIENT_NAME: CLIENT_NAME,
    TRANSPORT: TRANSPORT,
    HOST: HOST,
    PROTOCOL: PROTOCOL,
    MESSAGE_TYPE: MESSAGE_TYPE,
    LAST_N_ORDERS: LAST_N_ORDERS,
    TOPIC: TOPIC,
    VIEW: VIEW,
    PORT: PORT,
    URI: URI
};
