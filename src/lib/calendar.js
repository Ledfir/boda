import { weddingConfig } from '@/config/wedding';

const EVENT_DURATION_HOURS = 8;

function toCalendarStamp(isoWithOffset) {
  return `${isoWithOffset.replace(/[-:]/g, '').replace(/\.\d+/, '')}`;
}

export function eventDateRange() {
  const start = new Date(weddingConfig.date.iso);
  const end = new Date(start.getTime() + EVENT_DURATION_HOURS * 60 * 60 * 1000);
  return { start, end };
}

export const calendarEvent = {
  title: `Boda de ${weddingConfig.couple.display}`,
  details: `Ceremonia en ${weddingConfig.ceremony.venue} y recepción en ${weddingConfig.reception.venue}.`,
  location: `${weddingConfig.ceremony.venue} — ${weddingConfig.ceremony.address}`,
};

export function googleCalendarUrl() {
  const { start, end } = eventDateRange();
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: calendarEvent.title,
    details: calendarEvent.details,
    location: calendarEvent.location,
    dates: `${toCalendarStamp(start.toISOString())}/${toCalendarStamp(end.toISOString())}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function outlookCalendarUrl() {
  const { start, end } = eventDateRange();
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: calendarEvent.title,
    body: calendarEvent.details,
    location: calendarEvent.location,
    startdt: start.toISOString(),
    enddt: end.toISOString(),
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

export function downloadIcsFile() {
  const { start, end } = eventDateRange();
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Invitacion Digital//Boda//ES',
    'BEGIN:VEVENT',
    `UID:${weddingConfig.invitacionId}@invitacion`,
    `DTSTAMP:${toCalendarStamp(new Date().toISOString())}`,
    `DTSTART:${toCalendarStamp(start.toISOString())}`,
    `DTEND:${toCalendarStamp(end.toISOString())}`,
    `SUMMARY:${calendarEvent.title}`,
    `DESCRIPTION:${calendarEvent.details}`,
    `LOCATION:${calendarEvent.location}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'boda.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}