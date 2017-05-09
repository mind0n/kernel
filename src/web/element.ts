export function addcss(target:any, name:string){
    let classes = target.className.trim();
    if (classes.indexOf(name) != 0 && classes.indexOf(' ' + name)<0){
        this.className = `${this.className} ${name}`;
    }
}
export function delcss(target:any, name:string){
    let classes = this.className.trim();
    if (classes.indexOf(name) == 0 || classes.indexOf(' ' + name)>=0){
        this.className = this.className.replace(name, '');
    }
}
