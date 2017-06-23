import {all, between, inbetween, starts, add} from '../../common';
import {WidgetElement, Widget, WidgetScope, WidgetFactory} from "./widget";
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
    let factory:WidgetFactory = null;
    if (Widget.has(rlt.tagName)){
        // Initialize widget
        factory = Widget.use(rlt);
    }else{
        rlt.prepareChildren(json);
    }

    if (factory){
        rlt.trigger('link');
        factory.link(rlt);
        rlt.trigger('linked');
    }
    rlt.refresh();
    return rlt;
}

export class ElementProcessor{
    constructor(private target:WidgetElement, cs?:Cursor){
        Cursor.check(target);
        target.slots = {default:[]};
        target.unit = function(name?:string){
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
        target.appendto = function(el:WidgetElement){
            let self = <WidgetElement>this;
            if (el){
                el.appendChild(self);
                el.trigger('mounted', self);
            }
        }
        target.prepareChildren = function(json:any){
            let rlt = this;
            if (rlt.childNodes.length > 0){
                all(rlt.childNodes, (it:Node, i:number)=>{
                    if (it instanceof Element){
                        let el = <Element>it;
                        let cjson = json;
                        PrepareElement.call(el, cjson, rlt);
                    }
                });
            }
        };
        target.refresh = function(recursive?:boolean){
            let t = <any>this;
            if (t.onrefresh){
                t.onrefresh(t.scope());
            }
            let a = (<WidgetElement>this).actions;
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
        target.act = function(script:string, handler:Function, arg:any, long?:boolean){
            let self = <WidgetElement>this;
            let act = self.actions;
            act.register(script, handler, arg, long);
            //f.call(scope, self, self.unit, self.scope, console);
        };
        target.render = function(){
            let self = this;
            let s = <WidgetScope>self.scope();
            let f = s.$factory;
            let html = f.render(self);
            html = self.trigger('render', html);
            if (html !== undefined){
                self.innerHTML = html;
            }
            self.trigger('rendered', html);
            self.prepareChildren(s);
        };
    }
    prepareAttrs(){
        let self = <any>this.target;
        let parent = self.cs.parent;
        let attrs = self.attributes;
        all(attrs, (at:Attr, i:number)=>{
            if (at.name == 'alias'){
                this.setalias(at.value);
            }else if (starts(at.name, 'html')){
                self.act(at.value, function(v:any, arg:any){
                    console.log(v);
                    this.innerHTML = v === undefined?'':v;
                }, undefined);
            }else if (starts(at.name, 'if')){
                let fname = at.name.substr(2);
                let scope = self.scope('on');
                if (scope && scope[fname]){
                    self.addEventListener(fname, scope[fname]);
                }else{
                    let script = at.value;
                    let fun = Action.parse(script, null, true);
                    self[`on${fname}`] = function(event:Event){
                        fun.call(scope, self, self.unit, event);
                    };
                }
            }else if (starts(at.name, ':')){
                self.act(at.value, function(v:any, arg:any){
                    this[arg] = v;
                }, at.name.substr(1));
            }else if (between(at.value, '{', '}')){
                let script = inbetween(at.value);
                self.act(script, function(v:any, arg:any){
                    if (v){
                        this.setAttribute(arg, v);
                    }else{
                        this.removeAttribute(arg);
                    }
                }, at.name);
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
        t.scope = function(name?:string):WidgetScope{
            let rlt = <WidgetScope>json;
            if (name){            
                rlt = json[name];
            }
            if (!rlt.$filters){
                rlt.$filters = {};
            }
            return rlt;
        }
    }

}
