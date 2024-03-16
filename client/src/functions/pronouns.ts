const getPronouns = (pronouns: string): string => {
    switch(pronouns)
    {
        case "he": return "He/Him";
        case "she": return "She/Her";
        case "they": return "They/Them";
        default: return "";
    }
}

export default getPronouns;