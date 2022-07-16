import React, { useContext, useEffect, useState } from 'react';
import { Button, IconButton } from '@chakra-ui/button';
import { Input, Textarea } from '@chakra-ui/react';
import { FiUsers } from '@react-icons/all-files/fi/FiUsers';
import { IoCloseCircle } from '@react-icons/all-files/io5/IoCloseCircle';

import { EVENTS_TABLE } from '../../app/api/apiConstants';
import { fetchAllEvents } from '../../app/api/eventsApi';
import { EventEditorContext } from '../../app/context/EventEditorContext';
import { useFetch } from '../../app/hooks/useFetch';
import TimeInput from '../../common/input/TimeInput';

import style from './EventEditor.module.scss';

export default function EventEditor() {
  const { openId, toggleOpen } = useContext(EventEditorContext);
  const { data } = useFetch(EVENTS_TABLE, fetchAllEvents);
  const [event, setEvent] = useState(null);

  useEffect(() => {
    if (!data || !openId) {
      return;
    }

    const event = data.find((event) => event.id === openId);
    if (event) {
      setEvent(event);
    }
  }, [data, openId]);

  if (event === null) {
    return 'Loading';
  }

  console.log(event);
  return (
    <div className={style.eventEditorMenu}>
      <IconButton
        aria-label='Close panel'
        icon={<IoCloseCircle />}
        onClick={() => toggleOpen(false) }
      />
      <div>
        <div className={style.inline}>
          <label htmlFor='start'>Start time</label>
          <TimeInput
            name='start'
            actionHandler={() => undefined}
            validate={() => true}
            time={event.timeStart}
            delay={0}
            id='start'
          />
        </div>
        <div className={style.inline}>
          <label>End time</label>
          <TimeInput
            name='end'
            actionHandler={() => undefined}
            validate={() => true}
            time={event.timeEnd}
            delay={0}
          />
        </div>
        <div className={style.inline}>
          <label>Duration</label>
          <TimeInput
            name='duration'
            actionHandler={() => undefined}
            validate={() => true}
            time={event.duration}
            delay={0}
          />
        </div>
        <div>
          <Button
            leftIcon={<FiUsers />}
            size='sm'
            colorScheme='blue'
            variant={event.isPublic ? 'solid' : 'outline'}
          >
            {event.isPublic ? 'Event is Public' : 'Make event public'}
          </Button>
        </div>
      </div>
      <div>
        <div className={style.inline}>
          <label>Colour</label>
          <Input size='sm' type='color' value={event?.colour} />
          <label>Title</label>
          <Input size='sm' value={event.title} />
        </div>
        <div className={style.inline}>
          <label>Subtitle</label>
          <Input size='sm' value={event.subtitle} />
        </div>
        <div className={style.inline}>
          <label>Presenter</label>
          <Input size='sm' value={event.presenter} />
        </div>
        <div className={style.inline}>
          <label>Notes</label>
          <Textarea size='sm' value={event.note} />
        </div>
        <div className={style.osc}>{`OSC /ontime/gotoid/${event.id}`}</div>
      </div>
    </div>
  );
}
