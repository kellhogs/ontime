import React from 'react';
import PropTypes from 'prop-types';
import { IoAddCircleOutline } from "@react-icons/all-files/io5/IoAddCircleOutline";
import style from './EventBlockNew.module.scss';
import EditableTimer from '../../../common/input/EditableTimer';
import { IconButton } from '@chakra-ui/button';

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
    selected,
    actionHandler,
  } = props;

  return (
    <div className={style.eventBlock}>
      <div className={style.progressBg} style={{ width: '80%' }} />
      <div className={style.binder}>
        {index}
        <div className={style.drag} />
      </div>
      <div className={style.playbackActions}>
        <IoAddCircleOutline />
        <IoAddCircleOutline />
        <IoAddCircleOutline />
      </div>
      <div className={style.eventInfo}>
        <div className={style.eventTimers}>
          <EditableTimer name="start" actionHandler={() => undefined} validate={() => true} />
          <EditableTimer name="end" actionHandler={() => undefined} validate={() => true} />
          <EditableTimer name="duration" actionHandler={() => undefined} validate={() => true} />
        </div>
        <span className={style.eventTitle}>Title</span>
        <span className={style.eventNote}>Note</span>
      </div>
      <div className={style.eventOptions}>
        <div className={style.eventPlayback}>
          <IconButton aria-label="none"  size='xs' />
          <IconButton aria-label="none"  size='xs' />
          <IconButton aria-label="none"  size='xs' />
        </div>
        <div className={style.eventActions}>
          <IconButton aria-label="none"  size='xs' />
          <IconButton aria-label="none"  size='xs' />
        </div>
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
  note: PropTypes.string,
  delay: PropTypes.number,
  selected: PropTypes.bool,
  actionHandler: PropTypes.func,
};