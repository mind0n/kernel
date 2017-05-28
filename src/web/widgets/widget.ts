import {all, starts} from '../../common';
import {PrepareElement} from './processor';
import {Cursor} from "./cursor";

export class Widget{
    protected static widgets:any = {};
    static parsehtml(html:string):WidgetElement{
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
    static regist(name:string, widget:WidgetBase){
        Widget.widgets[name] = widget;
    }
    static has(tag:string):boolean{
        return Widget.widgets[tag.toLowerCase()];
    }
    static init(){
        Widget.regist('test', new TestWidget());
    }
}

export interface WidgetElement extends Element{
    cs:Cursor;
    prepare(json:any):WidgetElement;
    unit():WidgetElement;
    root():WidgetElement;
    detach():WidgetElement;
}

export abstract class WidgetBase{
    protected abstract render():string;
    protected abstract inject():void;
}

class TestWidget extends WidgetBase{
    render():string{
        return `
            <div class="w-test">
                <span alias="head">Title</span>
                <div alias="body">Body</div>
            </div>
        `;
    }
    inject(){

    }
}