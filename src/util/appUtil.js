import moment from "moment"

export const formatDateString = (date, dateFormat) => {
    return moment(date).format(dateFormat);
}

export const formatDateToISOString = (date) => {
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(new Date(date) - tzoffset)).toISOString().slice(0, -1).split('.')[0];

    return localISOTime;
}