(function(ext) {
    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    ext.get_temp = function(location, callback) {
		alert('Fish pie');
        // Make an AJAX call to the Open Weather Maps API
        $.ajax({
              url: 'https://en.wikipedia.org/w/api.php?action=query&titles='+location+'&prop=pageviews&pvipdays=1',
              dataType: 'jsonp',
              success: function( weather_data ) {
                  // Got the data - parse it and return the temperature
                  count = weather_data['query']['pages'];
                  alert(count);
              },
			  error: function() {
				  alert('An error occurred'");
			  }
        });
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