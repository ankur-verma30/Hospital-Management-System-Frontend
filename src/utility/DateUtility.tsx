import { data } from "react-router-dom";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatDate=(dateString:any)=>{
    if(!dateString) return undefined;
    const month=["January","February","March","April","May","June","July","August","September","October","November","December"];
    const date=new Date(dateString);
    const formattedDate=date.getDate()+" "+month[date.getMonth()]+" "+date.getFullYear();
    return formattedDate;
}

const formatDateWithTime=(dateString:any)=>{
    if(!dateString) return undefined;

    const date=new Date(dateString);

    const options:Intl.DateTimeFormatOptions={
        weekday:"long",
        year:"numeric",
        month:"long",
        day:"numeric",
        hour:"numeric",
        minute:"numeric",
        hour12:true
    }
    return date.toLocaleDateString("en-US",options);
}

export {formatDate,formatDateWithTime}