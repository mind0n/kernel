import {all, starts, add} from '../../common';
import {create} from '../element';
import {PrepareElement, ElementProcessor} from './processor';
import {Cursor} from "./cursor";
import {Action} from "./action";
import {Widget,WidgetElement,WidgetFactory,WidgetScope, ForWidgetElement} from "./widget";

export class ForWidget extends WidgetFactory{
    init(node:WidgetElement){
        node.template = node.innerHTML;
    }
    renderWidget(forel:WidgetElement):string{
        let node = <ForWidgetElement>forel;
        let name = node.getAttribute('in');
        let scope = node.scope();
        let s = <any>scope;
        if (s[name]){
            let list = s[name];
            node.innerHTML = '';
            node.els = [];
            all(list, (item:any, i:any)=>{
                this.renderItem(node, item);
            });
        }
        return;
    }
    protected renderItem(node:WidgetElement, item:any){
        let el = Widget.parsehtml(node.template);
        el.prepare(item, node);
        el.appendto(node);
    }
    linkWidget(target:any){
        target.getlist = function(scope:any){
            let name = this.getAttribute('in');
            let list = scope[name];
            return list;
        }
        target.onrefresh = function(scope:any){
            let list = this.getlist(scope);

        }
    }
}