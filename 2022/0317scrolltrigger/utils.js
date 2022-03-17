export const iterElement = (els,fn) => {
    return [...els].forEach((el,i) => {fn(el,i)});
};
