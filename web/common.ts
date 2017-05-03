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
    let rlt:any = null;
    if (callback){
        if (target instanceof Array){
            for(let i=0;i<target.length;i++){
                if (callback(target[i], i)){
                    rlt = target[i];
                    break;
                }
            }
        }else{
            for(let i in target){
                if (callback(target[i], i)){
                    rlt = target[i];
                    break;
                }
            }
        }
    }
    return rlt;
}

export function join(target:any, field?:string){
    let rlt = '';
    each(target, function(item, i){
        rlt += field? item[field]:item;
    });
    return rlt;
}