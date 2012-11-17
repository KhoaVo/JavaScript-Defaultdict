var defaultdict = function(def) {
    var dict = function(key) {
        if (key in dict)
            return dict[key];
        if (typeof def === "function"){
            dict[key] = def(key);
            return dict[key];
        }
            
        dict[key] = def;
        return def;
    };
    
    dict.toObject = function(){
        var ret = {},cur;
        for(var key in dict){
            if(key !== "toObject"){
                cur = dict[key];
                if(cur.toObject)
                    cur = cur.toObject();
                
                ret[key] = cur;
            }
        }
        
        return ret;
    }
        
    return dict;
}
if(typeof module !== "undefined" && module.exports)    
	module.exports = defaultdict;
	
if ( typeof define === "function" && define.amd) {
	define( "defaultdict", [], function () { return defaultdict; } );
}
