import {all, starts, add} from '../../common';
import {PrepareElement} from './processor';
import {Cursor} from "./cursor";
import {Action} from "./action";
import {Widget,WidgetElement,WidgetFactory,WidgetScope} from "./widget";

export class UploadWidget extends WidgetFactory{
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