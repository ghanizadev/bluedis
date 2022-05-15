import pt_BR from './pt_BR';

const inUse: any = {};
let timeout: any;

const saveKey = (key: string, value: string) => {
  if(!inUse[key]) inUse[key] = value;
  
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    console.log(inUse);
  }, 1000)
} 

export const t = (value: TemplateStringsArray, ...args: any[]) => {
  const items = value.slice(0, args.length + 1);
  const keyLike = items.map(k => k.toLowerCase().trim()).join('').replace(/[ .,/#!$?%^&*;:{}=\-_`~()]/g,"");
  const keys = Object.entries(pt_BR);
  
  let response = items
    .reduce((p, c, index) => index < args.length ? [...p, c, args[index].toString()] : [...p, c], [] as string[])
    .join('');
  
  for (let i = 0; i < keys.length; i++){
    const [k, v] = keys[i];
    if(k === keyLike) {
      response = typeof v === "string" ? v : v(...args);
      break;
    }
  }
  
  // saveKey(keyLike, response);
  return response;
}