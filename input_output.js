(function(ext) {
    var currentInput = '';

    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    ext.getInput = function(query, callback) {
        checkForInputs(query).then(
            function() {
                callback();
            },
            function() {
                callback();
            }   
        );
    };

    ext.currentInput = function() {
        return currentInput;
    };

    ext.sendToOutput = function(query, callback) {
        checkForInputs(query).then(
            function() {
                callback();
            },
            function() {
                callback();
            }   
        );
    };

    function checkForInputs(query) {

        return new Promise(function (resolve, reject) {

            if (query == '') {
                resolve();
                return;
            }

            $.ajax({
                url: 'https://y1h3v2tztb.execute-api.eu-west-2.amazonaws.com/Prod',
                data: {
                    TokenType: query
                },
                success: function (response) {

                    // fail if there are no results for this input
                    if (!response || response.length === 0) {
                        reject();
                        return;
                    }

                    getAndDequeueInput(response, resolve, reject);

                },
                error: function(error) {
                    // if the error is a 401 (unauthorized), the token probably has expired,
                    // so request a new one. 
                    if (error.status == 401) {
                        getAccessToken().then((token) => {
                            spotifyToken = token;
                            reject();
                        });
                    }
                }
            });
        });
    };

    function getAndDequeueInput(response, resolve, reject) {

        return new Promise(function (resolve, reject) {
            var handledOne = false;
            for (var i=0; i<response.length; i++) {
                var requestBody = { Id: response[i].Id, HandledBy: 'Scratch' }
                $.ajax({
                    url: 'https://y1h3v2tztb.execute-api.eu-west-2.amazonaws.com/Prod',
                    type: 'DELETE',
                    data: JSON.stringify(requestBody),
                    contentType:'application/json',
                    success: function(response) {
                        currentInput = response[i].Content;
                        resolve();
                        return;
                    },
                    error: function(error) {
                        // if the error is a 404 (not found), that means the item we tried
                        // to dequeue has aleady been dequeued, and we should try another one.
                        if (error.status == 404) {
                            continue;
                        } else {
                            // Any other error is a failure.
                            reject();
                            return;
                        }
                    }
                });
            }

            // If we get here, none of the tokens found were still there when we searched them
            // Not really an error, let's just exit without setting anything.
            resolve();
        });
    }

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            ['w', 'get input %s', 'getInput', ''],
            ['r', 'input', 'currentInput'],
            ['w', 'send to output %s', 'sendToOutput', ''],
        ],
        url: 'https://ridiculousprescription.github.io/'
    };

    // Register the extension
    ScratchExtensions.register('Inputs and outputs', descriptor, ext);
})({});