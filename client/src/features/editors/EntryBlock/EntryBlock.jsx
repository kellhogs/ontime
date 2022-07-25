import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Checkbox } from '@chakra-ui/react';
import { Tooltip } from '@chakra-ui/tooltip';
import PropTypes from 'prop-types';

import { tooltipDelayMid } from '../../../app/config';
import { LocalEventSettingsContext } from '../../../app/context/LocalEventSettingsContext';
import { LoggingContext } from '../../../app/context/LoggingContext';
import { useEventAction } from '../../../app/hooks/useEventAction';

import style from './EntryBlock.module.scss';

export default function EntryBlock(props) {
  const {
    showKbd,
    previousId,
    visible = true,
    disableAddDelay = true,
    disableAddBlock,
  } = props;
  const { starTimeIsLastEnd, defaultPublic } = useContext(LocalEventSettingsContext);
  const { addEvent } = useEventAction();
  const { emitError } = useContext(LoggingContext);
  const [doStartTime, setStartTime] = useState(starTimeIsLastEnd);
  const [doPublic, setPublic] = useState(defaultPublic);

  const handleCreateEvent = useCallback((eventType) => {
    switch (eventType) {
      case 'event': {
        const newEvent = { type: 'event', after: previousId, isPublic: doPublic };
        const options = { startIsLastEnd: doStartTime ? previousId : undefined };
        addEvent(newEvent, options)
        break;
      }
      case 'delay': {
        addEvent({ type: 'delay', after: previousId });
        break;
      }
      case 'block': {
        addEvent({ type: 'block', after: previousId });
        break;
      }
      default: {
        emitError(`Cannot create unknown event type: ${eventType}`);
        break;
      }
    }

  },[addEvent, doPublic, doStartTime, emitError, previousId])

  useEffect(() => {
    setStartTime(starTimeIsLastEnd);
  }, [starTimeIsLastEnd]);

  useEffect(() => {
    setPublic(defaultPublic);
  }, [defaultPublic]);

  return (
    <div className={`${style.create} ${visible ? style.visible : ''}`}>
      <Tooltip label='Add Event' openDelay={tooltipDelayMid}>
        <span
          className={style.createEvent}
          onClick={() => handleCreateEvent('event')}
        >
          E{showKbd && <span className={style.keyboard}>Alt + E</span>}
        </span>
      </Tooltip>
      <Tooltip label='Add Delay' openDelay={tooltipDelayMid}>
        <span
          className={`${style.createDelay} ${disableAddDelay ? style.disabled : ''}`}
          onClick={() => handleCreateEvent('delay')}
          role='button'
        >
          D{showKbd && <span className={style.keyboard}>Alt + D</span>}
        </span>
      </Tooltip>
      <Tooltip label='Add Block' openDelay={tooltipDelayMid}>
        <span
          className={`${style.createBlock} ${disableAddBlock ? style.disabled : ''}`}
          onClick={() => handleCreateEvent('delay')}
          role='button'
        >
          B{showKbd && <span className={style.keyboard}>Alt + B</span>}
        </span>
      </Tooltip>
      <div className={style.options}>
        <Checkbox
          size='sm'
          colorScheme='blue'
          isChecked={doStartTime}
          onChange={(e) => setStartTime(e.target.checked)}
        >
          Start time is last end
        </Checkbox>
        <Checkbox
          size='sm'
          colorScheme='blue'
          isChecked={doPublic}
          onChange={(e) => setPublic(e.target.checked)}
        >
          Event is public
        </Checkbox>
      </div>
    </div>
  );
}

EntryBlock.propTypes = {
  showKbd: PropTypes.bool,
  visible: PropTypes.bool,
  previousId: PropTypes.string,
  disableAddDelay: PropTypes.bool,
  disableAddBlock: PropTypes.bool,
};
