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
myCart.recover();

myCart.api.search("");

function onSearchComplete(res){

    var obj = res.data;
    var html = "";
    for (var i = 0; i < obj.length; i++) {

        html += '<div class="product">';
        html += '<div class="image">';
        html += '<img style="width:100%" src="'+obj[i].img+'">';
        html += '</div>';
        html += '<div class="txtMed" style="">';
        html += '<div style="padding-top: 10px;position: absolute;margin-top:-50px;text-align: center;margin-left: 5px;">';
        html += '</div>';
        html += '<div class="descMed">';
        html += '<div style="font-weight: bold">'+obj[i].name+'</div>';
        html += '<div style="color: gray">';
        html += '<button style="opacity:0.7;" type="button" class="btn btn-xs btn-default" onclick="myCart.add(' + obj[i].id_pro + ')" data-pid="2" class="addToCart">';
        html += '<span class="glyphicon glyphicon-shopping-cart"></span> Comprar';
        html += '</button>';
        html += '</div>';
        html += '</div>';
        html += '<div class="precMed">';
        html += '<div>'+obj[i].price+'&euro;</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';

    }


    document.getElementById("products_container").innerHTML = html;

}

function onProductDownload(res){
    console.log("PRODUCTO DESCARGADO" + res);
    console.log(res);
    res.item.name = res.data.name;
    res.item.img = res.data.img;
    res.item.description = res.data.description;
    res.item.price = res.data.price;
    res.item.category_id = res.data.category_id;

    myCart.store();

}


function getItems(){

    console.log("Intentando rellenar la lista");
    var html = "";
    myCart.cart.items(function (response) {
        html += "<div>";
        html += '<img style="height:50px;" src="'+response.img+'">';
        html += '<p>' +response.name+'</p>';
        html += '<div> x' +response.amount+'</div>';
        html += "</div>";
    });
    document.getElementById('MyCart_list').style.display = "block";
    document.getElementById('MyCart_list').innerHTML = html;
    console.log(myCart.cart.getTotalPrice());
}