import {all, starts, add} from '../../common';
import {PrepareElement} from './processor';
import {Cursor} from "./cursor";
import {Action} from "./action";
import {Widget,WidgetElement,WidgetFactory,WidgetScope} from "./widget";

export class ForWidget extends WidgetFactory{
    init(node:WidgetElement){
        node.template = node.innerHTML;
    }
    renderWidget(node:WidgetElement):string{
        let name = node.getAttribute('in');
        let scope = node.scope();
        let s = <any>scope;
        if (s[name]){
            let list = s[name];
            node.innerHTML = '';
            all(list, (item:any, i:any)=>{
                node.innerHTML += node.template;
            });
        }
        return;
    }
    linkWidget(target:any){

    }
}