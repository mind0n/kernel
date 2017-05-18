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
