import React, { useCallback, useContext } from 'react';
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

import { EventEditorContext } from '../../../app/context/EventEditorContext';
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
  openDelay: 300,
  shouldWrapChildren: 'disabled',
};

function selectPlaybackStyle(playback) {
  switch (playback) {
    case 'play':
      return style.play;
    case 'pause':
      return style.pause;
    default:
      return '';
  }
}

export default function EventBlock(props) {
  const {
    timeStart,
    timeEnd,
    duration,
    index,
    eventId,
    isPublic = true,
    title,
    note,
    delay,
    colour,
    state,
    loaded,
    next,
    skip = false,
    selected,
    actionHandler,
  } = props;

  const { setOpenId } = useContext(EventEditorContext);

  const binderColours = getAccessibleColour(colour);
  const progress = 0.2;
  const progressStyle = selectPlaybackStyle(state);
  const hasDelay = delay !== 0 && delay !== null;

  const handleTitle = useCallback(
    (text) => {
      if (text === title || !text) {
        return;
      }

      const cleanVal = text.trim();
      actionHandler('update', { field: 'title', value: cleanVal });
    },
    [actionHandler, title]
  );

  return (
    <div className={`${style.eventBlock} ${skip ? style.skip : ''}`}>
      <div className={`${style.progressBg} ${progressStyle}`}>
        <div
          className={`${style.progressBar} ${progressStyle}`}
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <div className={style.binder} style={{ ...binderColours }}>
        <IoReorderTwo className={style.drag} />
        {index}
      </div>
      <div className={style.playbackActions}>
        <TooltipActionBtn
          tooltip='Skip event'
          openDelay={300}
          icon={<IoRemoveCircleSharp />}
          {...blockBtnStyle}
          variant={skip ? 'solid' : 'outline'}
          clickHandler={actionHandler('skip')}
        />
        <TooltipActionBtn
          tooltip='Start event'
          openDelay={300}
          icon={<IoPlay />}
          disabled={skip}
          {...blockBtnStyle}
          variant={state === 'play' ? 'solid' : 'outline'}
          onClick={() => actionHandler('play')}
        />
        <TooltipActionBtn
          tooltip='Load event'
          openDelay={300}
          icon={<IoReload />}
          disabled={skip}
          {...blockBtnStyle}
          variant={loaded ? 'solid' : 'outline'}
          onClick={() => actionHandler('load')}
        />
      </div>
      <EventBlockTimers timeStart={timeStart} timeEnd={timeEnd} duration={duration} delay={delay} />
      <Editable
        defaultValue={title}
        className={style.eventTitle}
        placeholder='Event title'
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
        />
        <EventBlockActionMenu showAdd showDelay showBlock actionHandler={actionHandler} />
      </div>
      <div className={style.eventStatus}>
        <Tooltip label='Next event' isDisabled={!next} {...tooltipProps}>
          <IoReturnDownForward
            className={`${style.statusIcon} ${style.statusNext} ${next ? style.enabled : ''}`}
          />
        </Tooltip>
        <Tooltip label='Event has delay' isDisabled={!hasDelay} {...tooltipProps}>
          <IoTimerOutline
            className={`${style.statusIcon} ${style.statusDelay} ${hasDelay ? style.enabled : ''}`}
          />
        </Tooltip>
        <Tooltip label={`${isPublic ? 'Event is public' : 'Event is private'}`} {...tooltipProps}>
          <FiUsers
            className={`${style.statusIcon} ${style.statusPublic} ${isPublic ? style.enabled : ''}`}
          />
        </Tooltip>
      </div>
    </div>
  );
}

EventBlock.propTypes = {
  timeStart: PropTypes.number,
  timeEnd: PropTypes.number,
  duration: PropTypes.number,
  index: PropTypes.number,
  eventId: PropTypes.string,
  isPublic: PropTypes.bool,
  title: PropTypes.string,
  state: PropTypes.oneOf(['play', 'pause']),
  note: PropTypes.string,
  delay: PropTypes.number,
  colour: PropTypes.string,
  next: PropTypes.bool,
  skip: PropTypes.bool,
  loaded: PropTypes.bool,
  selected: PropTypes.bool,
  actionHandler: PropTypes.func,
};
