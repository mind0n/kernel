import {all, starts, add} from '../../common';
import {PrepareElement} from './processor';
import {Cursor} from "./cursor";
import {Action} from "./action";

export class Widget{
    protected static widgets:any = {};
    static parsehtml(html:string):WidgetElement{
        let rlt:any = null;
        let d = document.createElement('div');
        d.className = 'w-wrap';
        d.innerHTML = html;
        if (d.childElementCount>1){
            rlt = d;
        }else{
            rlt = d.firstElementChild;
        }
        rlt.prepare = PrepareElement;
        return rlt;
    }
    static regist(name:string, widget:WidgetFactory){
        Widget.widgets[name] = widget;
    }
    static has(tag:string):boolean{
        return Widget.widgets[tag.toLowerCase()];
    }
    static use(el:WidgetElement):WidgetFactory{
        let tag = el.tagName.toLowerCase();
        let factory = Widget.widgets[tag];
            // self.trigger('link');
            // f.link(self);
            // self.trigger('linked');

        if (factory){
            // Slot assignment
            all(el.childNodes, (child:Node, i:number)=>{
                let attrs = <any>child.attributes;
                if (attrs && attrs['slot']){
                    let n = attrs['slot'];
                    if (!el.slots[n]){
                        el.slots[n] = [];
                    }
                    add(el.slots[n], child);
                }
            });
            el.scope().$factory = factory;
            //factory.init(el);
            el.render();
            return factory;
        }
        return null;
    }
    static init(options:any){
        all(options, (item:any, i:string)=>{
            Widget.regist(i, item);
        });
        // Widget.regist('tst', new UploadWidget());
        // Widget.regist('icon', new IconWidget());
    }
}

export interface WidgetElement extends Element{
    cs:Cursor;
    slots:any;
    actions:Action;
    template:string;
    prepare(json:any):WidgetElement;
    unit(name?:string):WidgetElement;
    root():WidgetElement;
    detach():WidgetElement;
    scope(name?:string):WidgetScope;
    trigger(name:string, arg?:any):any;
    refresh(recursive?:boolean):void;
    render():void;
    prepareChildren(json:any):void;
    act(script:string, handler:Function, long?:boolean):void;
}

export interface WidgetScope{
    $factory:WidgetFactory;
    $filters:any;
}

export abstract class WidgetFactory{
    init(node:WidgetElement){

    }
    render(node:WidgetElement):string{
        return this.renderWidget(node);
    }
    link(target:WidgetElement):void{
        this.linkWidget(target);
    }
    abstract renderWidget(node:WidgetElement):string;
    abstract linkWidget(target:WidgetElement):void;
}
