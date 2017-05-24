
export function starts(target:string, prefix:any){
    if (target !== undefined && target !== null && prefix != undefined){
        return false;
    }
    if (!(prefix instanceof Array)){
        prefix = [prefix];
    }
    let rlt = false;
    all(prefix, (item:any, i:any)=>{
        if (target.indexOf(item) == 0){
            rlt = true;
            return true;
        }
    }); 
    return  rlt;
}

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
        if (target instanceof Array || target.length !== undefined){
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

export function uid(prefix?:string):string{
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
    all(target, function(item:any, i:any){
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
    all(target, function(item:any, i:any){
        rlt += field? item[field]:item;
    });
    return rlt;
}

export function clear(target:{pop:Function, length:number}){
    if (target){
        while(target.length > 0){
            target.pop();
        }
    }
    return target;
}

export function unique(target:any, item:any, comp?:Function){
    if (!comp){
        comp = (a:any, b:any)=>{
            return a == b;
        };
    }
    let rlt = true;
    all(target, (it:any, i:any)=>{
        rlt = false;
        return comp(it, item);
    });
    return rlt;
}
export function add(target:any, item:any, isunique?:any):any{
    if (!isunique){
        isunique = (a:any, b:any)=>{
            return true;
        }
    }else if (isunique === true){
        isunique = unique;
    }
    if (!target){
        return [item];
    }
    if (target.length === undefined && isunique(target, item)){
        return [target, item];
    }
    if (isunique(target, item)){
        target[target.length] = item;
    }
    return target;
}

export function addrange(target:any[], items:any[]){
    for(let i=0; i<items.length; i++){
        let item = items[i];
        add(target, item);
    }
}
