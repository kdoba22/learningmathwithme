const numberRanges = {
  0: { Beginner: 5,   Intermediate: 10,  Advanced: 15,  Proficient: 20,  Expert: 25  },
  1: { Beginner: 10,  Intermediate: 20,  Advanced: 30,  Proficient: 40,  Expert: 50  },
  2: { Beginner: 20,  Intermediate: 40,  Advanced: 60,  Proficient: 80,  Expert: 100 },
  3: { Beginner: 25,  Intermediate: 50,  Advanced: 75,  Proficient: 100, Expert: 150 },
  4: { Beginner: 50,  Intermediate: 100, Advanced: 150, Proficient: 200, Expert: 250 },
  5: { Beginner: 75,  Intermediate: 150, Advanced: 200, Proficient: 250, Expert: 500 },
  6: { Beginner: 100, Intermediate: 200, Advanced: 300, Proficient: 500, Expert: 999 },
};

export function getMaxNumber(grade, experience) {
  const gradeNum = grade === "KG" ? 0 : parseInt(grade);
  return numberRanges[gradeNum][experience];
}
