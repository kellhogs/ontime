import React, { useCallback, useContext, useEffect, useState } from 'react';
import { IconButton } from '@chakra-ui/button';
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { IoLink } from '@react-icons/all-files/io5/IoLink';
import PropTypes from 'prop-types';

import { LoggingContext } from '../../app/context/LoggingContext';
import { forgivingStringToMillis } from '../utils/dateConfig';
import { stringFromMillis } from '../utils/time';

import style from './TimeInput.module.scss'

export default function TimeInput(props) {
  const { name, actionHandler, time = 0, delay, validate, previousEnd } = props;
  const { emitError } = useContext(LoggingContext);
  const [value, setValue] = useState('');

  const handleSubmit = useCallback((value) => {
    // Check if there is anything there
    if (value === '') return false;

    let newValMillis = 0;

    // check for known aliases
    if (value === 'p' || value === 'prev' || value === 'previous') {
      // string to pass should be the time of the end before
      if (previousEnd != null) {
        newValMillis = previousEnd;
      }
    } else if (value.startsWith('+') || value.startsWith('p+') || value.startsWith('p +')) {
      // string to pass should add to the end before
      const val = value.substring(1);
      newValMillis = previousEnd + forgivingStringToMillis(val);
    } else {
      // convert entered value to milliseconds
      newValMillis = forgivingStringToMillis(value);
    }

    // Time now and time submittedVal
    const originalMillis = time + delay;

    // check if time is different from before
    if (newValMillis === originalMillis) return false;

    // validate with parent
    if (!validate(name, newValMillis)) return false;

    // update entry
    actionHandler('update', { field: name, value: newValMillis });

    return true;
  },[actionHandler, delay, name, previousEnd, time, validate]);

  // prepare time fields
  const validateValue = useCallback((value) => {
    const success = handleSubmit(value);
    if (success) {
      const ms = forgivingStringToMillis(value);
      setValue(stringFromMillis(ms + delay));
    } else {
      setValue(stringFromMillis(time + delay));
    }
  },[delay, handleSubmit, time]);


  useEffect(() => {
    if (time == null) return;
    try {
      setValue(stringFromMillis(time + delay));
    } catch (error) {
      emitError(`Unable to parse date: ${error.text}`);
    }
  }, [time, delay, emitError]);

  const isDelayed = delay != null && delay !== 0;

  return (
    <InputGroup size='sm' className={`${style.timeInput} ${isDelayed ? style.delayed : ''}`}>
      <InputLeftElement width='fit-content'>
        <IconButton
          size='sm'
          icon={<IoLink style={{transform: "rotate(-45deg)"}} />}
          aria-label='automate'
          colorScheme='blue'
          style={{ borderRadius: '2px', width: 'min-content' }}
        />
      </InputLeftElement>
      <Input
        data-testid='time-input'
        className={style.inputField}
        type='text'
        placeholder={name}
        variant='filled'
        style={{ borderRadius: '3px' }}
        onChange={(v) => setValue(v.target.value)}
        onSubmit={(v) => validateValue(v)}
        onCancel={() => setValue(stringFromMillis(time + delay, true))}
        value={value}
        maxLength={8}
      />
    </InputGroup>
  );
}

TimeInput.propTypes = {
  name: PropTypes.string,
  actionHandler: PropTypes.func,
  time: PropTypes.number,
  delay: PropTypes.number,
  validate: PropTypes.func,
  previousEnd: PropTypes.number,
};
