import {all, starts, add} from '../../common';
import {WidgetElement} from './widget';
import {PrepareElement} from './processor';
import {Cursor} from "./cursor";

export class Action{
    protected actions:any[] = [];
    protected filters:any = {};
    static check(target:WidgetElement){
        return new Action(target);
    }
    constructor(private target:WidgetElement){
        if (!target.actions){
            target.actions = this;
        }
        this.filters = {
            ui:function(v:any){
                target.render();
            },d:function(v:any){
                console.log(v);
                debugger;
            }
        }
    }
    run(){
        let self = this.target;
        let action = this;
        all(this.actions, (item:ActionItem, i:number)=>{
            try{
                let scope = self.scope();
                let v = item.func.call(scope, self, self.unit, console, item.arg);
                let filters:any = null;
                if (item.filter){
                    filters = item.filter.split(',');
                    all(filters, (it:string, i:number)=>{
                        let func = scope.$filters[it];
                        if (func){
                            console.log(`Filter ${it} triggered.`);
                            let r = func.call(self, v, item.arg);
                            if (r !== undefined){
                                v = r;
                            }
                        }
                    });
                }
                item.handler.call(self, v, item.arg);
                if (filters){
                    all(filters, (it:string, i:number)=>{
                        let func = action.filters[it];
                        if (func){
                            console.log(`Post filter ${it} triggered.`);
                            let r = func.call(self, v, item.arg);
                            if (r !== undefined){
                                v = r;
                            }
                        }
                    });
                }                
            }catch(e){
                console.error(e);
            }
        });
    }
    register(script:string, handler:Function, arg?:any, long?:boolean){
        let filter:string = undefined;
        let n = script.indexOf('~');
        if (n > 0){
            filter = script.substr(0, n);
            script = script.substr(n + 1, script.length - n - 1);
        }
        let f = new Function('self', 'unit', 'console', 'arg', `
            ${long?script:'return ' + script};
        `);
        add(this.actions, {
            func:f
            ,arg:arg
            ,filter:filter
            ,handler:handler
        });
    }
}
class ActionItem{
    func:Function;
    arg:any;
    filter:string;
    handler:Function;
}