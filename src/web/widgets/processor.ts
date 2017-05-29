import {all, starts} from '../../common';
import {WidgetElement, Widget} from "./widget";
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
    // alias
    p.setscope(json);
    p.prepareAttrs();
    // all(json, (item:any, i:string, o:any)=>{
    //     p.process(item, i);
    // });
    if (Widget.has(rlt.tagName)){
        Widget.use(rlt);
    }

    if (rlt.childNodes.length > 0){
        all(rlt.childNodes, (it:Node, i:number)=>{
            if (it instanceof Element){
                let el = <Element>it;
                let cjson = json;
                let cscope = el.getAttribute('scope');
                if (cscope){
                    cjson = json[cscope] || {};
                }
                PrepareElement.call(el, cjson, rlt);
            }
        });
    }
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
    }
    prepareAttrs(){
        let self = <any>this.target;
        let parent = self.cs.parent;
        let attrs = self.attributes;
        all(attrs, (at:Attr, i:number)=>{
            console.log(at.name);
            if (at.name == 'alias'){
                if (parent){
                    let u = <any>parent.cs.childunit;
                    u[`$${at.value}`] = self;
                }else{
                    // Root element with alias
                }
            }else if (starts(at.name, 'if')){
                let fname = at.name.substr(2);
                let scope = self.scope('on');
                if (scope && scope[fname]){
                    self[`on${fname}`] = scope[fname];
                }
            }
        });
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
    setscope(json:any){
        let t = this.target;
        t.scope = function(name?:string){
            if (!name){            
                return json;
            }
            return json[name];
        }
    }
    // process(item:any, i:string){
    //     let target = <any>this.target;
    //     if (i == '$'){

    //     }else if (starts(i,'$')){
    //         target[i] = item;
    //     }else{
    //         target.setAttribute(i, item);
    //     }
    //     return this;
    // }
}
