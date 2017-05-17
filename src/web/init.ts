import {w} from './starter';
import {Instance} from '../instance';
import {addcss, delcss} from "./element";
import {send} from './network';
let win = <any>window;

win.w = w;


function initCover(target:any, settings:any){
    if (!target){
        target = <any>document.body;
    }
    if (!settings){
        settings = {};
    }
    if (!target.cover){
        target.cover = function(){
            let cv = this.$cover$;
            if (!cv){
                cv = document.createElement('div');
                cv.className = 'w-cover';
                target.$cover$ = cv;
                target.appendChild(cv);
                if (!settings.always){
                    cv.onclick = function(){
                        target.uncover();
                    }
                }
            }
            cv.style.display = '';
        };
    }
    if (!target.uncover){
        target.uncover = function(){
            if (this.$cover$){
                this.$cover$.style.display = 'none';
            }
        };
    }
    return target;
}

export function init(){
    win.addcss = addcss;
    win.delcss = delcss;
    win.send = send;
    Instance.regist('cover', function(settings:any){
        let target =  this;
        target = initCover(target, settings);
        target.cover();
    });

    Instance.regist('uncover', function(settings:any){
        let target =  this;
        target = initCover(target, settings);
        target.uncover();
    });
}
