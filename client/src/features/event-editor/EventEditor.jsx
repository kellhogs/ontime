import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Button } from '@chakra-ui/button';
import { Editable, EditableInput, EditablePreview } from '@chakra-ui/editable';
import { EditableTextarea, Input, Textarea } from '@chakra-ui/react';
import { FiUsers } from '@react-icons/all-files/fi/FiUsers';

import { EVENTS_TABLE } from '../../app/api/apiConstants';
import { fetchAllEvents } from '../../app/api/eventsApi';
import { EventEditorContext } from '../../app/context/EventEditorContext';
import { LoggingContext } from '../../app/context/LoggingContext';
import { useEventAction } from '../../app/hooks/useEventAction';
import { useFetch } from '../../app/hooks/useFetch';
import TextInput from '../../common/input/TextInput';
import TimeInput from '../../common/input/TimeInput';
import { calculateDuration } from '../../common/utils/timesManager';

import style from './EventEditor.module.scss';

export default function EventEditor() {
  const { openId } = useContext(EventEditorContext);
  const { data } = useFetch(EVENTS_TABLE, fetchAllEvents);
  const { emitError } = useContext(LoggingContext);
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
          newEventData.timeEnd = data.timeStart += value;
          break;
        }
        case 'timeStart': {
          newEventData.duration = calculateDuration(value, data.timeEnd);
          newEventData.timeStart = value;
          break;
        }
        case 'timeEnd': {
          newEventData.duration = calculateDuration(data.timeStart, value);
          newEventData.timeEnd = value;
          break;
        }
        default: {
          if (field in event) {
            // create object with new field
            console.log('title should go here', field, event)
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
    [data, emitError, event, updateEvent]
  );

  if (!event) {
    return 'Loading';
  }

  console.log(event);
  return (
    <div className={style.eventEditorMenu}>
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
          <TextInput field='note' initialText={event.note} submitHandler={handleSubmit} isTextArea />
        </div>
        <div className={style.osc}>{`OSC /ontime/gotoid/${event.id}`}</div>
      </div>
    </div>
  );
}
