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
 * @description Checks which field the value relates to
 * @param field
 * @param val
 * @param timeStart
 * @param timeEnd
 * @return {{start, end, durationOverride}}
 */
export const handleTimeEntry = (field, val, timeStart, timeEnd) => {
  let start = timeStart;
  let end = timeEnd;
  let durationOverride = null;
  // Todo: would entry be duration otherwise?

  if (field === 'timeStart') {
    start = val;
  } else if (field === 'timeEnd') {
    end = val;
  } else {
    durationOverride = field === 'durationOverride';
  }
  return { start, end, durationOverride };
};

export const validateEntry = (field, value, timeStart, timeEnd) => {
  const validate = { value: true, catch: '' };

  // 1. if one of times is not entered, anything goes
  if (value == null || timeStart == null || timeEnd == null) return validate;
  if (timeStart === 0) return validate;

  // 2. find out whats what
  const { start, end, durationOverride } = handleTimeEntry(field, value, timeStart, timeEnd);
  if (durationOverride !== null) {
    return validate;
  }

  // 3. validation rules
  if (start > end) {
    validate.catch = 'Start time later than end time';
  }
  return validate;
};
