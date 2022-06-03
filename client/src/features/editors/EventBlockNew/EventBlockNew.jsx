import React from 'react';
import PropTypes from 'prop-types';
import EditableTimer from '../../../common/input/EditableTimer';
import { IconButton } from '@chakra-ui/button';
import { Tooltip } from '@chakra-ui/tooltip';
import { IoRemoveCircleSharp } from '@react-icons/all-files/io5/IoRemoveCircleSharp';
import { IoAdd } from '@react-icons/all-files/io5/IoAdd';
import { IoSettingsSharp } from '@react-icons/all-files/io5/IoSettingsSharp';
import { IoLink } from '@react-icons/all-files/io5/IoLink';
import { IoPlay } from '@react-icons/all-files/io5/IoPlay';
import { IoReturnDownForward } from '@react-icons/all-files/io5/IoReturnDownForward';
import { IoTimerOutline } from '@react-icons/all-files/io5/IoTimerOutline';
import { IoReload } from '@react-icons/all-files/io5/IoReload';
import { IoReorderTwo } from '@react-icons/all-files/io5/IoReorderTwo';
import { Editable, EditableInput, EditablePreview } from '@chakra-ui/editable';
import { getAccessibleColour } from '../../../app/utils/styleUtils';
import style from './EventBlockNew.module.scss';
import { millisToMinutes } from '../../../common/utils/dateConfig';
import { stringFromMillis } from '../../../common/utils/time';

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
    isPublic,
    title,
    note,
    delay,
    colour = 'blue',
    state = 'pause',
    selected,
    actionHandler,
  } = props;

  const binderColours = getAccessibleColour(colour);
  const progress = 0.2;
  const progressStyle = selectPlaybackStyle(state);

  const isNext = true;
  const hasDelay = true;
  const hasAutomations = true;

  const delayTime = `${delay >= 0 ? '+' : '-'} ${millisToMinutes(Math.abs(delay))}`;
  const newTime = stringFromMillis(timeStart + delay);

  return (
    <div className={style.eventBlock}>
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
        <IconButton icon={<IoRemoveCircleSharp />} aria-label='skip event' {...blockBtnStyle} />
        <IconButton icon={<IoPlay />} aria-label='start event' {...blockBtnStyle} />
        <IconButton icon={<IoReload />} aria-label='load event' {...blockBtnStyle} />
      </div>
      <div className={style.eventTimers}>
        <EditableTimer name='start' actionHandler={() => undefined} validate={() => true} />
        <EditableTimer name='end' actionHandler={() => undefined} validate={() => true} />
        <EditableTimer name='duration' actionHandler={() => undefined} validate={() => true} />
        {hasDelay && (
          <div className={style.delayNote}>
            {`${delayTime} minutes`}
            <br />
            {`New start: ${newTime}`}
          </div>
        )}
      </div>
      <Editable value='s' className={style.eventTitle}>
        <EditablePreview style={{ width: '100%' }} />
        <EditableInput />
      </Editable>
      <span className={style.eventNote}>Presenter from Foyer entrance 3</span>
      <div className={style.eventActions}>
        <IconButton icon={<IoAdd />} aria-label='add' {...blockBtnStyle} />
        <IconButton icon={<IoSettingsSharp />} aria-label='event options' {...blockBtnStyle} />
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
        <Tooltip label='Event has automations' isDisabled={!hasAutomations} {...tooltipProps}>
          <IoLink
            className={`${style.statusIcon} ${style.statusAutomation} ${
              hasAutomations ? style.enabled : ''
            }`}
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
  selected: PropTypes.bool,
  actionHandler: PropTypes.func,
};
