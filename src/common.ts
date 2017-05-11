export function extend(s:any, d:any, ig?:any){
    if (d){
        for(var i in d){
            if (!ig || !ig[i]){
                s[i] = d[i];
            }
        }
    }
}

export function find(target:any[], field:string, val:any){
    if (!target || !field){
        return;
    }
    return all(target, function(item:any, i:number){
        if (item[field] == val){
            return true;
        }
    });
}

export function all(target:any, callback:Function, prepare?:Function){
    let rlt:any = null;
    if (callback){
        if (target === undefined || target === null){
            if (prepare){
                prepare();
            }
            return rlt;
        }
        if (target instanceof Array){
            if (prepare){
                prepare(true);
            }
            for(let i=0;i<target.length;i++){
                if (callback(target[i], i)){
                    rlt = target[i];
                    break;
                }
            }
        }else{
            if (prepare){
                prepare(false);
            }
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
function uid(prefix?:string):string{
    if (!prefix){
        prefix = '$u$';
    }
    let d = new Date();
    let s = `${prefix}-${d.getHours()}${d.getMinutes()}${d.getSeconds()}${d.getMilliseconds()}${Math.floor(Math.random() * 100)}-${d.getFullYear()}${d.getMonth()}${d.getDate()}`;
    return s;
}
export function clone(target:any, id?:string){
    let KEY = "$cloneid$";
    id = id || uid('$cl$');
    if (target === undefined || target === null || typeof(target) != 'object'){
        return target;
    }
    let rlt:any = target;
    if (target[KEY] && target[KEY] == id){
        return target;
    }
    all(target, function(item, i){
        rlt[i] = clone(item, id);
    }, function(array:boolean){
        if (array){
            rlt = [];
        }else{
            rlt = {};
        }
        target[KEY] = id;
    });
    return rlt;
}
export function join(target:any, field?:string){
    let rlt = '';
    all(target, function(item, i){
        rlt += field? item[field]:item;
    });
    return rlt;
}

export function add(target:{length:number}, item:any):any{
    if (!target){
        return [item];
    }
    if (target.length === undefined){
        return [target, item];
    }
    target[target.length] = item;
    return target;
}
