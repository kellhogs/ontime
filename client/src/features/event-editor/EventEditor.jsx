import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Button } from '@chakra-ui/button';
import { Input } from '@chakra-ui/react';
import { FiUsers } from '@react-icons/all-files/fi/FiUsers';

import { EVENTS_TABLE } from '../../app/api/apiConstants';
import { fetchAllEvents } from '../../app/api/eventsApi';
import { EventEditorContext } from '../../app/context/EventEditorContext';
import { LoggingContext } from '../../app/context/LoggingContext';
import { useEventAction } from '../../app/hooks/useEventAction';
import { useFetch } from '../../app/hooks/useFetch';
import TextInput from '../../common/input/TextInput';
import TimeInput from '../../common/input/TimeInput';
import { calculateDuration, validateEntry } from '../../common/utils/timesManager';

import style from './EventEditor.module.scss';

export default function EventEditor() {
  const { openId } = useContext(EventEditorContext);
  const { data } = useFetch(EVENTS_TABLE, fetchAllEvents);
  const { emitWarning, emitError } = useContext(LoggingContext);
  const { updateEvent } = useEventAction();
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

  const handleSubmit = useCallback(
    (field, value) => {
      const newEventData = { id: event.id };

      switch (field) {
        case 'durationOverride': {
          // duration defines timeEnd
          newEventData.timeEnd = event.timeStart += value;
          break;
        }
        case 'timeStart': {
          newEventData.duration = calculateDuration(value, event.timeEnd);
          newEventData.timeStart = value;
          break;
        }
        case 'timeEnd': {
          newEventData.duration = calculateDuration(event.timeStart, value);
          newEventData.timeEnd = value;
          break;
        }
        default: {
          // TODO: memoise event into elemment
          if (field in event) {
            // create object with new field
            newEventData[field] = value;
            break;
          } else {
            emitError(`Unknown field: ${field}`);
            return;
          }
        }
      }
      updateEvent(newEventData);
    },
    [emitError, event, updateEvent]
  );

  const timerValidationHandler = useCallback(
    (entry, val) => {
      const valid = validateEntry(entry, val, event.timeStart, event.timeEnd);
      if (!valid.value) {
        emitWarning(`Time Input Warning: ${valid.catch}`);
      }
      return valid.value;
    },
    [emitWarning, event?.timeStart, event?.timeEnd]
  );

  const togglePublic = useCallback((currentValue) => {
    updateEvent({id: event.id, isPublic: !currentValue})
  },[event?.id, updateEvent])

  if (!event) {
    return 'Loading';
  }

  return (
    <div className={style.eventEditorMenu}>
      <div>
        <div className={style.inline}>
          <label htmlFor='start'>Start time</label>
          <TimeInput
            name='timeStart'
            submitHandler={handleSubmit}
            validationHandler={timerValidationHandler}
            time={event.timeStart}
            delay={0}
            id='start'
          />
        </div>
        <div className={style.inline}>
          <label>End time</label>
          <TimeInput
            name='timeEnd'
            submitHandler={handleSubmit}
            validationHandler={timerValidationHandler}
            time={event.timeEnd}
            delay={0}
          />
        </div>
        <div className={style.inline}>
          <label>Duration</label>
          <TimeInput
            name='duration'
            submitHandler={handleSubmit}
            validationHandler={timerValidationHandler}
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
            onClick={() => togglePublic(event.isPublic)}
          >
            {event.isPublic ? 'Event is Public' : 'Make event public'}
          </Button>
        </div>
      </div>
      <div>
        <div className={style.inline}>
          <label>Colour</label>
          <Input size='sm' type='color' value={event?.colour} />
          <label>
            Title
            <TextInput field='title' initialText={event.title} submitHandler={handleSubmit} />
          </label>
        </div>
        <div className={style.inline}>
          <label>Subtitle</label>
          <TextInput field='subtitle' initialText={event.subtitle} submitHandler={handleSubmit} />
        </div>
        <div className={style.inline}>
          <label>Presenter</label>
          <TextInput field='presenter' initialText={event.presenter} submitHandler={handleSubmit} />
        </div>
        <div className={style.inline}>
          <label>Notes</label>
          <TextInput
            field='note'
            initialText={event.note}
            submitHandler={handleSubmit}
            isTextArea
          />
        </div>
        <div className={style.osc}>{`OSC /ontime/gotoid/${event.id}`}</div>
      </div>
    </div>
  );
}
