// This function returns random date between given startdate and enddate
export const randomDateFn = (startDate, endDate) => {

    return new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));

}

// This function returns random startDate from last six months
export const randomStartDateFn = () => {

    let dateObj = new Date()
    let endDate = new Date()
    let startDate = new Date(dateObj.setMonth(dateObj.getMonth() - 5));
    return randomDateFn(startDate, endDate)
}

// This function returns random break length in between 0 to 45 mins
export const breakLengthFn = () => {
    let max = 45;
    let min = 0
    return Math.floor(Math.random() * (max - min + 1) + min)
}

// This function calls startDate , breaklength functions and returns both with end date in a single day
export const randomEndDateFn = () => {

    const minTime = 10
    let breakLength = breakLengthFn()
    const startDate = randomStartDateFn();
    let startingDate = new Date(startDate)
    let endingDate = new Date(startDate)
    let startTime = new Date(startingDate.setMinutes(startDate.getMinutes() + (minTime + breakLength)));
    let endTime = new Date(endingDate.setHours(startDate.getHours() + minTime));
    let endDate = randomDateFn(startTime, endTime)
    return { startDate, breakLength, endDate }

}

// this function helps to return nearest 15 mins, thus saving time from saving every block modal nearest mins
export const convertMinsToHrs = (mins) => {
    const minutes = 15;
    let remainingMins = Math.floor(mins % 60)
    let hours = Math.floor(mins / 60) 
    let nearestMins = remainingMins % minutes;
    let newMins = ((remainingMins-nearestMins) / minutes)
    if (nearestMins > (minutes / 2)) {
        if((newMins * minutes) >= 45){
            hours +=1
            newMins =0
        }
        else{
            newMins = (newMins+1) * minutes
        }
    }
    else{
        newMins = newMins * minutes
    }
    return hours+ 'h' + ' ' + newMins+'m'
}
