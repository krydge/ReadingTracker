import { Pressable, Text, View, StyleSheet, TextInput, Inp } from "react-native";
import { useEffect, useState } from "react";
import * as filesystem from "expo-file-system"

const timeFile = filesystem.documentDirectory + "totatlTime.txt";
const goalFile = filesystem.documentDirectory + "goal.txt";
export default function Index() {
    const [tracking, setTracking] = useState(false);
    const [totalTime, setTotalTime] = useState(0);
    const [time, setTime] = useState(0);
    const [goal, setGoal] = useState("");
    const [goalSet, setGoalSet] = useState(false);

    const loadTotalTime = async () => {
        let data ="0"
        try{
            let data = await filesystem.readAsStringAsync(timeFile)
        }
        catch(e){
            console.log(e)
            await filesystem.writeAsStringAsync(timeFile, "0")
        }
        setTotalTime(parseInt(data))
    }
    const saveTotalTime = async (ttime: number) => {
        await filesystem.writeAsStringAsync(timeFile, ttime.toString())
    }

    useEffect(() => {
        loadTotalTime()
        loadGoal()
        let timer: any;
        if (tracking) {
            timer = setInterval(() => {
                setTime(time => time + 1);
            }, 1000)
        }

        return () => {
            if (timer) clearInterval(timer)
        }
    }, [tracking])

    const startTimer = () => {
        setTracking(true)
    }

    const stopTimer = () => {
        setTracking(false)
        logTime()
    }

    const logTime = () => {
        setTotalTime(totalTime => totalTime + time)
        saveTotalTime(totalTime + time)
        setTracking(false)
        setTime(0)
    }

    const saveGoal = async () => {
        setGoalSet(true)
        await filesystem.writeAsStringAsync(goalFile, goal.toString())
    }

    const loadGoal = async () => {
        let data = await filesystem.readAsStringAsync(goalFile)
        setGoal(data)
        if (data != "" || data != undefined) {
            setGoalSet(true)
        }
    }

    const displayTime = (count: number) => {
        let minutes = Math.floor(count / 60);
        let seconds = count % 60;
        let hours = Math.floor(minutes / 60);
        minutes = minutes % 60;
        if (seconds > 0 || tracking) {
            return (
                <Text style={styles.countDownContainer}>{hours}H : {minutes}M : {seconds}S</Text>
            )
        }
    }

    const deleteGoal = async () => {
        await filesystem.deleteAsync(goalFile)
        setGoalSet(false)
        setGoal("")
    }



    return (
        <View
            style={{
                flex: 1,
                alignItems: "center",
                paddingTop: 20

            }}
        >
            {totalTime * 60 === parseInt(goal) && <Text style={styles.text}>You have reached your goal!</Text>}
            {goalSet ?
                <Text style={styles.goal}>Goal: {parseInt(goal)} Minutes </Text>
                :
                <>
                    <TextInput inputMode='numeric' placeholder="Set a Minutes goal." onChangeText={setGoal} style={styles.textInput} />
                    <Pressable onPress={saveGoal} style={styles.button}>
                        <Text style={styles.textColor}>Save Goal</Text>
                    </Pressable>
                </>}
            {tracking &&
                <Text style={styles.text}>Current Reading Time</Text>
            }
            {displayTime(time)}
            {
                tracking ? <>
                    <Pressable onPress={stopTimer} style={styles.buttonStop}>
                        <Text style={styles.textColor}>Stop Timer</Text>
                    </Pressable>
                </>
                    :
                    <Pressable onPress={startTimer} style={styles.button}>
                        <Text style={styles.textColor}>Start Timer</Text>
                    </Pressable>
            }
            {totalTime > 0 && <Text style={styles.text}>Total Reading Time</Text>}
            {displayTime(totalTime)}
            {goalSet &&
                <Pressable onPress={deleteGoal} style={styles.deleteGoalButton}><Text>Delete Goal</Text></Pressable>
            }

        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        width: 320,
        height: 68,
        marginHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,


    },
    button: {
        borderRadius: 10,
        width: '80%',
        height: '25%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: 'blue',
    },
    buttonStop: {
        borderRadius: 10,
        width: '80%',
        height: '25%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: 'red',
    },
    textColor: {
        color: '#fff',
        fontSize: 40,
    },
    countDownContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 40,
    },
    buttonLabel: {
        color: '#fff',
        fontSize: 16,
    },
    goal: {
        fontSize: 45,
        color: 'orange',
    },
    text: {
        fontSize: 35,
    },
    deleteGoalButton:{
        width:'80%',
        height:'10%',
        marginTop:100,
        backgroundColor:'red',
    },
});
