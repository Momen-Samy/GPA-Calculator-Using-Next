"use client";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import GradePoint from "./components/GradePoint";
import Semesters from "./components/Semesters";

export type GradePointType = {
  gradepoint: { [key: string]: string };
  setGradePoints: Dispatch<SetStateAction<{ [key: string]: string }>>;
};

const defaultGradePoint = {
  "A+": "4",
  A: "4",
  "A-": "3.7",
  "B+": "3.3",
  B: "3",
  "B-": "2.7",
  "C+": "2.3",
  C: "2",
  "C-": "1.7",
  "D+": "1.3",
  D: "1",
  "D-": "0.7",
  F: "0",
};

export const GradeContext = createContext<GradePointType>({
  gradepoint: defaultGradePoint,
  setGradePoints: () => {},
});

export type Semestertype = {
  [key: number]: {
    semes: { totalPoints: number; totalHours: number; semsGPA: string };
    forms: { [key: number]: string[] };
  };
};

type SemesterContextType = {
  semester: Semestertype;
  setSemester: Dispatch<SetStateAction<Semestertype>>;
};

export const SemesterContext = createContext<SemesterContextType>({
  semester: {},
  setSemester: () => {},
});

export default function Home() {
  const [gradepoint, setGradePoints] = useState<{ [key: string]: string }>(
    defaultGradePoint
  );
  const [semester, setSemester] = useState<Semestertype>({});

  useEffect(() => {
    const GradesPoints = localStorage.getItem("GradesPoints");
    if (GradesPoints) {
      setGradePoints(JSON.parse(GradesPoints));
    } else {
      setGradePoints((defaultGradePoint) => {
        localStorage.setItem("GradesPoints", JSON.stringify(defaultGradePoint));
        return defaultGradePoint;
      });
    }
  }, []);

  useEffect(() => {
    const semesobj = localStorage.getItem("semester");
    if (semesobj) {
      setSemester(JSON.parse(semesobj));
    } else {
      setSemester(() => {
        const defaultsemesobj: Semestertype = {
          1: {
            semes: { totalPoints: 0, totalHours: 0, semsGPA: "0.00" },
            forms: {
              1: ["", "Grades", ""],
              2: ["", "Grades", ""],
            },
          },
        };
        localStorage.setItem("semester", JSON.stringify(defaultsemesobj));
        return defaultsemesobj;
      });
    }
  }, []);

  return (
    <div>
      <GradeContext.Provider value={{ gradepoint, setGradePoints }}>
        <SemesterContext.Provider value={{ semester, setSemester }}>
          <GradePoint />
          <Semesters />
        </SemesterContext.Provider>
      </GradeContext.Provider>
    </div>
  );
}
