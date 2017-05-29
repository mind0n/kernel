import {all, starts, add} from '../../common';
import {PrepareElement} from './processor';
import {Cursor} from "./cursor";

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
    static use(el:WidgetElement):boolean{
        let tag = el.tagName.toLowerCase();
        if (Widget.widgets[tag]){
            // Slot assignment
            all(el.childNodes, (child:Node, i:number)=>{
                let attrs = <any>child.attributes;
                if (attrs['slot']){
                    let n = attrs['slot'];
                    if (!el.slots[n]){
                        el.slots[n] = [];
                    }
                    add(el.slots[n], child);
                }
            });
            let w = <WidgetFactory>Widget.widgets[tag];
            let html = w.render();
            html = el.trigger('render', html);
            el.innerHTML = html;
            html = el.trigger('rendered', html);
            el.trigger('link');
            w.link(el);
            el.trigger('linked');
            return true;
        }
        return false;
    }
    static init(){
        Widget.regist('tst', new TestWidget());
    }
}

export interface WidgetElement extends Element{
    cs:Cursor;
    slots:any;
    prepare(json:any):WidgetElement;
    unit():WidgetElement;
    root():WidgetElement;
    detach():WidgetElement;
    scope():any;
    trigger(name:string, arg?:any):any;
}

export abstract class WidgetFactory{
    render():string{
        return this.renderWidget();
    }
    link(target:WidgetElement):void{
        this.linkWidget(target);
    }
    abstract renderWidget():string;
    abstract linkWidget(target:WidgetElement):void;
}

class TestWidget extends WidgetFactory{
    renderWidget():string{
        return `
            <div class="w-test">
                <span alias="head">Title</span>
                <div alias="body">Body</div>
            </div>
        `;
    }
    linkWidget(target:any){
        target.test = ()=>{
            console.log('success');
        };
    }
}