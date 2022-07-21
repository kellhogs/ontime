import React, { memo, useCallback, useContext } from 'react';
import PropTypes from 'prop-types';

import { LocalEventSettingsContext } from '../../../app/context/LocalEventSettingsContext';
import { LoggingContext } from '../../../app/context/LoggingContext';
import { useEventAction } from '../../../app/hooks/useEventAction';
import BlockBlock from '../BlockBlock/BlockBlock';
import DelayBlock from '../DelayBlock/DelayBlock';
import EventBlock from '../EventBlock/EventBlock';

const areEqual = (prevProps, nextProps) => {
  return (
    prevProps.data.revision === nextProps.data.revision &&
    prevProps.selected === nextProps.selected &&
    prevProps.next === nextProps.next &&
    prevProps.index === nextProps.index &&
    prevProps.delay === nextProps.delay &&
    prevProps.previousEnd === nextProps.previousEnd
  );
};

const EventListItem = (props) => {
  const { type, index, eventIndex, data, selected, next, delay, previousEnd } = props;
  const { emitError } = useContext(LoggingContext);
  const { starTimeIsLastEnd, defaultPublic } = useContext(LocalEventSettingsContext);
  const { addEvent, updateEvent, deleteEvent } = useEventAction();

  /**
   * @description calculates duration from given options
   * @param {number} start
   * @param {number} end
   * @returns {number}
   */
  const calculateDuration = useCallback(
    (start, end) => (start > end ? end + 86400000 - start : end - start),
    []
  );

  // Create / delete new events
  const actionHandler = useCallback(
    (action, payload) => {
      switch (action) {
        case 'event': {
          const newEvent = {
            type: 'event',
            after: data.id,
            isPublic: defaultPublic,
          };
          const options = {
            startIsLastEnd: starTimeIsLastEnd ? data.id : undefined,
          };
          addEvent(newEvent, options);
          break;
        }
        case 'delay': {
          addEvent({ type: 'delay', after: data.id });
          break;
        }
        case 'block': {
          addEvent({ type: 'block', after: data.id });
          break;
        }
        case 'delete': {
          deleteEvent(data.id);
          break;
        }
        case 'clone': {
          const newEvent = {
            type: 'event',
            after: data.id,
            title: data.title,
            subtitle: data.subtitle,
            presenter: data.presenter,
            note: data.note,
            timeStart: data.timeStart,
            timeEnd: data.timeEnd,
            isPublic: data.isPublic,
            skip: data.skip,
            colour: data.colour,
          };
          addEvent(newEvent);
          break;
        }
        case 'update': {
          // Handles and filters update requests
          const { field, value } = payload;
          const newData = { id: data.id };

          if (field === 'durationOverride') {
            // duration defines timeEnd
            newData.timeEnd = data.timeStart += value;
            updateEvent(newData);
          } else if (field === 'timeStart') {
            newData.duration = calculateDuration(value, data.timeEnd);
            newData.timeStart = value;
            updateEvent(newData);
          } else if (field === 'timeEnd') {
            newData.duration = calculateDuration(data.timeStart, value);
            newData.timeEnd = value;
            updateEvent(newData);
          } else if (field in data) {
            // create object with new field
            newData[field] = value;
            updateEvent(newData);
          } else {
            emitError(`Unknown field: ${field}`);
          }
          break;
        }
        default:
          emitError(`Unknown action called: ${action}`);
          break;
      }
    },
    [
      addEvent,
      calculateDuration,
      data,
      defaultPublic,
      deleteEvent,
      emitError,
      starTimeIsLastEnd,
      updateEvent,
    ]
  );

  switch (type) {
    case 'event':
      return (
        <EventBlock
          timeStart={data.timeStart}
          timeEnd={data.timeEnd}
          duration={data.duration}
          index={index}
          eventIndex={eventIndex + 1}
          eventId={data.id}
          isPublic={data.isPublic}
          skip={data.skip}
          title={data.title}
          note={data.note}
          delay={delay}
          previousEnd={previousEnd}
          colour={data.colour}
          next={next}
          selected={selected}
          actionHandler={actionHandler}
        />
      );
    case 'block':
      return <BlockBlock index={index} data={data} actionHandler={actionHandler} />;
    case 'delay':
      return <DelayBlock index={index} data={data} actionHandler={actionHandler} />;
    default:
      break;
  }
};

export default memo(EventListItem, areEqual);

EventListItem.propTypes = {
  type: PropTypes.oneOf(['event', 'delay', 'block']),
  index: PropTypes.number,
  eventIndex: PropTypes.number,
  data: PropTypes.object,
  selected: PropTypes.bool,
  next: PropTypes.bool,
  delay: PropTypes.number,
  previousEnd: PropTypes.number,
};
