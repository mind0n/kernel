export function extend(s:any, d:any, ig?:any){
    if (d){
        for(var i in d){
            if (!ig || !ig[i]){
                s[i] = d[i];
            }
        }
    }
}

export function each(target:any, callback:Function){
    if (callback){
        if (target instanceof Array){
            for(let i=0;i<target.length;i++){
                if (callback(target[i], i)){
                    break;
                }
            }
        }else{
            for(let i in target){
                if (callback(target[i], i)){
                    break;
                }
            }
        }
    }
}