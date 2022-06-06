import React, { useCallback, useEffect, useState } from 'react';
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
  const { actionHandler, value } = props;
  const [_value, setValue] = useState(value);

  useEffect(() => {
    if (value == null) return;
    setValue(value);
  }, [value]);

  const handleSubmit = useCallback(
    (newValue) => {
      if (newValue === value) return;
      if (newValue === '') setValue(0);

      // convert to ms and updates
      const msVal = clamp(newValue, -60, 60) * 60000;
      actionHandler('update', { field: 'duration', value: msVal });
    },
    [actionHandler, value]
  );

  const labelText = `${Math.abs(value) > 1 ? 'minutes' : 'minute'} ${
    value >= 0 ? 'delayed' : 'ahead'
  }`;

  return (
    <div className={style.delayInput}>
      <Input
        data-testid='delay-input'
        className={style.inputField}
        {...inputProps}
        value={_value}
        onChange={(event) => setValue(event.target.value)}
        onBlur={(event) => handleSubmit(event.target.value)}
        onKeyPress={(event) => {
          console.log(event)
          if (event.key === 'Enter') {
            handleSubmit(event.target.value);
          }
        }}
        type='number'
      />
      <span className={style.label}>{labelText}</span>
    </div>
  );
}

DelayInput.propTypes = {
  actionHandler: PropTypes.func,
  value: PropTypes.number,
};
