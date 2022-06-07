import React, { useContext } from 'react';
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

import EventBlockActionMenu from './composite/EventBlockActionMenu';
import EventBlockTimers from './composite/EventBlockTimers';

import style from './EventBlockNew.module.scss';

const blockBtnStyle = {
  size: 'sm',
  colorScheme: 'blue',
  variant: 'outline',
  borderRadius: '3px',
  fontSize: '20px',
};

const tooltipProps = {
  openDelay: 100,
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

export default function EventBlockNew(props) {
  const {
    timeStart,
    timeEnd,
    duration,
    index,
    isPublic = true,
    title,
    note,
    delay,
    colour = 'blue',
    state = 'play',
    loaded = true,
    skip = false,
    selected,
    actionHandler,
  } = props;

  const { toggleOpen } = useContext(EventEditorContext);

  const binderColours = getAccessibleColour(colour);
  const progress = 0.2;
  const progressStyle = selectPlaybackStyle(state);

  const isNext = true;
  const hasDelay = delay !== 0 && delay !== null;

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
        <IconButton
          icon={<IoRemoveCircleSharp />}
          aria-label='skip event'
          {...blockBtnStyle}
          variant={skip ? 'solid' : 'outline'}
        />
        <IconButton
          icon={<IoPlay />}
          disabled={skip}
          aria-label='start event'
          {...blockBtnStyle}
          variant={state === 'play' ? 'solid' : 'outline'}
        />
        <IconButton
          icon={<IoReload />}
          disabled={skip}
          aria-label='load event'
          {...blockBtnStyle}
          variant={loaded ? 'solid' : 'outline'}
        />
      </div>
      <EventBlockTimers timeStart={timeStart} timeEnd={timeEnd} duration={duration} delay={delay} />
      <Editable value='s' className={style.eventTitle}>
        <EditablePreview style={{ width: '100%' }} />
        <EditableInput />
      </Editable>
      <span className={style.eventNote}>Presenter from Foyer entrance 3</span>
      <div className={style.eventActions}>
        <IconButton
          icon={<IoSettingsSharp />}
          aria-label='event options'
          onClick={() => toggleOpen()}
          {...blockBtnStyle}
        />
        <EventBlockActionMenu showAdd showDelay showBlock actionHandler={actionHandler} />
      </div>
      <div className={style.eventStatus}>
        <Tooltip label='Next event' isDisabled={!isNext} {...tooltipProps}>
          <IoReturnDownForward
            className={`${style.statusIcon} ${style.statusNext} ${isNext ? style.enabled : ''}`}
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

EventBlockNew.propTypes = {
  timeStart: PropTypes.number,
  timeEnd: PropTypes.number,
  duration: PropTypes.number,
  index: PropTypes.number,
  isPublic: PropTypes.bool,
  title: PropTypes.string,
  state: PropTypes.oneOf(['play', 'pause']),
  note: PropTypes.string,
  delay: PropTypes.number,
  colour: PropTypes.string,
  skip: PropTypes.bool,
  loaded: PropTypes.bool,
  selected: PropTypes.bool,
  actionHandler: PropTypes.func,
};
