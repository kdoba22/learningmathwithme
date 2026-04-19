export function getMaxNumber(experience, operation) {
  const ranges = {
    Beginner:     20,
    Intermediate: 50,
    Advanced:     100,
    Proficient:   250,
    Expert:       999,
  };
  if (operation === "addition" && experience === "Beginner") return 9;
  return ranges[experience];
}
