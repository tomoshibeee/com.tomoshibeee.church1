export const formatDate = (date: string) => {
  const [year, month, day] = date.split("-");
  if (!year || !month || !day) return date;
  return `${year}.${month}.${day}`;
};

