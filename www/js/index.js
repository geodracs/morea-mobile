var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        navigator.geolocation.getCurrentPosition(this.geolocationSuccess,[geolocationError],[geolocationOptions]);
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    geolocationSuccess: function (arg) {
        // body...
        console.log(arg);
        
    }
};

app.initialize();


var myCart = morea({
    storageKey: "test12", // Required
    productUrl: "http://54.186.190.118/users/async/get_product_info?id=[:id]", // Required
    searchURL: "http://54.186.190.118/users/async/get_products?q=[:q]", // TODO
    loginUrl: "http://54.186.190.118/api/auth/login",
    appID: "231"
});

