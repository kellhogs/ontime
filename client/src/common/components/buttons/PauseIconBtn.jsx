import React from 'react';
import { IconButton } from '@chakra-ui/button';
import { Tooltip } from '@chakra-ui/tooltip';
import { IoPause } from '@react-icons/all-files/io5/IoPause';
import PropTypes from 'prop-types';

import { tooltipDelayMid } from '../../../app/config';

export default function PauseIconBtn(props) {
  const { clickhandler, active, disabled, ...rest } = props;
  return (
    <Tooltip label='Pause timer' openDelay={tooltipDelayMid} shouldWrapChildren={disabled}>
      <IconButton
        icon={<IoPause size='24px' />}
        colorScheme='orange'
        variant={active ? 'solid' : 'outline'}
        onClick={clickhandler}
        width={120}
        disabled={disabled}
        {...rest}
      />
    </Tooltip>
  );
}

PauseIconBtn.propTypes = {
  clickhandler: PropTypes.func,
  active: PropTypes.bool,
  disabled: PropTypes.bool
}
