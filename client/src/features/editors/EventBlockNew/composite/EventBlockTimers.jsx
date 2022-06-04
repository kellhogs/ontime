import React from 'react';
import PropTypes from 'prop-types';

import TimeInput from '../../../../common/input/TimeInput';
import { millisToMinutes } from '../../../../common/utils/dateConfig';
import { stringFromMillis } from '../../../../common/utils/time';

import style from '../EventBlockNew.module.scss';

export default function EventBlockTimers(props) {
  const { timeStart, timeEnd, duration, delay } = props;

  const delayTime = `${delay >= 0 ? '+' : '-'} ${millisToMinutes(Math.abs(delay))}`;
  const newTime = stringFromMillis(timeStart + delay);

  return (
    <div className={style.eventTimers}>
      <TimeInput
        name='start'
        actionHandler={() => undefined}
        validate={() => true}
        time={timeStart}
        delay={delay}
      />
      <TimeInput
        name='end'
        actionHandler={() => undefined}
        validate={() => true}
        time={timeEnd}
        delay={delay}
      />
      <TimeInput
        name='duration'
        actionHandler={() => undefined}
        validate={() => true}
        time={duration}
        delay={delay}
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
};
