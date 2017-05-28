import {all, starts} from '../../common';

function PrepareElement(json:any, parent?:WidgetElement):WidgetElement{
    let rlt = <WidgetElement>this;
    if (json instanceof Array){
        json = {$:json};
    }
    let p = new ElementProcessor(rlt);
    if (parent){
        p.setparent(parent);
    }
    p.processAttrs();
    all(json, (item:any, i:string, o:any)=>{
        p.process(item, i);
    });
    return rlt;
}

export class Widget{
    static ParseHtml(html:string):WidgetElement{
        let rlt:any = null;
        let d = document.createElement('div');
        d.innerHTML = html;
        if (d.childElementCount>1){
            rlt = d;
        }else{
            rlt = d.firstElementChild;
        }
        rlt.prepare = PrepareElement;
        return rlt;
    }
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
    }
    processAttrs(){
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

interface WidgetElement extends Element{
    cs:Cursor;
    prepare(json:any):WidgetElement;
    unit():WidgetElement;
    root():WidgetElement;
}
class Cursor{
    root:WidgetElement;
    get childunit():WidgetElement{
        let at = this.target.getAttribute('alias');
        if (at){
            return this.target;
        }
        return this.unit || this.target;
    }
    unit:WidgetElement;
    parent:WidgetElement;
    target:WidgetElement;
    constructor(){

    }
    static check(target:WidgetElement){
        if (!target.cs){
            let cs = new Cursor();
            cs.target = target;
            target.cs = cs;
        }
    }
}
