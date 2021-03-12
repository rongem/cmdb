export const toHex = (value: number)=> {
    const ret = value.toString(16);
    return ret.length === 1 ? '0' + ret : ret;
};

export const fromHex = (value: string)=> {
    if (value.startsWith('#')) {
        value = value.substring(1);
    }
    return parseInt(value, 16);
};


