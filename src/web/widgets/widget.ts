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
            let s = <WidgetScope>el.scope();
            s.$factory = w;
            let html = w.render(el);
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
        Widget.regist('icon', new IconWidget());
    }
}

export interface WidgetElement extends Element{
    cs:Cursor;
    slots:any;
    prepare(json:any):WidgetElement;
    unit():WidgetElement;
    root():WidgetElement;
    detach():WidgetElement;
    scope(name?:string):WidgetScope;
    trigger(name:string, arg?:any):any;
    refresh(recursive?:boolean):void;
    act(script:string, handler:Function, long?:boolean):void;
}

export interface WidgetScope{
    $factory:WidgetFactory;
    $actions:Action;
}

export abstract class WidgetFactory{
    render(node:WidgetElement):string{
        return this.renderWidget(node);
    }
    link(target:WidgetElement):void{
        this.linkWidget(target);
    }
    abstract renderWidget(node:WidgetElement):string;
    abstract linkWidget(target:WidgetElement):void;
}
class IconWidget extends WidgetFactory{
    renderWidget(el:WidgetElement):string{
        let name = el.getAttribute('n') || 'placeholder';
        switch(name){
            case 'toggle-menu':
                return `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" >
                    <path d="M13 9L22 17L13 25L22 17" />
                </svg>`;
            case 'toggle-drop-down':
                return `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" >
                    <path d="M8 13L16 22L24 13L16 22" />
                </svg>`;
            case 'toggle-sort-up':
                return `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" >
                    <path d="M8 19L16 10L24 19L16 10" />
                </svg>`;
            case 'toggle-sort-down':
                return `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" >
                    <path d="M8 13L16 22L24 13L16 22" />
                </svg>`;
            case 'place-holder':
                return `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" >
                    <path class="fill" d="M 166.968 184.31 L 303.071 358.517 L 30.864 358.517 L 166.968 184.31 Z" />
                    <path class="fill" d="M 285.674 128.777 L 445.795 357.638 L 125.552 357.638 L 285.674 128.777 Z" />
                    <path class="fill" d="M 358.79 176.598 L 475.679 357.639 L 241.901 357.639 L 358.79 176.598 Z" />
                    <ellipse class="fill" transform="matrix(1.000001, 0, 0, 1, -537.650153, -286.399048)" cx="746.128" cy="441.819" rx="27.184" ry="29.749" />
                    <rect x="7.369" y="7.143" width="485.292" height="487.587" style="fill:none; stroke-width:12;" />
                </svg>`;
            default:
                return `<img class="preview" src="${name}" />`
        }

    }
    linkWidget(target:any){
        target.test = ()=>{
            console.log('success');
        };
    }
}
class TestWidget extends WidgetFactory{
    renderWidget():string{
        return `
            <div class="w-upload-item">
                <icon :n="console.log('placeholder')"></icon>
            </div>
        `;
    }
    linkWidget(target:any){
        target.test = ()=>{
            console.log('success');
        };
    }
}