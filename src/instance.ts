export class Instance{
    private static workers:any = {};
    target:any;
    constructor(target:any){
        this.target = target;
        let self = <any>this;
        for(let i in Instance.workers){
            self[i] = function(...args:any[]){
                if (target.length !== undefined){
                    for(let j in target){
                        let item = target[j];
                        try{
                            Instance.workers[i].apply(item, args);
                        }catch(e){
                            console.warn(e);
                            debugger;
                        }
                    }
                }else{
                    Instance.workers[i].apply(target, args);
                }
                return self;
            }
        }
    }
    static regist(name:string, worker:Function){
        if (name && worker){
            Instance.workers[name] = worker;
        }
    }
}