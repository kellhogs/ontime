import { useCallback } from 'react';
import { millisToString } from 'ontime-utils';
import PropTypes from 'prop-types';

import { useEmitLog } from '@/common/stores/logger';

import TimeInput from '../../../../common/components/input/time-input/TimeInput';
import { millisToMinutes } from '../../../../common/utils/dateConfig';
import { validateEntry } from '../../../../common/utils/timesManager';

import style from '../EventBlock.module.scss';

export default function EventBlockTimers(props) {
  const { timeStart, timeEnd, duration, delay, actionHandler, previousEnd } = props;
  const { emitWarning } = useEmitLog();

  const delayTime = `${delay >= 0 ? '+' : '-'} ${millisToMinutes(Math.abs(delay))}`;
  const newTime = millisToString(timeStart + delay);

  /**
   * @description Validates a time input against its pair
   * @param {string} entry - field to validate: timeStart, timeEnd, durationOverride
   * @param {number} val - field value
   * @return {boolean}
   */
  const handleValidation = useCallback(
    (field, value) => {
      const valid = validateEntry(field, value, timeStart, timeEnd);
      if (valid.catch) {
        emitWarning(`Time Input Warning: ${valid.catch}`);
      }
      return valid.value;
    },
    [emitWarning, timeEnd, timeStart]
  );

  const handleSubmit = useCallback(
    (field, value) => {
      actionHandler('update', { field, value });
    },
    [actionHandler]
  );

  return (
    <div className={style.eventTimers}>
      <TimeInput
        name='timeStart'
        submitHandler={handleSubmit}
        validationHandler={handleValidation}
        time={timeStart}
        delay={delay}
        placeholder='Start'
        previousEnd={previousEnd}
      />
      <TimeInput
        name='timeEnd'
        submitHandler={handleSubmit}
        validationHandler={handleValidation}
        time={timeEnd}
        delay={delay}
        placeholder='End'
        previousEnd={previousEnd}
      />
      <TimeInput
        name='durationOverride'
        submitHandler={handleSubmit}
        validationHandler={handleValidation}
        time={duration}
        placeholder='Duration'
        previousEnd={previousEnd}
      />
      {delay !== 0 && delay !== null && (
        <div className={style.delayNote}>
          {`${delayTime} minutes`}
          <br />
          {`New start: ${newTime}`}
        </div>
      )}
    </div>
  );
}

EventBlockTimers.propTypes = {
  timeStart: PropTypes.number,
  timeEnd: PropTypes.number,
  duration: PropTypes.number,
  delay: PropTypes.number,
  actionHandler: PropTypes.func,
  previousEnd: PropTypes.number,
};
