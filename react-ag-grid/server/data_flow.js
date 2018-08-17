/**
 * This script simply connects to the server and then randomly
 * publishes orders to the `orders` topic.
 * If other AMPS clients are installed, they can be used via port 9007
 */

const amps = require('amps');
const { URI } = require('../src/constants');
const SYMBOLS = ['AAPL', 'GOOGL', 'NKE', 'YHOO', 'MSFT', 'UBER', 'ADSK']


async function main() {
    const client = new amps.Client('data-flow-generator')
    try {
        await client.connect(URI)

        // Start random publishers for each symbol
        for (let i = 0; i < SYMBOLS.length; ++i) {
            publishRandomlyToSymbol(client, SYMBOLS[i])
        }
    }
    catch (err) {
        console.error('err: ', err)
    }
}


function publishRandomlyToSymbol(client, symbol, minTime, maxTime) {
    if (minTime === undefined) { minTime = 1000 }
    if (maxTime === undefined) { maxTime = 3000 }
    
    setTimeout(function onTimeout() {
        client.publish('orders', {
            symbol: symbol,
            qty: Math.floor(Math.random() * 100 + 1),  // 1 - 100
            price: Math.random() * 400.0 + 50.0  // $50 - $450
        })

        // wait for next interval
        setTimeout(onTimeout, Math.random() * (maxTime - minTime) + minTime)
    }, Math.random() * (maxTime - minTime) + minTime)
}


main()
