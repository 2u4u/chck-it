// write function which takes a cron string and returns a human readable string
export const prettifyCron = (cronString) => {
  const cronArray = cronString.split(' ');
  if (cronArray.length === 5) {
    const [minute, hour, dayOfMonth, month, dayOfWeek] = cronString.split(' ');

    const minuteText = prettifyCronField(minute, 'minute');
    const hourText = prettifyCronField(hour, 'hour');
    const dayOfMonthText = prettifyCronField(dayOfMonth, 'day of month');
    const monthText = prettifyCronField(month, 'month');
    const dayOfWeekText = prettifyCronField(dayOfWeek, 'day of week');

    return `${minuteText}, ${hourText}, ${dayOfMonthText}, ${monthText}, ${dayOfWeekText}`;
  } else if (cronArray.length === 6) {
    const [second, minute, hour, dayOfMonth, month, dayOfWeek] = cronString.split(' ');

    const secondText = prettifyCronField(second, 'second');
    const minuteText = prettifyCronField(minute, 'minute');
    const hourText = prettifyCronField(hour, 'hour');
    const dayOfMonthText = prettifyCronField(dayOfMonth, 'day of month');
    const monthText = prettifyCronField(month, 'month');
    const dayOfWeekText = prettifyCronField(dayOfWeek, 'day of week');

    return `${secondText}, ${minuteText}, ${hourText}, ${dayOfMonthText}, ${monthText}, ${dayOfWeekText}`;
  }
}

const prettifyCronField = (fieldValue, fieldName) => {
  if (fieldValue === '*') {
    return `every ${fieldName}`;
  }

  const values = fieldValue.split(',');
  if (values.length === 1) {
    return `on ${describeCronValue(values[0], fieldName)}`;
  }

  const ranges = values.map((value) => describeCronValue(value, fieldName));
  const lastRange = ranges.pop();

  return `on ${ranges.join(', ')} and ${lastRange}`;  
}

const describeCronValue = (value, fieldName) => {
  if (value === '*') {
    return `every ${fieldName}`;
  }

  if (value.includes('/')) {
    const [start, step] = value.split('/');
    return `every ${step} ${fieldName} starting from ${start}`;
  }

  if (value.includes('-')) {
    const [start, end] = value.split('-');
    return `every ${fieldName} from ${start} to ${end}`;
  }

  return `every ${value} ${fieldName}`;
}