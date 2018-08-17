import { Client, Command } from 'amps';
const { URI } = require('./constants');

var data;
var client;

// Listening for a message from UI process to start
self.addEventListener('message', function(event) {
    // short circuit -- disconnect the client
    if (event.data.disconnect) {
        if (client) {
            client.disconnect();
        }
        
        return;
    }

    // extract data
    var params = event.data;

    // Create the client object
    client = new Client('sow-loader-' + new Date() + '-' + Math.random() * 100000000);
    client.errorHandler(function(err) { self.postMessage({error: err}); });

    // let's go!
    client.connect(URI)
        .then(function() {
            var nextId = 1;
            var sowKeyMap;
            var header;
            var rowId;

            // query data now
            var cmd = new Command(params.isQuery ? 'sow' : 'sow_and_subscribe').topic(params.topic);
            if (params.filter) { cmd.filter(params.filter); }
            if (params.orderBy) { cmd.orderBy(params.orderBy); }
            if (params.options) { cmd.options(params.options); }
            if (params.batchSize) { cmd.batchSize(params.batchSize); }
            
            return client.execute(cmd, function(message) {
                header = message.header.command();

                // new query
                if (header === 'group_begin') {
                    data = [];
                    sowKeyMap = {};
                }
                // loading messages
                else if (header === 'sow') {
                    sowKeyMap[message.header.sowKey()] = nextId;
                    message.data.rowId = nextId++;
                    data.push(message.data);
                }
                // done loading, return data back to the UI process
                else if (header === 'group_end') {
                    // If a query, disconnect the client then report data.
                    if (params.isQuery) {
                        client.disconnect().then(function() {
                            self.postMessage({sow: data});
                        });
                    }
                    // for a subscription, simply report data and continue
                    else {
                        self.postMessage({sow: data});
                    }
                }
                else if (header === 'p') {
                    // either a new message or an update to an existing one

                    // Update case
                    rowId = sowKeyMap[message.header.sowKey()];
                    if (rowId !== undefined) {
                        var index = indexByRowId(rowId);
                        message.data.rowId = rowId;
                        data[index] = message.data;
                        self.postMessage({u: message.data, rowIndex: index});
                    }
                    // new one
                    else {
                        sowKeyMap[message.header.sowKey()] = nextId;
                        message.data.rowId = nextId++;
                        data.push(message.data);
                        self.postMessage({p: message.data, rowIndex: data.length});
                    }
                }
                else if (header === 'oof') {
                    // deleting the message
                    rowId = sowKeyMap[message.header.sowKey()];

                    if (rowId) {
                        var index = indexByRowId(rowId);
                        delete sowKeyMap[message.header.sowKey()];
                        data.splice(index, 1);
                        self.postMessage({oof: message.data, rowIndex: index, reason: message.header.reason()});
                    }
                }
            });
        })
        .catch(function(err) {
            self.postMessage({error: {message: err.message}});
        });
}, false);


// Simple binary search for row index
function indexByRowId(rowId) {
    if (!data) { return -1; }
    
    var start = 0;
    var end = data.length;
    var mid;

    while (start < end) {
        mid = Math.floor((start + end) / 2);

        if (data[mid].rowId < rowId) {
            start = mid + 1;
        }
        else if (data[mid].rowId > rowId) {
            end = mid;
        }
        else {
            return mid;
        }
    }

    return -1;
}
