import {all, starts, add} from '../../common';
import {WidgetElement} from './widget';
import {PrepareElement} from './processor';
import {Cursor} from "./cursor";

export class Action{
    protected actions:any[] = [];
    static check(target:WidgetElement){
        return new Action(target);
    }
    constructor(private target:WidgetElement){
        let s = target.scope();
        if (!s.$actions){
            s.$actions = this;
        }
    }
    run(){
        let self = this.target;
        all(this.actions, (item:ActionItem, i:number)=>{
            try{
                let v = item.func.call(self.scope(), self, self.unit, console, item.arg);
                item.handler.call(self, v, item.arg);
            }catch(e){
                console.error(e);
            }
        });

    }
    register(script:string, handler:Function, arg?:any, long?:boolean){
        let f = new Function('self', 'unit', 'console', 'arg', `
            ${long?script:'return ' + script};
        `);
        add(this.actions, {
            func:f
            ,arg:arg
            ,handler:handler
        });
    }
}
class ActionItem{
    func:Function;
    arg:any;
    handler:Function;
}