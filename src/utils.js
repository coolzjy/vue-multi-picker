export var ONE_DAY = 24 * 3600 * 1000
export var ONE_WEEK = ONE_DAY * 7

/**
 *  get date of week start (Monday)
 *  @param {object} date - date in a week
 *  @return {ojbect} start date of the week
 */
export function getWeekStart (date) {
  var day = date.getDay()
  var offset = (date.getDay() + 6) % 7
  var weekStart = new Date(date.valueOf() - offset * ONE_DAY)
  weekStart.setHours(0, 0, 0, 0)
  return weekStart
}

/**
 *  get date of week end (Sunday)
 *  @param {object} date - date in a week
 *  @return {ojbect} start date of the week
 */
export function getWeekEnd (date) {
  var offset = 6 - (date.getDay() + 6) % 7
  var weekEnd = new Date(date.valueOf() + offset * ONE_DAY)
  weekEnd.setHours(0, 0, 0, 0)
  return weekEnd
}

/**
 *  get week number (in ISO) of date
 *  @param {object} date
 *  @return {number} week number
 */
 export function getWeek (date) {
   var date = new Date(date.getTime());
   date.setHours(0, 0, 0, 0);
   // Thursday in current week decides the year.
   date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
   // January 4 is always in week 1.
   var week1 = new Date(date.getFullYear(), 0, 4);
   // Adjust to Thursday in week 1 and count number of weeks from date to week 1.
   return 1 + Math.round(((date.getTime() - week1.getTime()) / ONE_DAY - 3 + (week1.getDay() + 6) % 7) / 7)
 }
