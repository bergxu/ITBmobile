itbmobile.storage = {

    store: window.localStorage,
    
    put: function(key, obj) {
        if (this.store) {
            this.store.setItem(key, JSON.stringify(obj));
        }
    },
    
    get: function(key) {
        if (this.store) {
            return JSON.parse(this.store.getItem(key));
        }
        return null;
    }

    GUID: function() {
        var S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }
};
