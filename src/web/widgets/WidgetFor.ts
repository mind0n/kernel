import {all, starts, add} from '../../common';
import {PrepareElement} from './processor';
import {Cursor} from "./cursor";
import {Action} from "./action";
import {Widget,WidgetElement,WidgetFactory,WidgetScope} from "./widget";

export class ForWidget extends WidgetFactory{
    renderWidget(node:WidgetElement):string{
        return;
    }
    linkWidget(target:any){

    }
}