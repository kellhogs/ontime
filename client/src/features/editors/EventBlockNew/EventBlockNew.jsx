import React from 'react';
import PropTypes from 'prop-types';
import style from './EventBlockNew.module.scss';

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
    <>
      <div className={style.progressBg} />

      <div className={style.eventBlock}>
        <div className={style.binder}>
          {index}
          <div className={style.drag} />
        </div>
        <div className={style.playbackActions}>Playback Actions</div>
        <div className={style.eventInfo}>
          <div>Time</div>
          <div>Title</div>
          <div>Note</div>
        </div>
        <div className={style.eventOptions}>
          <div className={style.eventIcons}>Event Icons</div>
          <div className={style.eventActions}>Event Actions</div>
        </div>
      </div>
    </>
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