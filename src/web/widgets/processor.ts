import {all, starts, add} from '../../common';
import {WidgetElement, Widget, WidgetScope} from "./widget";
import {Action} from './action';
import {Cursor} from "./cursor";

export function PrepareElement(json?:any, parent?:WidgetElement):WidgetElement{
    let rlt = <WidgetElement>this;
    if (json instanceof Array){
        json = {$:json};
    }
    // WidgetElement functions
    let p = new ElementProcessor(rlt);
    // Establish relationships
    if (parent){
        p.setparent(parent);
    }
    // Child scope
    let sc = rlt.getAttribute('scope');
    p.setscope(json, sc);

    Action.check(rlt);
    p.prepareAttrs();

    if (Widget.has(rlt.tagName)){
        // Initialize widget
        Widget.use(rlt);
    }

    if (rlt.childNodes.length > 0){
        all(rlt.childNodes, (it:Node, i:number)=>{
            if (it instanceof Element){
                let el = <Element>it;
                let cjson = json;
                PrepareElement.call(el, cjson, rlt);
            }
        });
    }
    rlt.refresh();
    return rlt;
}

export class ElementProcessor{
    constructor(private target:WidgetElement, cs?:Cursor){
        Cursor.check(target);
        target.slots = {default:[]};
        target.unit = function(){
            return this.cs.unit;
        };
        target.root = function(){
            return this.cs.root;
        };
        target.detach = function(){
            let b = <any>document.body;
            if (!b.$detach$){
                b.$detach$ = document.createElement('div');
            }
            b.$detach$.appendChild(this);
            return this;
        };
        target.trigger = function(name:string, arg?:any){
            let scope = this.scope();
            if (!scope.on){
                scope.on = {};
            }
            scope = scope.on;
            if (scope[name] && typeof(scope[name]) == 'function'){
                let rlt = scope[name].call(this, arg);
                return rlt === undefined?arg:rlt;
            }
            return arg;
        };
        target.refresh = function(recursive?:boolean){
            let s = <WidgetScope>this.scope();
            let a = s.$actions;
            a.run();
            if (recursive){
                all(this.childNodes, (node:any, i:number)=>{
                    if (node instanceof Element){
                        let n = <WidgetElement>node;
                        n.refresh(recursive);
                    }
                })
            }            
        };
        target.act = function(script:string, handler:Function, long?:boolean){
            let self = <WidgetElement>this;
            let scope = self.scope();
            let act = scope.$actions;
            act.register(script, handler, long);
            //f.call(scope, self, self.unit, self.scope, console);
        }
    }
    prepareAttrs(){
        let self = <any>this.target;
        let parent = self.cs.parent;
        let attrs = self.attributes;
        all(attrs, (at:Attr, i:number)=>{
            if (at.name == 'alias'){
                this.setalias(at.value);
            }else if (starts(at.name, 'if')){
                let fname = at.name.substr(2);
                let scope = self.scope('on');
                if (scope && scope[fname]){
                    self[`on${fname}`] = scope[fname];
                }
            }else if (starts(at.name, ':')){
                self.act(at.value, function(v:any, arg:any){
                    this.setAttribute(arg, v);
                });
            }
        });
        return this;
    }
    setalias(alias:string){
        let self = <any>this.target;
        let parent = self.cs.parent;
        if (parent){
            let u = <any>parent.cs.childunit;
            u[`$${alias}`] = self;
        }else{
            // Root element with alias
        }
        return this;
    }
    setparent(par:WidgetElement){
        this.target.cs.parent = par;
        if (!par.cs.root){
            this.target.cs.root = par;
        }else{
            this.target.cs.root = par.cs.root;
        }
        this.target.cs.unit = par.cs.childunit;
        return this;
    }
    setscope(json:any, child?:string){
        let t = this.target;
        if (child){
            json = json[child] || {};
            this.setalias(child);
        }
        t.scope = function(name?:string){
            if (!name){            
                return json;
            }
            return json[name];
        }
    }

}
