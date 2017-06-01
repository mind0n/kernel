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
            el.render();
            return factory;
        }
        return null;
    }
    static init(){
        Widget.regist('tst', new UploadWidget());
        Widget.regist('icon', new IconWidget());
    }
}

export interface WidgetElement extends Element{
    cs:Cursor;
    slots:any;
    actions:Action;
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
        let name = (<any>el)['n'] || 'placeholder';
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
            case 'placeholder':
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
class UploadWidget extends WidgetFactory{
    renderWidget():string{
        return `
            <div class="w-upload-item">
                <icon :n="$ui,test~'placeholder'" 
                    ifclick="$ui~unit().$progress.progress='0%';unit().$test.cc=!unit().$test.cc;console.log(unit().$progress.progress);unit().refresh(true);self.n='//www.baidu.com/img/childrens-day-start_e9fdc805825f196d9b367eec86e65d62.png';"
                ></icon><br />
                <span alias="progress" html="self.progress"></span>
                <input alias="test" checked="{self.cc}" type="checkbox" />
            </div>
        `;
    }
    linkWidget(target:any){
        target.$uploadItem$ = {};
        target.$progress.progress=function(p?:number){
            console.log(this);
            if (p === undefined){
                return this.progress;
            }
            this.progress = p;
        };
        target.load = function(file:File){
            this.$uploadItem.file = file;
        };
        target.paste = function(item:any){
            let f = item.getAsFile();
            this.load(f);
        };
        target.preview = function(callback:Function){
            let ui = this.$uploadItem$;
            let r = new FileReader();
            r.onload = (e:any)=>{
                ui.url = e.target.result;
                if (callback){
                    callback(e);
                }
            }
            r.readAsDataURL(ui.file);
        };

    }
}