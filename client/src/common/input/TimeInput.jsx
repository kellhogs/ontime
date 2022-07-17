import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { IconButton } from '@chakra-ui/button';
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { IoLink } from '@react-icons/all-files/io5/IoLink';
import PropTypes from 'prop-types';

import { LoggingContext } from '../../app/context/LoggingContext';
import { forgivingStringToMillis } from '../utils/dateConfig';
import { stringFromMillis } from '../utils/time';

import style from './TimeInput.module.scss';

export default function TimeInput(props) {
  const { name, submitHandler, time = 0, delay, validationHandler, previousEnd } = props;
  const { emitError } = useContext(LoggingContext);
  const inputRef = useRef(null);
  const [value, setValue] = useState('');

  /**
   * @description Resets input value to given
   */
  const resetValue = useCallback(() => {
    // Todo: check if change is necessary
    try {
      setValue(stringFromMillis(time + delay));
    } catch (error) {
      emitError(`Unable to parse date: ${error.text}`);
    }
  }, [delay, emitError, time]);

  const handleFocus = useCallback(() => {
    inputRef.current.select();
  },[]);

  const handleSubmit = useCallback(
    (value) => {
      // Check if there is anything there
      if (value === '') {
        return false;
      }

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
      if (!validationHandler(name, newValMillis)) return false;

      // update entry
      submitHandler(name, newValMillis);

      return true;
    },
    [delay, name, previousEnd, submitHandler, time, validationHandler]
  );

  // prepare time fields
  const validateAndSubmit = useCallback(
    (value) => {
      const success = handleSubmit(value);
      if (success) {
        const ms = forgivingStringToMillis(value);
        setValue(stringFromMillis(ms + delay));
      } else {
        resetValue();
      }
    },
    [delay, handleSubmit, resetValue]
  );

  /**
   * @description Handles common keys for submit and cancel
   * @param {KeyboardEvent} event
   */
  const keyHandler = useCallback(
    (event) => {
      if (event.key === 'Escape') {
        resetValue();
        if (inputRef) {
          inputRef.current.blur();
        }
      } else if (event.key === 'Enter') {
        validateAndSubmit(value);
      }
    },
    [resetValue, validateAndSubmit, value]
  );

  useEffect(() => {
    if (time == null) return;
    resetValue();
  }, [emitError, resetValue, time]);

  const isDelayed = delay != null && delay !== 0;

  return (
    <InputGroup size='sm' className={`${style.timeInput} ${isDelayed ? style.delayed : ''}`}>
      <InputLeftElement width='fit-content'>
        <IconButton
          size='sm'
          icon={<IoLink style={{ transform: 'rotate(-45deg)' }} />}
          aria-label='automate'
          colorScheme='blue'
          style={{ borderRadius: '2px', width: 'min-content' }}
        />
      </InputLeftElement>
      <Input
        ref={inputRef}
        data-testid='time-input'
        className={style.inputField}
        type='text'
        placeholder={name}
        variant='filled'
        style={{ borderRadius: '3px' }}
        onFocus={() => handleFocus()}
        onChange={(event) => setValue(event.target.value)}
        onBlur={(event) => validateAndSubmit(event.target.value)}
        onKeyDown={(event) => keyHandler(event)}
        value={value}
        maxLength={8}
      />
    </InputGroup>
  );
}

TimeInput.propTypes = {
  name: PropTypes.string,
  submitHandler: PropTypes.func,
  time: PropTypes.number,
  delay: PropTypes.number,
  validationHandler: PropTypes.func,
  previousEnd: PropTypes.number,
};
