export function isEventType<E extends { type: string }, T extends string>(
  event: E,
  type: T
): event is Extract<E, { type: T }> {
  return event.type === type
}
