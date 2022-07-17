/**
 * @description Milliseconds in a day
 * @type {number}
 */
export const DAY_TO_MS = 86400000;

/**
 * @description calculates duration from given values
 * @param {number} start
 * @param {number} end
 * @returns {number}
 */
export const calculateDuration = (start, end) =>
  start > end ? end + DAY_TO_MS - start : end - start;

/**
 * @description Validates two time entries
 * @param {number} timeStart
 * @param {number} timeEnd
 * @returns {{catch: string, value: boolean}}
 */
export const validateTimes = (timeStart, timeEnd) => {
  const validate = { value: true, catch: '' };
  if (timeStart > timeEnd) {
    validate.catch = 'Start time later than end time';
  }
  return validate;
};

/**
 * @description Checks which field the value relates to
 * @param entry
 * @param val
 * @param timeStart
 * @param timeEnd
 * @return {{start, end, durationOverride}}
 */
export const handleTimeEntry = (entry, val, timeStart, timeEnd) => {
  let start = timeStart;
  let end = timeEnd;
  let durationOverride = null;
  // Todo: would entry be duration otherwise?

  if (entry === 'timeStart') {
    start = val;
  } else if (entry === 'timeEnd') {
    end = val;
  } else {
    durationOverride = entry === 'durationOverride';
  }
  return { start, end, durationOverride };
};
