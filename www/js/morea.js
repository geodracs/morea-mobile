

var moreaStorage = function(config){

    return {
        storageKey: config.storageKey,
        store: function(items){
            console.log("Saving in the LocalStorage");
            localStorage.setItem(this.key, JSON.stringify(items));
        },
        reset: function(){
            console.log("Deleting localStorage");
            localStorage.setItem(this.key, "");
        },
        get: function(){
            console.log("Retrieve all items in localStorage")
            var items = localStorage.getItem(this.key);
            try {
                var obj = JSON.parse(items);
            }catch(err) {
                var obj = null;
                console.log("I cant do it");
                console.log(err);
            }
            return obj;
        }
    }
};


var moreaAPI = function (config){

    return {
        searchUrl: config.searchURL,
        productUrl: config.productUrl,
        container: config.container,
        loginUrl: config.loginUrl,
        categoryUrl: config.categoryUrl,
        appID: config.appID,
        cartSyncUrl: config.cartSync,
        token: "",

        search: function(q,p){
            document.addEventListener("onSearch",onSearchComplete,false);
            var xmlhttp = new XMLHttpRequest();
            var url = this.searchUrl;
            url = url.replace("[:q]", q);
            url = url.replace("[:p]", p);
            var evt = document.createEvent("Event");
            evt.initEvent('onSearch', true, true);
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    var obj = JSON.parse(xmlhttp.responseText);
                    evt.data = obj;
                    console.log("Productos descargados. Enviando por evento..");
                    document.dispatchEvent(evt);
                }
            }
            xmlhttp.open("GET",url,true);
            xmlhttp.send();
        },
        categorySearch: function(id,p){
            document.addEventListener("onSearch",onSearchComplete,false);
            var xmlhttp = new XMLHttpRequest();
            var url = this.categoryUrl;
            url = url.replace("[:id]", id);
            url = url.replace("[:p]", p);

            var evt = document.createEvent("Event");
            evt.initEvent('onSearch', true, true);
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    var obj = JSON.parse(xmlhttp.responseText);
                    evt.data = obj;
                    console.log("Productos descargados. Enviando por evento..");
                    document.dispatchEvent(evt);
                }
            }
            xmlhttp.open("GET",url,true);
            xmlhttp.send();
        },
        login: function(e){
            var postData = $(e).serialize() + "&app_id=" + this.appID;
            console.log(postData);

            document.addEventListener("onLogin",onLoginComplete,false);
            document.addEventListener("onLoginFail",onLoginFail,false);
            var evt = document.createEvent("Event");
            var evt2 = document.createEvent("Event");
            evt.initEvent('onLogin', true, true);
            evt2.initEvent('onLoginFail', true, true);
            var self = this;
            $.post(this.loginUrl, postData, function(res){
                console.log("Respuesta al login... desde la api");
                console.log(res);
                if (res.status) {
                    self.token = res.token;
                    document.dispatchEvent(evt);

                }else{
                    document.dispatchEvent(evt2);

                }
            })
        },
        register: function(e){
            // TODO register
            var postData = $(e).serialize() + "&app_id=" + this.appID;
            console.log(postData);

            document.addEventListener("onRegister",onRegisterComplete,false);
            document.addEventListener("onRegisterFail",onRegisterFail,false);
            var evt = document.createEvent("Event");
            var evt2 = document.createEvent("Event");
            evt.initEvent('onRegister', true, true);
            evt2.initEvent('onRegisterFail', true, true);
            var self = this;
            $.post(this.loginUrl, postData, function(res){
                console.log("Respuesta al login... desde la api");
                console.log(res);
                if (res.status) {
                    self.token = res.token;
                    document.dispatchEvent(evt);

                }else{
                    document.dispatchEvent(evt2);

                }
            })
        },
        getUserToken: function(){

            return this.token;
        },
        sync: function(itemList){
            // TODO return the last version of cartItems
            // return event onCartSync
            $.post(this.cartSyncUrl,{items:JSON.stringify(itemList)},function(res){
                console.log(res);
            });
        },
        getProduct: function(itemObj){
            // return object downloaded
            document.addEventListener("onProductDownload",onProductDownload,false);
            var xmlhttp = new XMLHttpRequest();
            var url = this.productUrl;
            url = url.replace("[:id]", itemObj.id);
            var evt = document.createEvent("Event");
            evt.initEvent('onProductDownload', true, true);
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    var obj = JSON.parse(xmlhttp.responseText);
                    evt.data = obj;
                    evt.item = itemObj;
                    // TODO can I pass obj directly to itemObj?



                    console.log("Productos descargados. Enviando por evento..");
                    document.dispatchEvent(evt);
                }
            }
            xmlhttp.open("GET",url,true);
            xmlhttp.send();
        }
    }

};


/* Building alternative */
var moreaCart = function(config){


    return {

        itemList: [],
        lastItem: 0,

        items : function(callback){
            console.log("Calling all items");
            for (var i = 0; i<this.lastItem; i++){
                callback(this.itemList[i]);
            }

        },
        getById: function(id){
            console.log("Get item by ID: "+id);
            var itemNum = -1;
            var i = 0;
            var found = false;
            while (i < this.lastItem && !found){
                if (this.itemList[i].id == id){
                    found = true;
                    itemNum = i;
                }
                i++;
            }
            return itemNum;
        },
        add: function(id){
            //TODO dispatch event onProductAdd
            var index = -1;

            var itemIndex = this.getById(id);
            if (itemIndex == -1){
                console.log("Adding product...");
                this.itemList[this.lastItem] = new moreaItem({id:id});
                index = this.lastItem;
                this.lastItem++;
            }else{




                console.log("The product exist, adding + 1");
                // TODO Better way
                this.itemList[itemIndex].amount++;
                onProductIncrease();

            }
            return index;

        },
        getTotalPrice: function(){
            var price = 0.0;

            this.items(function(item){
                price += item.price * item.amount;
            });
            return price;
        },
        increaseAmount: function(id){
            var item = this.getById(id);
            item.amount++;
        },
        decreaseAmount: function(id){
            var item = this.getById(id);
            item.amount--;
        },
        remove: function(prod_id){
            console.log("Remove from itemList: "+prod_id);
            var index = this.getById(prod_id);
            if (index > -1) {
                console.log("Removed");
                this.itemList.splice(index, 1);
                this.lastItem--;

            }
        }


    }

};


// MoreaItem is the minimun propertios of item object to work
var moreaItem = function(obj){
    return {
        id: obj.id,
        amount: 1
    }
}


var morea = function(config){

    return {

        cart: new moreaCart(config),
        storage: new moreaStorage(config),
        api: new moreaAPI(config),
        store: function(){
            this.storage.store(this.cart.itemList);
        },
        add: function (id) {
            // Download Item
            var index = this.cart.add(id);
            if (index != -1){
                // Download Object data
                console.log("Downloading product info...");
                this.api.getProduct(this.cart.itemList[index]);
                return true;
            }else{
                return false;
            }
        },
        reset: function(){
            this.storage.reset();
            this.cart.lastIndex = 0;
        },
        recover: function(){

            // TODO error handle when empty ?
            var itemsObj = this.storage.get();
            if (itemsObj) {
                for (var i = 0; i < itemsObj.length; i++) {
                    this.cart.itemList[i] = itemsObj[i];
                    console.log(itemsObj[i]);
                    this.cart.lastItem++;
                }
            }

        },
        remove: function(item_id){
            this.cart.remove(item_id);
            this.store();
        },
        sync: function(){
            this.api.sync(this.cart.itemList);
        }

    }

};




