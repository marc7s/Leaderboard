export function parseIntoInterface(object: any, template: any, prefix: string = ''): any {
    let parsed: any = {};
    
    for(const key of Object.keys(template)) {
        if(Object.keys(object).includes(prefix + key)){
            parsed[key] = object[prefix + key];
        }
    }
    
    return parsed;
}