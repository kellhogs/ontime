import React, { useContext, useEffect, useState } from 'react';
import { EVENTS_TABLE } from 'app/api/apiConstants';
import {
  fetchAllEvents,
} from 'app/api/eventsApi.js';
import { useFetch } from 'app/hooks/useFetch.js';
import Empty from 'common/state/Empty';
import EventListMenu from 'features/menu/EventListMenu.jsx';

import { LoggingContext } from '../../../app/context/LoggingContext';

import EventList from './EventList';

import styles from '../Editor.module.scss';

export default function EventListWrapper() {
  const { emitError } = useContext(LoggingContext);
  const { data, status, isError } = useFetch(EVENTS_TABLE, fetchAllEvents);
  const [events, setEvents] = useState(null);

  // Show toasts on errors
  useEffect(() => {
    if (isError) {
      emitError('Error fetching data');
    }
  }, [emitError, isError]);

  // Front end should handle bad arguments
  useEffect(() => {
    if (data == null) return;
    setEvents(data.filter((d) => Object.keys(d).length > 0));
  }, [data]);

  return (
    <>
      <EventListMenu />
      <div className={styles.content}>
        {status === 'success' && events != null ? (
          <EventList events={events} />
        ) : (
          <Empty text='Connecting to server' />
        )}
      </div>
    </>
  );
}
