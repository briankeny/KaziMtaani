//remove Space
export function removeSpace(item:string) {
    const noSpace = item.trim().replace(/\s/g, "");
      if (noSpace) {
        return noSpace;
      } else {
        return item;
      }
 }  

