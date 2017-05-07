///<reference path="./definitions.ts" />

import debug, {log} from './debug';


export function definitions(){
    Array.prototype.add = function(o:any){
        this[this.length] = o;
        return this;
    }
    Array.prototype.clear = function(){
        let n = this.length;
        for(let i=0; i<n;i++){
            this.pop();
        }
        return this;
    }

    Array.prototype.eachfunc 
    = NodeList.prototype.eachfunc
    = HTMLCollection.prototype.eachfunc
    = function(name:string, args?:any[]){
        for(let i of this){
            if (i[name]){
                i[name].apply(i, args);
            }
        }
        return this;
    } 

    Array.prototype.each 
    = NodeList.prototype.each
    = HTMLCollection.prototype.each
    = function(handler:Function){
        if (handler){
            for(let i=0; i<this.length;i++){
                if (handler(this[i], i)){
                    break;
                }
            }
        }
    }

    Array.prototype.all 
    = NodeList.prototype.all 
    = HTMLCollection.prototype.all
    = function(processor:Function){
        if (processor){
            for(let i of this){
                if (processor(i)){
                    break;
                }
            }
        }
        return this;
    } 

    String.prototype.between = function(start:string, end?:string):boolean{
        if (!end){
            end = start;
        }
        return this && this.length > start.length + end.length && this.substr(0, start.length) == start && this.substr(this.length - end.length) == end;
    }

    String.prototype.inbetween = function(n?:number):string{
        if (!n){
            n = 1;
        }
        if (this && this.length > n*2){
            return this.substr(n, this.length - n*2);
        }
        return '';
    }

    String.prototype.starts = function(start:string){
        return this.indexOf(start) == 0;
    }

    String.prototype.right = function(lenOrSkip:number){
        if (lenOrSkip == 0){
            return '';
        }
        if (lenOrSkip < 0){
            return this.substr(lenOrSkip * -1, this.length + lenOrSkip);
        }else{
            return this.substr(this.length - lenOrSkip, lenOrSkip);
        }
    }

    String.prototype.has = function(text:string){
        return this.indexOf(text)>=0;
    }

    HTMLInputElement.prototype.setCaret = function(caretPos:number){
        let elem = this;
        if (elem.createTextRange) {
            var range = elem.createTextRange();
            range.move('character', caretPos);
            range.select();
        } else {
            if (caretPos) {
                elem.focus();
                elem.setSelectionRange(caretPos, caretPos);
            } else {
                elem.focus();
            }
        }
    };
    HTMLInputElement.prototype.setCaretEnd = function(){
        this.setCaret(this.value.length);
    };
    Element.prototype.uid = function(prefix?:string):string{
        if (prefix){
            let d = new Date();
            let s = prefix.indexOf('-')>=0?prefix:`${prefix}-${d.getHours()}${d.getMinutes()}${d.getSeconds()}${d.getMilliseconds()}${Math.floor(Math.random() * 100)}-${d.getFullYear()}${d.getMonth()}${d.getDate()}`;
            this.$uid$ = s;
            return s;
        }else{
            return this.$uid$;
        }
    };
    Element.prototype.visible = function(){
        return !(this.astyle('display', 'none') || this.astyle('visibility', 'hidden'));
    };
    Element.prototype.display = function(hide?:boolean){
        if (hide){
            this.addcss('wo-hidden');
        }else{
            this.delcss('wo-hidden');
        }
    };
    Element.prototype.astyle = function (styles:any, val?:any) {
        let style:any = null;
        let props = (styles instanceof Array)?styles:[styles];
        let el:Element = this;
        let compStyle:CSSStyleDeclaration = window.getComputedStyle(el, null);
        for (let i:number = 0; i < props.length; i++) {
            style = compStyle.getPropertyValue(props[i]);
            if (style != null) {
                break;
            }
        }
        if (val !== undefined){
            return style == val;
        }
        return style;
    };
    Element.prototype.addcss = function(name:string){
        let classes = this.className.trim();
        let isexp = false;
        if (classes.between('{', '}')){
            isexp = true;
            classes = classes.inbetween();
        }
        if (classes.indexOf(name) != 0 && classes.indexOf(' ' + name)<0){
            if (!isexp){
                this.className = `${this.className} ${name}`;
            }else{
                this.className = `{ ${this.className} ${name} }`;
            }
        }
    };
    Element.prototype.delcss = function(name:string){
        let classes = this.className.trim();
        if (classes.indexOf(name) == 0 || classes.indexOf(' ' + name)>=0){
            this.className = this.className.replace(name, '');
        }
    };
    Element.prototype.attach = function(name:string, target?:any, settings?:any){
        let key = `$${name}$`;
        let el = target;
        if (!this[key]){
            el = el || document.createElement('div');
            this[key] = el;
            this.appendChild(el);
            return el;
        }else{
            this.detach(name, settings);
            this[key] = el;
            this.appendChild(el);
        }
        return el;
    };
    Element.prototype.destroy = function(){
        let d = (<any>window).$destroyer$;
        d.appendChild(this);
        d.innerHTML = '';
    }
    Element.prototype.detach = function(name:string, settings?:any){
        let key = `$${name}$`;
        if (!this[key]){
            return;
        }
        let el = this[key];
        if (settings && settings.ondetach){
            settings.ondetach(el);
        }
        el.destroy();
        this[key] = null;
    };
    Element.prototype.set = function(path:string, target:any, callback?:Function){
        let list = path.split('.');
        let p = this;
        for(let i=0; i<list.length; i++){
            let key = list[i];
            let c = p[key];
            if (c === undefined){
                break;
            }else{
                p = c;
            }
        }
        if (p){
            if (callback){
                callback.call(p, target);
            }else{
                if (typeof(target) == 'string'){
                    p.innerHTML = target;
                }else{
                    p.appendChild(target);
                }
            }
        }
    };
    let w:any = window;
    w.d = debug;
    w.l = log;
    if (!w.$destroyer$){
        let destroyer = document.createElement('div');
        w.$destroyer$ = destroyer;
    }
}