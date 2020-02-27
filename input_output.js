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
        currentInput = '';
        checkForInputs(query).then(() => {
            callback();
        }).catch(() => {
            alert('An error occurred getting the input');
            callback();
        });
    };

    ext.currentInput = function() {
        return currentInput;
    };

    ext.sendToOutput = function(query, callback) {
        checkForInputs(query).then(() => {
            callback();
        }).catch(() => {
            alert('An error occurred sending to output');
            callback();
        });
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
                    // If there are no results for this input, just exit with the current input at empty
                    if (!response || response.length === 0) {
                        resolve();
                        return;
                    }

                    getAndDequeueInput(response).then(() => {
                        resolve();
                    });
                },
                error: function (error) {
                    alert('An error occurred checking for inputs: ' + error);
                    reject();
                }
            });
        });
    };

    function getAndDequeueInput(response) {

        return new Promise(function (resolve, reject) {
            if (!response || response.length === 0) {
                resolve();
                return;
            }

            var responseContent = response[0].Content;

            var requestBody = { Id: response[0].Id, HandledBy: 'Scratch' }
            $.ajax({
                url: 'https://y1h3v2tztb.execute-api.eu-west-2.amazonaws.com/Prod',
                type: 'DELETE',
                data: JSON.stringify(requestBody),
                contentType:'application/json',
                success: function(response) {
                    currentInput = responseContent;
                    resolve();
                },
                error: function(error) {
                    // if the error is a 404 (not found), that means the item we tried
                    // to dequeue has aleady been dequeued, and we should try another one.
                    if (error.status == 404) {
                        // Remove the first entry
                        response = response.slice(1);
                        getAndDequeueInput(response).then(() => {
                            resolve();
                        });
                    } else {
                        // Any other error is a failure.
                        alert('An error occurred getting and dequeueing: ' + error);
                        reject();
                    }
                }
            });
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