import {all, starts, add} from '../../common';
import {WidgetElement, WidgetScope} from './widget';
import {PrepareElement} from './processor';
import {Cursor} from "./cursor";
function d(v:any){
    console.log(v);
    debugger;
}
export class Action{
    protected actions:any[] = [];
    protected onetimes:any[] = [];
    protected static filters:any = {
            $ui:function(v:any){
                this.render();
            }
            ,$once:function(v:any, arg:any){
                console.log(this);
            }
            ,d:d    // normal breakpoint
            ,$d:d   // post breakpoint
            ,_d:d   // early breakpoint
        };
    static check(target:WidgetElement){
        return new Action(target);
    }
    static parse(script:string, handler?:Function, long?:boolean):any{
        let filter:string = undefined;
        let n = script.indexOf('~');
        if (n > 0){
            filter = script.substr(0, n);
            script = script.substr(n + 1, script.length - n - 1);
        }
        let f = new Function('self', 'unit', 'arg', `
            ${long?script:'return ' + script};
        `);
        let filters:any = null;
        if (filter){
            filters = filter.split(',');
        }
        let earlyfilter = function(scope:WidgetScope, self:WidgetElement, arg:any){
            all(filters, (it:string, i:number)=>{
                if (starts(it,'_')){
                    let func = scope.$filters[it] || Action.filters[it];
                    if (func){
                        console.log(`Filter ${it} triggered.`);
                        func.call(self, arg);
                    }
                }
            });
        };
        let runfilter = function(scope:WidgetScope, self:WidgetElement, v:any, arg:any){
            all(filters, (it:string, i:number)=>{
                if (starts(it, '$') || starts(it,'_')){
                    return;
                }
                let func = scope.$filters[it] || Action.filters[it];
                if (func){
                    console.log(`Filter ${it} triggered.`);
                    let r = func.call(self, v, arg);
                    if (r !== undefined){
                        v = r;
                    }
                }
            });
            return v;
        };
        let runpostfilter = function(scope:WidgetScope, self:WidgetElement, v:any, arg:any){
            all(filters, (it:string, i:number)=>{
                if (starts(it, '$')){
                    let func = scope.$filters[it] || Action.filters[it];
                    if (func){
                        console.log(`Filter ${it} triggered.`);
                        func.call(self, v, arg);
                    }
                }
            });
        };
        let rlt = function(self:WidgetElement, unit:Function, arg:any){
            earlyfilter(this, self, arg);
            let r = f.call(this, self, function(name?:string){
                return self.unit(name);
            }, arg);
            r = runfilter(this, self, r, arg);
            if (handler){
                handler.call(self, r, arg);
            }
            runpostfilter(this, self, r, arg);
            return r;
        }
        if (filter && filter.indexOf('$once') == 0){
            return {
                action:rlt
                ,once:true
            }
        }
        return {action:rlt};
    }
    constructor(private target:WidgetElement){
        if (!target.actions){
            target.actions = this;
        }
    }
    run(){
        all(this.onetimes, (action:ActionItem, i:number)=>{
            action.func.call(action.scope.call(action.target), action.target, action.unit, action.arg);
        });
        this.onetimes = [];
        all(this.actions, (action:ActionItem, i:number)=>{
            action.func.call(action.scope.call(action.target), action.target, action.unit, action.arg);
        });
    }
    register(script:string, handler:Function, arg?:any, long?:boolean){
        //console.log(script, this.target, this.target.scope());
        let r = Action.parse(script, handler, long);
        let f = r.action;
        let target = this.target;
        if (r.once){
            add(this.onetimes, {
                func:f
                , arg:arg
                , target:target
                , scope:target.scope
                , unit:(name?:string)=>target.unit(name)
            });
        }else{
            add(this.actions, {
                func:f
                , arg:arg
                , target:target
                , scope:target.scope
                , unit:(name?:string)=>target.unit(name)
            });
        }
    }
}
class ActionItem{
    func:Function;
    arg:any;
    filter:string;
    handler:Function;
    target:WidgetElement;
    scope:Function;
    unit:Function;
}