import {WidgetElement} from "./widget";

export class Cursor{
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
