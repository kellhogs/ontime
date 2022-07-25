import React, { useCallback, useContext, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { IconButton } from '@chakra-ui/button';
import { Editable, EditableInput, EditablePreview } from '@chakra-ui/editable';
import { Tooltip } from '@chakra-ui/tooltip';
import { FiUsers } from '@react-icons/all-files/fi/FiUsers';
import { IoPlay } from '@react-icons/all-files/io5/IoPlay';
import { IoReload } from '@react-icons/all-files/io5/IoReload';
import { IoRemoveCircleSharp } from '@react-icons/all-files/io5/IoRemoveCircleSharp';
import { IoReorderTwo } from '@react-icons/all-files/io5/IoReorderTwo';
import { IoReturnDownForward } from '@react-icons/all-files/io5/IoReturnDownForward';
import { IoSettingsSharp } from '@react-icons/all-files/io5/IoSettingsSharp';
import { IoTimerOutline } from '@react-icons/all-files/io5/IoTimerOutline';
import PropTypes from 'prop-types';

import { tooltipDelayMid } from '../../../app/config';
import { EventEditorContext } from '../../../app/context/EventEditorContext';
import { LoggingContext } from '../../../app/context/LoggingContext';
import { useSocket } from '../../../app/context/socketContext';
import { getAccessibleColour } from '../../../app/utils/styleUtils';
import TooltipActionBtn from '../../../common/components/buttons/TooltipActionBtn';

import EventBlockActionMenu from './composite/EventBlockActionMenu';
import EventBlockTimers from './composite/EventBlockTimers';

import style from './EventBlock.module.scss';

const blockBtnStyle = {
  size: 'sm',
  colorScheme: 'blue',
  variant: 'outline',
  borderRadius: '3px',
  fontSize: '20px',
};

const tooltipProps = {
  openDelay: tooltipDelayMid,
};

export default function EventBlock(props) {
  const {
    timeStart,
    timeEnd,
    duration,
    index,
    eventIndex,
    eventId,
    isPublic = true,
    title,
    note,
    delay,
    previousEnd,
    colour,
    loaded,
    next,
    skip = false,
    selected,
    actionHandler,
  } = props;

  const { setOpenId } = useContext(EventEditorContext);
  const { emitError } = useContext(LoggingContext);
  const [blockTitle, setBlockTitle] = useState(title || '');
  const socket = useSocket();
  const playback = null;

  const binderColours = getAccessibleColour(colour);
  const hasDelay = delay !== 0 && delay !== null;

  const handleTitle = useCallback(
    (text) => {
      if (text === title) {
        return;
      }

      const cleanVal = text.trim();
      setBlockTitle(cleanVal);

      // Todo: no need for action handler
      actionHandler('update', { field: 'title', value: cleanVal });
    },
    [actionHandler, title]
  );

  const playbackActions = useCallback(
    (action) => {
      switch (action) {
        case 'play':
          socket.emit('set-startid', eventId);
          break;
        case 'load':
          socket.emit('set-loadid', eventId);
          break;
        default:
          emitError(`Unhandled action: ${action}`);
      }
    },
    [emitError, eventId, socket]
  );

  return (
    <Draggable key={eventId} draggableId={eventId} index={index}>
      {(provided) => (
        <div
          className={`${style.eventBlock} ${skip ? style.skip : ''} ${
            selected ? style.selected : ''
          }`}
          {...provided.draggableProps} ref={provided.innerRef}
        >
            tabIndex={-1}
            <IoReorderTwo className={style.drag} />
            {eventIndex}
          </div>
          <div className={style.playbackActions}>
            <TooltipActionBtn
              tooltip='Skip event'
              openDelay={tooltipDelayMid}
              icon={<IoRemoveCircleSharp />}
              {...blockBtnStyle}
              variant={skip ? 'solid' : 'outline'}
              clickHandler={() => actionHandler('update', { field: 'skip', value: !skip })}
              tabIndex={-1}
            />
            <TooltipActionBtn
              tooltip='Start event'
              openDelay={tooltipDelayMid}
              icon={<IoPlay />}
              disabled={skip}
              {...blockBtnStyle}
              variant={selected && playback === 'start' ? 'solid' : 'outline'}
              onClick={() => playbackActions('play')}
              tabIndex={-1}
            />
            <TooltipActionBtn
              tooltip='Load event'
              openDelay={tooltipDelayMid}
              icon={<IoReload />}
              disabled={skip}
              {...blockBtnStyle}
              variant={loaded ? 'solid' : 'outline'}
              onClick={() => playbackActions('load')}
            />
          </div>
          <EventBlockTimers
            timeStart={timeStart}
            timeEnd={timeEnd}
            duration={duration}
            delay={delay}
            actionHandler={actionHandler}
            previousEnd={previousEnd}
          />
          <Editable
            value={blockTitle}
            className={style.eventTitle}
            placeholder='Event title'
            onChange={(value) => setBlockTitle(value)}
            onSubmit={(value) => handleTitle(value)}
          >
            <EditablePreview style={{ width: '100%' }} />
            <EditableInput />
          </Editable>
          <span className={style.eventNote}>{note}</span>
          <div className={style.eventActions}>
            <IconButton
              icon={<IoSettingsSharp />}
              aria-label='event options'
              onClick={() => setOpenId(eventId)}
              {...blockBtnStyle}
              tabIndex={-1}
            />
            <EventBlockActionMenu showAdd showDelay showBlock showClone actionHandler={actionHandler} />
          </div>
          <div className={style.eventStatus}>
            <Tooltip label='Next event' isDisabled={!next} {...tooltipProps}>
              <span
                className={`${style.statusIcon} ${style.statusNext} ${next ? style.enabled : ''}`}
              >
                <IoReturnDownForward />
              </span>
            </Tooltip>
            <Tooltip label='Event has delay' isDisabled={!hasDelay} {...tooltipProps}>
              <span
                className={`${style.statusIcon} ${style.statusDelay} ${
                  hasDelay ? style.enabled : ''
                }`}
              >
                <IoTimerOutline />
              </span>
            </Tooltip>
            <Tooltip
              label={`${isPublic ? 'Event is public' : 'Event is private'}`}
              {...tooltipProps}
            >
              <span
                className={`${style.statusIcon} ${style.statusPublic} ${
                  isPublic ? style.enabled : ''
                }`}
              >
                <FiUsers />
              </span>
            </Tooltip>
          </div>
        </div>
      )}
    </Draggable>
  );
}

EventBlock.propTypes = {
  timeStart: PropTypes.number,
  timeEnd: PropTypes.number,
  duration: PropTypes.number,
  index: PropTypes.number,
  eventIndex: PropTypes.number,
  eventId: PropTypes.string,
  isPublic: PropTypes.bool,
  title: PropTypes.string,
  note: PropTypes.string,
  delay: PropTypes.number,
  previousEnd: PropTypes.number,
  colour: PropTypes.string,
  next: PropTypes.bool,
  skip: PropTypes.bool,
  loaded: PropTypes.bool,
  selected: PropTypes.bool,
  actionHandler: PropTypes.func,
};
