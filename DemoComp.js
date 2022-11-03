import React, { useState } from "react";
import { View, Text, SafeAreaView, ScrollView } from 'react-native'

const DemoComp = () => {

    const [totalWorkLength, setTotalWorkLength] = useState({
        todayWorkLength: 0,
        weekWorkLength: 0,
        monthWorkLength: []
    })

    const currentDate = new Date()
    const monthsName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']


    const randomDateFn = (startDate, endDate) => {

        return new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));

    }

    const randomStartDateFn = () => {

        let dateObj = new Date()
        let endDate = new Date()
        let startDate = new Date(dateObj.setMonth(dateObj.getMonth() - 5));
        return randomDateFn(startDate, endDate)
    }

    const breakLengthFn = () => {
        let max = 45;
        let min = 0
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    const randomEndDateFn = () => {

        const minTime = 10
        let breakLength = breakLengthFn()
        const startDate = randomStartDateFn();
        let startingDate = new Date(startDate)
        let endingDate = new Date(startDate)
        let startTime = new Date(startingDate.setMinutes(startDate.getMinutes() + (minTime + breakLength)));
        let endTime = new Date(endingDate.setHours(startDate.getHours() + minTime));
        // console.log('startDate.getMinutes()::::', startDate.getMinutes());
        // console.log('startDate::::', startDate.toLocaleTimeString('en-IN'));
        // console.log('startTime::::', startTime.toLocaleTimeString('en-IN'));
        // console.log('breakLengthData:::::', breakLength);

        // console.log('randomEndDateFn:::::', endTime.toLocaleTimeString('en-IN'));
        let endDate = randomDateFn(startTime, endTime)
        return { startDate, breakLength, endDate }

    }

    const addMoreData = () => {

        let dataArr = []
        let todayWorkHours = totalWorkLength.todayWorkLength
        let weekWorkHours = totalWorkLength.weekWorkLength
        let weekendDate = new Date()
        let weekend = new Date(weekendDate.setDate(weekendDate.getDay() - 7))
        let monthData = totalWorkLength.monthWorkLength.length > 0 ? [...totalWorkLength.monthWorkLength] : new Array(12).fill(0)

        for (let index = 0; index < 1000; index++) {

            const { startDate, breakLength, endDate } = randomEndDateFn();

            const totalWorkLength = Math.floor(((endDate - startDate) - breakLength) / (1000 * 60))

            const mins = (totalWorkLength % 60)
            const hours = (totalWorkLength - mins) / 60

            let newObj = {
                id: index + 'index',
                start: startDate,
                end: endDate,
                breakLength: breakLength,
                // createdAt: new Date()
            }

            dataArr.push(newObj)

            const monthIndex = startDate.getMonth()

            if ((monthData[monthIndex] && monthData[monthIndex].monthName) == monthsName[monthIndex]) {
                monthData[monthIndex].workLength += totalWorkLength
                // console.log('month name::',monthsName[monthIndex])
            }
            else {
                let monthDataObj = {
                    id: index,
                    monthName: monthsName[monthIndex],
                    workLength: totalWorkLength
                }
                monthData.splice(monthIndex, 1, monthDataObj)
            }
            // monthData[startDate.getMonth()-1]

            if (weekend <= startDate) {
                weekWorkHours += totalWorkLength

                if (startDate.toLocaleDateString() == currentDate.toLocaleDateString()) {
                    todayWorkHours += totalWorkLength
                }
                // console.log('weekend::::', weekend.toLocaleString())
                // console.log('weekend::::', startDate.toLocaleString())
                // console.log('currentDate::::', currentDate.toLocaleString())
            }

        }

        setTotalWorkLength({
            todayWorkLength: todayWorkHours,
            weekWorkLength: weekWorkHours,
            monthWorkLength: monthData
        })
        // console.log('mins::::', mins);
        console.log('todayWorkHours::::', todayWorkHours);
        console.log('weekWorkHours::::', weekWorkHours);
        console.log('monthWorkLength::::', monthData);
        // console.log('startDate::::', startDate.toLocaleTimeString());
        // console.log('breakLengthData:::::', breakLength);
        // console.log('randomEndDateFn:::::', endDate.toLocaleTimeString());
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Text onPress={addMoreData}>Add More Data</Text>
            <Text>Today Work Hours :::{(totalWorkLength.todayWorkLength ? (totalWorkLength.todayWorkLength / 60)((totalWorkLength.todayWorkLength) % 60) : 0)}</Text>
            {/* <Text>Week Work Hours ::: {totalWorkLength.weekWorkLength}</Text>
            {totalWorkLength.monthWorkLength.map((item, index) =>
                <View key={index}>
                    {(item && item.workLength) ?

                        <View style={{ flexDirection: 'row' }}>
                            <Text>{item.monthName}: </Text>
                            <Text>{item.workLength}</Text>
                        </View>
                        :
                        null
                    }
                </View>
            )
            } */}
        </SafeAreaView>
    )
}

export default DemoComp