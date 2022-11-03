import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Dimensions, StatusBar, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { LineChart } from "react-native-chart-kit";
import { convertMinsToHrs, randomEndDateFn } from '../globals/globals';

const WIDTH = Dimensions.get("window").width

const TrackTime = () => {

  const [totalWorkLength, setTotalWorkLength] = useState({
    todayWorkLength: 0,
    weekWorkLength: 0,
    monthWorkLength: []
  })

  const lastSixMonthsName = useRef([])
  const lastSixMonthWorkHrs = useRef([])

  const currentDate = new Date()
  const monthsName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

  useEffect(() => {
    // This function displays six months data only one time when component runs 
    addMoreData()
  }, [])

  const addMoreData = () => {

    let dataArr = []
    let todayWorkHours = totalWorkLength.todayWorkLength
    let weekWorkHours = totalWorkLength.weekWorkLength
    let weekendDate = currentDate
    let weekend = new Date(weekendDate.setDate(weekendDate.getDay() - 7))
    let monthData = totalWorkLength.monthWorkLength.length > 0 ? [...totalWorkLength.monthWorkLength] : new Array(12).fill(0)

    // to add 1000 blocks
    for (let index = 0; index < 1000; index++) {

      const { startDate, breakLength, endDate } = randomEndDateFn();

      const totalWorkTime = Math.floor(((endDate - startDate) - breakLength) / (1000 * 60))

      // Block modal
      let newObj = {
        id: index + 'index',
        start: startDate,
        end: endDate,
        breakLength: breakLength,
        createdAt: currentDate
      }

      dataArr.push(newObj)

      const monthIndex = startDate.getMonth()
      const totalHrs = Math.floor(totalWorkTime / 60)

      // Monthly total work time calculation
      if ((monthData[monthIndex] && monthData[monthIndex].monthName) == monthsName[monthIndex]) {
        monthData[monthIndex].workLength += totalHrs
      }
      else {
        let monthDataObj = {
          id: index,
          monthName: monthsName[monthIndex],
          workLength: totalHrs
        }
        monthData.splice(monthIndex, 1, monthDataObj)
      }

      // Weekely total work time calculation
      if (weekend <= startDate) {
        weekWorkHours += totalWorkTime
        // Current date work time calculation
        if (startDate.toLocaleDateString() == currentDate.toLocaleDateString()) {
          todayWorkHours += totalWorkTime
        }
      }

    }

    let lastMonths = []
    let lastMonthsWorkTime = []

    // Used this loop for setting the months data in simple array format as line charts requires
    for (let i = 0; i < 12; i++) {
      if (monthData && monthData[i].monthName) {
        lastMonths.push(monthData[i].monthName)
        lastMonthsWorkTime.push(monthData[i].workLength)
      }
    }

    // Used useRef to prevent rerendring so that app doesnt rerender twice
    lastSixMonthsName.current = lastMonths
    lastSixMonthWorkHrs.current = lastMonthsWorkTime

    //One time rerendering to update data
    setTotalWorkLength({
      todayWorkLength: todayWorkHours,
      weekWorkLength: weekWorkHours,
      monthWorkLength: monthData
    })
  }

  return (
    <SafeAreaView style={styles.container}>

      <StatusBar barStyle={'dark-content'} />

      <View style={styles.innerContainer}>
        <Text style={styles.title}>Most Useful App Ever</Text>
        <View style={{ flexDirection: "row", paddingVertical: 20 }}>
          <Icon name="clock" style={styles.clockIcon} size={25} color="#689000" />
          <Text style={styles.timetrack}>Total tracked time</Text>
        </View>
        {totalWorkLength.monthWorkLength.length > 0 &&
          <LineChart
            data={{
              labels: lastSixMonthsName.current,
              datasets: [
                {
                  data: lastSixMonthWorkHrs.current
                }
              ]
            }}
            width={WIDTH}
            height={220}
            yLabelsOffset={1}
            withInnerLines={false}
            yAxisSuffix="h"
            yAxisInterval={1}
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: "3",
                strokeWidth: "2",
                stroke: "#ffa726"
              }
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
          />
        }
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={[styles.day, { backgroundColor: "#F7FFE2" }]}>
            <Text style={styles.hours}>{convertMinsToHrs(totalWorkLength.todayWorkLength)}</Text>
            <Text style={styles.subtext}>Today</Text>
          </View>
          <View style={[styles.day, { backgroundColor: "#EFFCFF" }]}>
            <Text style={styles.hours}>{convertMinsToHrs(totalWorkLength.weekWorkLength)}</Text>
            <Text style={styles.subtext}>This week</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", marginTop: 20, backgroundColor: "#F8F8F9", padding: 16, height: 160 }}>
          <View style={{ padding: 10, marginTop: 24 }}>
            <Icon name="heart" size={70} color="#D1C8FF" />
            <View style={styles.emoji}>
              <MaterialCommunityIcons name="sticker-emoji" size={20} color="#232428" />
            </View>

          </View>
          <View >
            <Text style={styles.data}>Want more data?</Text>
            <Text style={{ color: "#727580", fontFamily: "DMSans-Bold" }}>Press this button to add 1,000 {"\n"} blocks!</Text>
            <TouchableOpacity style={styles.btnTouchable} activeOpacity={0.8} onPress={addMoreData}>
              <Text style={styles.btn}>Do it!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF'
  },
  innerContainer: {
    marginHorizontal: 20,
  },
  clockIcon: {
    marginRight: 10,
    alignSelf: 'center'
  },
  timetrack: {
    fontSize: 16,
    fontFamily: "Sora-Bold",
    fontWeight: "600",
    alignSelf: 'center'
  },
  title: {
    fontSize: 20,
    marginTop: 10,
    fontFamily: "Sora-Bold",
    fontWeight: "700",
  },
  day: {
    width: "48%",
    borderRadius: 16,
    padding: 16,
  },
  data: {
    fontSize: 16,
    fontFamily: "Sora-Bold",
    fontWeight: "700",
    paddingTop: 5,
    paddingBottom: 15,

  },
  hours: {
    fontSize: 20,
    fontFamily: "Sora-Bold",
    fontWeight: "600",
    color: "#232428",
    lineHeightL: 24,
    paddingBottom: 3,

  },
  subtext: {
    color: "#727580",
    fontSize: 15,
    fontFamily: "DMSans-Regular"
  },
  btnTouchable: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "#D6F781",
    overflow: "hidden",
    borderRadius: 14,
    color: "#232428",
    fontWeight: "700",
    fontSize: 14,
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  btn: {
    fontWeight: "700",
    fontSize: 14,
  },
  emoji: {
    backgroundColor: "#D6F781",
    width: 30,
    height: 30,
    borderRadius: 10,
    position: "absolute",
    bottom: 30,
    right: 10,
    alignItems: "center",
    justifyContent: "center"
  }
});

export default TrackTime;
