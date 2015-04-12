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
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    },
    geolocationSuccess: function (arg) {
        // body...
        console.log(arg);
        
    }
};

app.initialize();


var FULL_URL = "http://yune.es/";


var myCart = morea({
    storageKey: "test12", // Required
    productUrl: FULL_URL+ "users/async/get_product_info?id=[:id]", // Required
    searchURL: FULL_URL+"api/product/search/[:q]/[:p]", // TODO
    categoryUrl: FULL_URL+"api/product/category/[:id]/[:p]",
    cartSync: FULL_URL+"api/cart/sync",
    appID: "231",
    loginUrl: FULL_URL+"api/auth/login"

});

myCart.recover();

myCart.api.search("all",0);

function onSearchComplete(res){
    console.log("onSearchComplete Executed");
    console.log(res);
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
        html += '<i class="mdi-action-add-shopping-cart"></i> Comprar';
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



// This way the user can create custom objects
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




function updateCart(){
    $('#cant-art-mod').html(myCart.cart.lastItem);
}



function onProductIncrease(){
}


var show = false;
function getItems(){
    show = !show;

    console.log("Intentando rellenar la lista");
    var html = "";
    if (show) {

        myCart.cart.items(function (response) {
            html += "<div style='overflow: hidden;height: auto !important;padding: 5px;'>";
            html += '<img style="height:50px;width:50px;float:left;" src="' + response.img + '">';
            html += '<div style="float:left;font-size:15pt;padding: 10px">' + response.name + '('+response.amount+')</div>';
            html += '<button class="waves-effect waves-teal btn-flat" style="float:right;font-size: 8pt;padding: 4px;margin: 0"> Eliminar </button>';
            html += "</div>";
        });
        var total = myCart.cart.getTotalPrice();
        html += '<div  style="height: auto !important;overflow: hidden;padding: 10px;border-top: 1px silver dashed">' +
        '<button  onclick="load(&#39views/orderCart.html&#39);getItems()" class="btn waves-effect waves-light" style="float: left">Pagar ahora</button>' +
        '<div style="float: right;font-size: 20pt;font-weight: bold">'+total+'€</div></div>';
        document.getElementById('MyCart_list').style.display = "block";
        document.getElementById('MyCart_list').innerHTML = html;
        console.log(myCart.cart.getTotalPrice());
    }else{
        document.getElementById('MyCart_list').style.display = "none";
    }
}

