import {all, starts, add} from '../../common';
import {PrepareElement} from './processor';
import {Cursor} from "./cursor";
import {Action} from "./action";
import {Widget,WidgetElement,WidgetFactory,WidgetScope} from "./widget";

export class IconWidget extends WidgetFactory{
    renderWidget(el:WidgetElement):string{
        let node = <any>el;
        let name = node['n'] || 'placeholder';
        let size = node['size'] || null;
        let rlt = '';
        switch(name){
            case 'toggle-menu':
                return this.renderItem(`<path d="M13 9L22 17L13 25L22 17" />`, size);
            case 'toggle-drop-down':
                return this.renderItem(`<path d="M8 13L16 22L24 13L16 22" />`, size);
            case 'toggle-sort-up':
                return this.renderItem(`<path d="M8 19L16 10L24 19L16 10" />`, size);
            case 'toggle-sort-down':
                return this.renderItem(`<path d="M8 13L16 22L24 13L16 22" />`, size);
            case 'placeholder':
                return this.renderItem(`
                    <path class="fill" d="M 166.968 184.31 L 303.071 358.517 L 30.864 358.517 L 166.968 184.31 Z" />
                    <path class="fill" d="M 285.674 128.777 L 445.795 357.638 L 125.552 357.638 L 285.674 128.777 Z" />
                    <path class="fill" d="M 358.79 176.598 L 475.679 357.639 L 241.901 357.639 L 358.79 176.598 Z" />
                    <ellipse class="fill" transform="matrix(1.000001, 0, 0, 1, -537.650153, -286.399048)" cx="746.128" cy="441.819" rx="27.184" ry="29.749" />
                    <rect x="7.369" y="7.143" width="485.292" height="487.587" style="fill:none; stroke-width:12;" />
                `, size);
            default:
                return `<img class="preview" src="${name}" />`;
        }

    }
    protected renderItem(icon:string, size?:string){
        if (size){
            return `                
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" >${icon}</svg>
            `;
        }
        return icon;
    }
    linkWidget(target:any){
    }
}
