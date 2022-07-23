import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Input } from '@chakra-ui/react';
import PropTypes from 'prop-types';

import { clamp } from '../../app/utils/math';

import style from './TimeInput.module.scss';

const inputProps = {
  width: 20,
  backgroundColor: 'rgba(255,255,255,0.13)',
  color: '#fff',
  border: '1px solid #ecc94b55',
  variant: 'filled',
  borderRadius: '3px',
  placeholder: '-',
  textAlign: 'center',
  size: 'sm',
};

export default function DelayInput(props) {
  const { submitHandler, value } = props;
  const [_value, setValue] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    if (value == null) return;
    setValue(value);
  }, [value]);

  const validate = useCallback(
    (newValue) => {
      inputRef.current.blur();
      if (newValue === '') setValue(0);
      const delayValue = clamp(Number(newValue), -60, 60);

      if (delayValue === value) return;
      setValue(delayValue);

      submitHandler(delayValue);
    },
    [submitHandler, value]
  );

  const onKeyDownHandler = useCallback((event) => {
    if (event.key === 'Enter') {
      validate(event.target.value);
    } else if (event.key === 'Escape') {
      setValue(value);
      inputRef.current.blur();
    }
  }, [validate, value]);

  const labelText = `${Math.abs(value) > 1 ? 'minutes' : 'minute'} ${
    value >= 0 ? 'delayed' : 'ahead'
  }`;

  return (
    <div className={style.delayInput}>
      <Input
        ref={inputRef}
        data-testid='delay-input'
        className={style.inputField}
        {...inputProps}
        value={_value}
        onChange={(event) => setValue(event.target.value)}
        onBlur={() => setValue(value)}
        onKeyDown={onKeyDownHandler}
        type='number'
      />
      <span className={style.label}>{labelText}</span>
    </div>
  );
}

DelayInput.propTypes = {
  submitHandler: PropTypes.func,
  value: PropTypes.number,
};
