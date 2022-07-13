/**
 * @description Returns id of previous played event
 * @param {array} events
 * @param {string} eventId
 * @return {object | null}
 */
export function getPreviousPlayable(events, eventId) {
  // find current index
  const current = events.findIndex((event) => event.id === eventId);

  if (current === -1) {
    return null;
  }

  let index = current - 1;
  while (index >= 0) {
    const event = events[index];
    if (event.type === 'event' && !event.skip) {
      return { index, id: event.id };
    }
    index--;
  }

  return null;
}
