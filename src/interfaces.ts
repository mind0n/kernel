interface Array<T>{
    add(t:T):Array<T>;
    eachfunc(name:string, args:any[]):void;
    each(handler:Function):void;
    all(processor:Function):void;
    clear():void;
}

interface NodeList{
    eachfunc(name:string, args:any[]):void;
    each(handler:Function):void;
    all(processor:Function):void;
}

interface HTMLCollection{
    eachfunc(name:string, args:any[]):void;
    each(handler:Function):void;
    all(processor:Function):void;
}

interface String{
    between(start:string, end?:string):boolean;
    inbetween(n?:number):string;
    starts(start:string):boolean;
    right(lenOrSkip:number):string;
    has(text:string):boolean;
}

interface Object{
    str(func:Function):any;
    obj(func:Function):any;
    fun(func:Function):any;
}

interface HTMLInputElement{
    setCaret(caretPos:number):void;
    setCaretEnd():void;
}

interface Element{
    uid(prefix?:string):string;
    visible():boolean;
    display(hide?:boolean):void;
    astyle(props:any, val?:any):any;
    addcss(name:string):void;
    delcss(name:string):void;
    attach(name:string, target:any, settings:any):any;
    detach(name:string, settings:any):void;
    destroy():void;
    set(path:string, target:any, callback?:Function):void;
    setwidget(path:string, target:any):void;
}


//declare function svg4everybody():void;