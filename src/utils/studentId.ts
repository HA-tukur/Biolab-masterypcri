export const getOrCreateStudentId = (): string => {
  let studentId = localStorage.getItem('biosim_user_id');
  if (!studentId) {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    studentId = `BioStudent-${randomNum}`;
    localStorage.setItem('biosim_user_id', studentId);
  }
  return studentId;
};