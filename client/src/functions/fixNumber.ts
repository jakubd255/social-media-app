const fixNumber = (number: number): string => {
    const rounded = number.toFixed(3);
    return rounded.replace(/\.?0*$/, '');
}

export default fixNumber;