import { useEffect, useState } from "react";


export default function App() {
  const [tracking, setTracking] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [time, setTime] = useState(0);
  const [goal, setGoal] = useState(0);
  const [goalSet, setGoalSet] = useState(false);
  const [pastSessions, SetPastSessions] = useState([])

  console.log({ tracking: tracking, totalTime: totalTime, time: time, goal: goal, goalSet: goalSet })
  const loadTotalTime = () => {
    let data = 0
    try {
      data = localStorage.getItem("time");
    }
    catch (e) {
      console.log(e)
      localStorage.setItem("time", 0)
    }
    setTotalTime(data)
  }

  const saveTotalTime = (ttime) => {
    localStorage.setItem("time", ttime)
  }

  const resetTotalTime =()=>{
    localStorage.setItem("time", 0)
    setTotalTime(0)
  }

  const loadPast = () => {
    let past = []
    try {
      past = localStorage.getItem("past");
    }
    catch (e) {
      console.log(e)
      localStorage.setItem("past", [])
    }
    SetPastSessions(past)
  }

  const savePast = () => {
    localStorage.setItem("past", pastSessions)
  }

  useEffect(() => {
    loadTotalTime()
    loadGoal()
    let timer;
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
    SetPastSessions()
    saveTotalTime(Number(totalTime) + Number(time))
    setTracking(false)
    setTime(0)
  }

  const saveGoal = async () => {
    setGoalSet(true)
    localStorage.setItem("goal", goal)
  }

  const loadGoal = async () => {

    let data = localStorage.getItem("goal")
    setGoal(Number(data))
    if (data !== "" && data !== undefined) {
      setGoalSet(true)
    }
  }

  const displayTime = (count) => {
    const hours = Math.floor(count / (60 * 60))
    const minutes = Math.floor((count % (60 * 60)) / 60)
    const seconds = ((count % (60 * 60)) % 60)
    if (seconds > 0 || tracking) {
      return (
        <p style={styles.countDownContainer}>{hours}H : {minutes}M : {seconds}S</p>
      )
    }
  }

  const deleteGoal = async () => {
    // await filesystem.deleteAsync(goalFile)
    localStorage.setItem("goal", 0)
    setGoalSet(false)
    setGoal("")
  }



  return (
    <div
      style={{
        flex: 1,
        alignItems: "center",
        paddingTop: 20

      }}
    >
      {totalTime * 60 === parseInt(goal) && <p style={styles.text}>You have reached your goal!</p>}
      {goalSet ?
        <p style={styles.goal}>Goal: {parseInt(goal)} Minutes </p>
        :
        <>
          <input type="number" placeholder="Set a Minutes goal." onChange={e => setGoal(Number(e.target.value))} style={styles.textInput} value={goal} />
          <button onClick={saveGoal} style={styles.button}>
            <p style={styles.textColor}>Save Goal</p>
          </button>
        </>}
      {tracking &&
        <p style={styles.text}>Current Reading Time</p>
      }
      {displayTime(time)}
      {
        tracking ? <>
          <button onClick={stopTimer} style={styles.buttonStop}>
            <p style={styles.textColor}>Stop Timer</p>
          </button>
        </>
          :
          <button onClick={startTimer} style={styles.button}>
            <p style={styles.textColor}>Start Timer</p>
          </button>
      }
      {totalTime > 0 && <p style={styles.text}>Total Reading Time</p>}
      {displayTime(totalTime)}
      {goalSet &&
        <button onClick={deleteGoal} style={styles.deleteGoalButton}><p>Delete Goal</p></button>
      }

<button onClick={resetTotalTime}>Reset total time</button>
      {/* {pastSessions.length > 0 &&
        <div>
          <p>Past Sessions:</p>
          {pastSessions.map((session, idx) => <div key={idx}>
            <p>session</p>
          </div>)}
        </div>} */}

    </div>
  );
}

const styles = {
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
  deleteGoalButton: {
    width: '80%',
    height: '10%',
    marginTop: 100,
    backgroundColor: 'red',
  },
};
