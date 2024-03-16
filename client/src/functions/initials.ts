const initials = (fullname: string): string => {
    const [part1, part2] = fullname.split(" ");

    let inital = part1[0].toUpperCase();

    if(part2)
        inital += part2[0].toUpperCase();
    
    return inital;
}

export default initials;