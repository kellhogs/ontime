import React from 'react';
import PropTypes from 'prop-types';
import { IoAddCircleOutline } from '@react-icons/all-files/io5/IoAddCircleOutline';
import style from './EventBlockNew.module.scss';
import EditableTimer from '../../../common/input/EditableTimer';
import { IconButton } from '@chakra-ui/button';
import { IoRemoveCircleSharp } from '@react-icons/all-files/io5/IoRemoveCircleSharp';
import { IoAdd } from '@react-icons/all-files/io5/IoAdd';
import { IoSettingsSharp } from '@react-icons/all-files/io5/IoSettingsSharp';
import { IoPlay } from '@react-icons/all-files/io5/IoPlay';
import { IoReload } from '@react-icons/all-files/io5/IoReload';
import { IoReorderTwo } from '@react-icons/all-files/io5/IoReorderTwo';
import { Editable, EditableInput, EditablePreview } from '@chakra-ui/editable';
import { getAccessibleColour } from '../../../app/utils/styleUtils';

const blockBtnProps = {
  size: 'sm',
  colorScheme: 'blue',
  variant: 'outline',
  borderRadius: '3px',
  fontSize: '20px',
};

function selectPlaybackStyle(playback) {
  switch (playback) {
    case 'play': return style.play;
    case 'pause': return style.pause;
    default: return ''
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
  const progressStyle = selectPlaybackStyle(state)

  return (
    <div className={style.eventBlock}>
      <div className={`${style.progressBg} ${progressStyle}`}>
        <div className={`${style.progressBar} ${progressStyle}`} style={{ width: `${progress * 100}%` }} />
      </div>
      <div className={style.binder} style={{ ...binderColours }}>
        <IoReorderTwo className={style.drag} />
        {index}
      </div>
      <div className={style.playbackActions}>
        <IconButton icon={<IoRemoveCircleSharp />} aria-label='skip event' {...blockBtnProps} />
        <IconButton icon={<IoPlay />} aria-label='start event' {...blockBtnProps} />
        <IconButton icon={<IoReload />} aria-label='load event' {...blockBtnProps} />
      </div>
      <div className={style.eventTimers}>
        <EditableTimer name='start' actionHandler={() => undefined} validate={() => true} />
        <EditableTimer name='end' actionHandler={() => undefined} validate={() => true} />
        <EditableTimer name='duration' actionHandler={() => undefined} validate={() => true} />
      </div>
      <Editable value='s' className={style.eventTitle}>
        <EditablePreview style={{ width: '100%' }} />
        <EditableInput />
      </Editable>
      <span className={style.eventNote}>Presenter from Foyer entrance 3</span>
      <div className={style.eventActions}>
        <IconButton icon={<IoAdd />} aria-label='add' {...blockBtnProps} />
        <IconButton icon={<IoSettingsSharp />} aria-label='event options' {...blockBtnProps} />
      </div>
      <div className={style.eventStatus}>
        <IoAddCircleOutline fontSize='24px' />
        <IoAddCircleOutline fontSize='24px' />
        <IoAddCircleOutline fontSize='24px' />
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
