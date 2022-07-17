import React from 'react';
import { Input } from '@chakra-ui/react';
import PropTypes from 'prop-types';

import style from './ColourInput.module.scss'

export default function ColourInput(props) {
  const {value, handleChange} = props;
  return(
    <Input
      size='sm'
      variant='filled'
      className={style.colourInput}
      type='color'
      value={value}
      onChange={(event) => handleChange(event.target.value)}
    />
  )
}

ColourInput.propTypes = {
  value: PropTypes.string,
  handleChange: PropTypes.func,
}