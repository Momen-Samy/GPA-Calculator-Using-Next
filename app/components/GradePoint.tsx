"use client";
import { useContext } from "react";
import styles from "../page.module.css";
import { GradeContext, GradePointType } from "../page";

export default function GradePoint() {
  const { gradepoint, setGradePoints } = useContext(
    GradeContext
  ) as GradePointType;

  const handelChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    grade: string
  ) => {
    let newVal = event.target.value;
    newVal = newVal.replace(/[^0-9\.]/gi, "");
    newVal = newVal.replace(/^\./, "0.");
    const dotCount = newVal.split(".").length - 1;
    if (dotCount > 1) {
      newVal = newVal.slice(0, newVal.lastIndexOf("."));
    }
    // if(newVal.includes('.')) {
    //   newVal =
    //     newVal.slice(0,newVal.indexOf('.') + 1) +
    //     newVal
    //     .slice(newVal.indexOf('.') + 1)
    //     .split("")
    //     .filter(elem => elem !== '.')
    //     .join("");
    // }
    setGradePoints((gradepoint) => {
      const updatedGrades = { ...gradepoint };
      updatedGrades[grade] = newVal;
      localStorage.setItem("GradesPoints", JSON.stringify(updatedGrades));
      return updatedGrades;
    });
  };

  return (
    <div className={styles["Grades-box"]}>
      <h2>Grades Points</h2>
      <div className={styles.Grades}>
        {Object.entries(gradepoint).map(([grade, point]) => (
          <div key={grade}>
            <label>{grade}</label>
            <input
              type="text"
              value={point}
              maxLength={5}
              onChange={(event) => handelChange(event, grade)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
