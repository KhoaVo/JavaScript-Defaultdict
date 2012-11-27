var findDefaultDicts = function(obj){
    var res = {},count = 0;
    
    for(var k in obj){
        if(obj[k].toObject){
            res[k] = 1;
            count++;
        }
    }
    if(count)
        return res;
    else
        return null;
}

var defaultdict = function(def) {
    var val,testVal,d
    if(typeof def === 'function'){
        testVal = def('__defaultdict__');
        if(testVal === Object(testVal) && !Array.isArray(testVal)){
            d = findDefaultDicts(testVal);
            if(d){
                val = function(key){
                    var v = def(key);
                    v.__dicts = d;
                    return v;
                }
            }else
                val = def;
        }else{
            val = def;
        }
    }
    else
        val = function(){return def;};
    
    var dict = function(key) {
        if (key in dict)
            return dict[key];
            
        dict[key] = val(key);
        return dict[key];
    };
    
    dict.toObject = function(){
        var ret = {},cur,k2,temp;
        var toObject = dict.toObject;
        var dicts = dict.__dicts;
        
        delete dict.toObject;
        delete dict.__dicts;
        
        for(var key in dict){
            cur = dict[key];
            if(cur.toObject)
                cur = cur.toObject();
            else if (cur.__dicts){
                temp = {};
                for(k2 in cur)
                    temp[k2] = cur[k2];
                
                for(k2 in cur.__dicts){
                    temp[k2] = cur[k2].toObject();
                }

                delete temp.__dicts;
                cur = temp;
            }
            ret[key] = cur;
        }
        
        dict.toObject = toObject;
        dict.__dicts = dicts;
        
        return ret;
    }
        
    return dict;
}
if(typeof module !== "undefined" && module.exports)    
	module.exports = defaultdict;
	
if ( typeof define === "function" && define.amd) {
	define( "defaultdict", [], function () { return defaultdict; } );
}
