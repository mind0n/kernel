import {all, starts} from '../../common';
import {WidgetElement} from "./widget";
import {Cursor} from "./cursor";

export function PrepareElement(json:any, parent?:WidgetElement):WidgetElement{
    let rlt = <WidgetElement>this;
    if (json instanceof Array){
        json = {$:json};
    }
    let p = new ElementProcessor(rlt);
    if (parent){
        p.setparent(parent);
    }
    p.prepareAttrs();
    all(json, (item:any, i:string, o:any)=>{
        p.process(item, i);
    });
    if (rlt.childNodes.length > 0){
        let cjson = json.$ || {};
        all(rlt.childNodes, (it:Node, i:number)=>{
            if (it instanceof Element){
                PrepareElement.call(it, cjson, rlt);
            }
        });
    }
    return rlt;
}

export class ElementProcessor{
    constructor(private target:WidgetElement, cs?:Cursor){
        Cursor.check(target);
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
        }
    }
    prepareAttrs(){
        let self = this.target;
        let parent = self.cs.parent;
        let attrs = self.attributes;
        all(attrs, (at:Attr, i:number)=>{
            if (at.name == 'alias'){
                if (parent){
                    let u = <any>parent.cs.childunit;
                    u[`$${at.value}`] = self;
                }else{
                    // Root element with alias
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
    process(item:any, i:string){
        let target = <any>this.target;
        if (i == '$'){

        }else if (starts(i,'$')){
            target[i] = item;
        }else{
            target.setAttribute(i, item);
        }
        return this;
    }
}
