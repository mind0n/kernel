import {starts, all} from "../common";

let w = <any>window;
let b = <any>document.body;
export function addcss(target:any, name:string){
    let classes = target.className.trim();
    if (classes.indexOf(name) != 0 && classes.indexOf(' ' + name)<0){
        let s = `${classes} ${name}`;
        target.className = s;
    }
}
export function delcss(target:any, name:string){
    let classes = target.className.trim();
    if (classes.indexOf(name) == 0 || classes.indexOf(' ' + name)>=0){
        let s = classes.replace(name, '');
        target.className = s;
    }
}
export function destroy(target:Node){
    if (!b.$destroyer$){
        b.$destroyer$ = document.createElement('div');
    }
    if (!target){
        return;
    }
    all(target, function(item:any, i:string){
        if (starts(i, ['$', '_'])){
            item[i] = null;
        }
    })
    let d = <Element> b.$destroyer$;
    d.appendChild(target);
    d.innerHTML = '';
}
