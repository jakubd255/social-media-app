import dayjs from "dayjs";



const time = (time: number): string => {
    const now = Math.floor(Date.now()/1000);
    const seconds = now - time;
    const minutes = Math.floor(seconds/60);
    const nowDate = dayjs();
    const timeDate = dayjs(time * 1000);

    if(minutes < 60)
        return minutes <= 1 ? "1 minute ago" : minutes+" minutes ago";
    else
    {
        const hours = Math.floor(minutes/60);
    
        if(nowDate.isSame(timeDate, "day"))
            return hours === 1 ? "1 hour ago" : hours+" hours ago";
        else if (nowDate.isSame(timeDate.subtract(1, "day"), "day"))
            return "Yesterday " + timeDate.format("HH:mm");
        else
            return timeDate.format("YYYY-MM-DD HH:mm");
    }
}

export default time;