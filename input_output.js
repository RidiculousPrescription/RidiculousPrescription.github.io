(function(ext) {
    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    ext.get_temp = function(location, callback) {
        // Make an AJAX call to the Open Weather Maps API
        // $.ajax({
        //       url: 'https://y1h3v2tztb.execute-api.eu-west-2.amazonaws.com/Prod',
        //       success: function(response) {
		// 			for (var i = 0; i < response.length; i++) {
		// 				alert(response[i].Id);
		// 			}
        //       },
		// 	  error: function() {
		// 		  alert('An error occurred');
		// 	  }
        // });
    };

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            ['R', 'page views for page %s', 'get_temp', 'Rwanda'],
        ]
    };

    // Register the extension
    ScratchExtensions.register('Weather extension', descriptor, ext);
})({});