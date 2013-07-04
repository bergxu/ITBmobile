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

};