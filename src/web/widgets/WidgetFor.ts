import {all, starts, add} from '../../common';
import {create, destroy} from '../element';
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
        node.onpreparechildren = function(pscope:any){
            
        }

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
    protected renderItem(node:ForWidgetElement, item:any){
        //console.log(node.template);
        let el = Widget.parsehtml(node.template);
        add(node.els, el);
        el.prepare(item, node);
        el.appendto(node);
    }
    linkWidget(target:any){
        let factory = this;
        target.getlist = function(scope:any){
            let name = this.getAttribute('in');
            let list = scope[name];
            return list;
        }
        target.onrefresh = function(scope:any){
            let self = <ForWidgetElement>this;
            let els = self.els;
            let list = self.getlist(scope);
            let i=0;
            for(; i<list.length; i++){
                let childscope = list[i];
                let child = <WidgetElement>els[i];
                if (i>= els.length){
                    factory.renderItem(self, childscope);
                }else{
                    child.setscope(childscope);
                    //console.log(child, child.scope());
                    child.refresh(true);
                }
            }
            for(;i<els.length;i++){
                destroy(els[i]);
            }
        }
    }
}