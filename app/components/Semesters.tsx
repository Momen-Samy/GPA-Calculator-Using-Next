'use client'
import {useContext, useEffect, useMemo, useState} from "react";
import styles from "../page.module.css";
import { IoAddCircleSharp, IoCloseCircleOutline} from "react-icons/io5";
import {GradeContext, SemesterContext} from '@/app/page'
import {GradePointType} from '@/app/page'
import {Semestertype} from '@/app/page'



export default function Semesters() {
  const { semester, setSemester } = useContext(SemesterContext);
  const { gradepoint,} = useContext(GradeContext) as GradePointType;
  const [conicStyel, setConicStyel] = useState(
    {"background" : `background: conic-gradient(red 0% 0%, #ddd 0% 74%, white 74% 100%)`}
  )

  const change__progressBar = (totalGpa : number) => {
    let i = 0;
    let color: string ;
    if(totalGpa >= 3.7){
      color = "#49e1d3";
    } else if(totalGpa > 2){
      color = "#FFC871"
    } else if(totalGpa > 1.2){
      color = "#da6a3bd4";
    } else {
      color = "#d14646d4";
    }
    const number = ((totalGpa / 4) * 100) * 74 / 100;
    const counter = setInterval(function() {
      const conic = {
        "background": `conic-gradient(${color} 0% ${i}%, #ddd 0 74%, white 74% 100%)`,
      };
      setConicStyel(conic)
      i += 0.5;
      if(i > number) {
        clearInterval(counter)
      }
    },15)
  }

  const totalGPA = useMemo(() => {
    const semesClone = { ...semester };
    let totalPoints = 0;
    let totalHours = 0;
  
    Object.values(semesClone).forEach(({ semes }) => {
      totalPoints += semes.totalPoints;
      totalHours += semes.totalHours;
    });
    const totalGpa = (totalPoints / totalHours)
    ? (totalPoints / totalHours).toFixed(2)
    : "0.00";
    if(Object.keys(semesClone).length > 0 ) {
      localStorage.setItem("totalGPA",JSON.stringify(
        {
          "totalPoints":totalPoints,
          "totalHours":totalHours
        }
      ))
    }
    return totalGpa;
  }, [semester]);

  useEffect(() => change__progressBar(+totalGPA),[totalGPA])

  useEffect( () => {
    if(Object.keys(semester).length > 0) {
    console.log("hello")
    const semesClone =  {...semester};
    Object.entries(semesClone).map(([semesNum,semes]) => {
      let totalHours = 0;
      let totalPoints = 0;
      Object.values(semes.forms).map(([,grade,creditHr]) => {
        if(grade !== "Grades" && creditHr !== "") {
          totalHours += +creditHr;
          totalPoints += +gradepoint[grade] * +creditHr;
        }
      });
      const semesGpa = (totalPoints / totalHours).toFixed(2) ;
      semesClone[+semesNum].semes.semsGPA = semesGpa;
      semesClone[+semesNum].semes.totalHours = totalHours;
      semesClone[+semesNum].semes.totalPoints = totalPoints;
    });
    localStorage.setItem("semester",JSON.stringify(semesClone));
    setSemester(semesClone);
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
},[gradepoint])
  
  const addNewSemester = () => {
    setSemester((semester) => {
      const semesClone = {...semester};
      const keys = Object.keys(semesClone).map(elem => +elem)
      let Min = 1;
      for(; ; Min++) {
        if(!keys.includes(Min)){
          break;
        };
      };
      semesClone[Min] = {
        semes : {totalPoints:0, totalHours:0,semsGPA:"0.00"},
        forms: {
          1 : ["", "Grades", ""],
          2 : ["", "Grades", ""],
        },
      };
      localStorage.setItem("semester",JSON.stringify(semesClone))
      return semesClone;
    });
  };

  const addNewForm = (
    semesNum : number,
  ) => 
    {
      const semesClone = {...semester};
      const formKeys = Object.keys(semesClone[semesNum].forms).map(elem => +elem);
      let Min = 1;
      for(; ; Min++){
        if(!formKeys.includes(Min)){
          break;
        };
      };
      semesClone[semesNum].forms[Min]  =  ["", "Grades", ""]
      localStorage.setItem("semester",JSON.stringify(semesClone))
      setSemester(semesClone)
  };

  const removeSemester = (
    semesNum:number,
  ) => {
    setSemester((semester) => {
      const semesClone = {...semester};
      delete semesClone[semesNum]
      localStorage.setItem("semester",JSON.stringify(semesClone))
      return semesClone;
    });
  }

  const removeForm = (
    formNum: number,
    semesNum:number,
  ) => {
    const semesClone = {...semester};
    delete semesClone[semesNum].forms[formNum];
    const formvals = Object.values(semesClone[semesNum].forms)
    semesClone[semesNum].forms = {}
    for (let Min = 1; Min <= formvals.length; Min++) {
      semesClone[semesNum].forms[Min] = formvals[Min - 1];
    }
    semesClone[semesNum].semes =
      calcGPA__For__Semes(semesNum,semesClone)
    localStorage.setItem("semester",JSON.stringify(semesClone))
    setSemester(semesClone);
  }

  const handelChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    tagNumber: number,
    semesNum: number,
    formNum:number,
  ) => {
    const semesClone = {...semester};
    let newVal = event.target.value;
    if(tagNumber === 2) {
      newVal = newVal.replace(/[^0-5]/,"")
    }
    semesClone[semesNum].forms[formNum][tagNumber] = newVal;
    semesClone[semesNum].semes
      = calcGPA__For__Semes(semesNum, semesClone);
    localStorage.setItem("semester",JSON.stringify(semesClone))
    setSemester(semesClone);
  }

  const calcGPA__For__Semes = (
    semesNum: number,
    semesClone: Semestertype,
  ) => {
    let totalHours = 0;
    let totalPoints = 0;
    Object.values(semesClone[semesNum].forms).map(([,grade,creditHr]) => {
      if(grade !== "Grades" && creditHr !== "") {
        totalHours += +creditHr;
        totalPoints += +gradepoint[grade] * +creditHr;
      }
    });
    const semesGpa = (totalPoints / totalHours).toFixed(2) ;
    return {
      "totalPoints": totalPoints, 
      "totalHours" : totalHours, 
      "semsGPA"    : (semesGpa !== "NaN" ? semesGpa : "0.00")
    };
  }

  return (
    <>
      <div className={styles['GPA-box']}>
        <div className={styles['semester-box']}>
        <div className="semester-box">
          {Object.keys(semester).map((semesNum) => (
            <div key={semesNum} className={styles['semes']}>
              <h3>semester {semesNum}</h3>
              <i onClick={() => removeSemester(+semesNum)}>
                <IoCloseCircleOutline />
              </i>
              {Object.entries(semester[+semesNum].forms)
              .map(([formNum, [courseName, grade, creditHr]]) => (
                <form key={+formNum}>
                  <input
                    type='text'
                    placeholder='Course-Name:'
                    maxLength={22}
                    value={courseName}
                    onChange={(event) => 
                      handelChange(event, 0, +semesNum, +formNum)
                    }/>
                  <select
                    value={grade}
                    onChange={(event) => 
                      handelChange(event, 1, +semesNum, +formNum)
                    }>
                  <option>Grades</option>
                  <option>A+</option>
                  <option>A</option>
                  <option>A-</option>
                  <option>B+</option>
                  <option>B</option>
                  <option>B-</option>
                  <option>C+</option>
                  <option>C</option>
                  <option>C-</option>
                  <option>D+</option>
                  <option>D</option>
                  <option>D-</option>
                  <option>F</option>
                  </select>
                  <input
                  type='text'
                  placeholder='Credit Hour:'
                  maxLength={1}
                  value={creditHr}
                  onChange={(event) => 
                    handelChange(event, 2, +semesNum, +formNum)
                  }
                  />
                  <i onClick={() => removeForm(+formNum, +semesNum)}>
                    <IoCloseCircleOutline />
                  </i>
                </form>
              ))}
              <div className={styles["calcAndadd"]}>
                <p>
                  {
                    `Semester ${semesNum} GPA: ${(semester[+semesNum].semes.semsGPA)}`
                  }
                </p>
                  <button 
                    className = {styles["add-course"]}
                    onClick={() => addNewForm(+semesNum)}
                  >
                    <i><IoAddCircleSharp /></i>
                    add course
                  </button>
              </div>
            </div>
          ))}
        </div>
      </div>
        <button 
          className={styles['add-semester']}
          onClick={addNewSemester}
        >
          <i><IoAddCircleSharp /></i>
          <p>add semester</p>
        </button>
        <div className={styles['progress-container']} >
          <div className={styles['progress-circle']} style={conicStyel}>
            <div className={styles['progress-value']}>
              <h1>{totalGPA}</h1>
              <p>Cumulative GPA</p>
            </div>
          </div>
        </div>
      </div>
    </> 
  )
}
