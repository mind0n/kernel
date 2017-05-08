import {add} from "../common";
import {Instance} from "../instance";
export function w(input:any){
    let t = typeof(input);
    if (t == 'function'){
        Starter.startonce(input);
        return;
    }
    return new Instance(input);
}

export class Starter{
    private static oncestarts:Function[] = [];
    private static starts:Function[] = [];
    private static domready:boolean;
    private static dominteractive:boolean;
    static prepare(){
        document.onreadystatechange = function(event){
            if (document.readyState == 'interactive'){
                Starter.domready = true;
                Starter.start();
                Starter.startonce();
            }
            // else if (document.readyState == 'complete'){
            //     Starter.domready = true;
            //     Starter.start();
            //     Starter.startonce();
            // }
        }
    }
    static startonce(callback?:Function){
        Starter.startwith(Starter.starts);
        Starter.startwith(Starter.oncestarts, callback);
        Starter.oncestarts = [];
    }
    static start(callback?:Function){
        Starter.startwith(Starter.starts, callback);
        Starter.startwith(Starter.oncestarts);
        Starter.oncestarts = [];
    }
    private static startwith(q:Function[], callback?:Function){
        if (callback){
            add(q, callback);
        }
        if (Starter.domready){
            let list = q;
            for(let i of list){
                i();
            }
        }
    }
}