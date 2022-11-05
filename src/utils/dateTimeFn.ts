function getFirstDayOfMonth(month: number, year: number): Date {
  return new Date(year, month - 1, 1);
}

function getLastDayOfMonth(month: number, year: number): Date {
  return new Date(year, month, 0);
}
export { getFirstDayOfMonth, getLastDayOfMonth };
