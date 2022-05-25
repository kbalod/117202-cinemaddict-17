import dayjs from 'dayjs';
const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const humanizeDueDateComment = (dueDate) => dayjs(dueDate).format('YYYY/M/D HH:mm');
const humanizeDueDatePopup = (dueDate) => dayjs(dueDate).format('DD MMMM YYYY');
const humanizeDueDateFilmCard = (dueDate) => dayjs(dueDate).format('YYYY');

function formatMinutesHour(value) {
  let minuteTime = parseInt(value, 10);
  let hourTime = 0;
  if(minuteTime > 60) {
    hourTime = parseInt(minuteTime / 60, 10);
    minuteTime = parseInt(minuteTime % 60, 10);
  }
  let result = `${parseInt(minuteTime, 10)}m`;
  if(hourTime > 0) {
    result = `${parseInt(hourTime, 10)}h${result}`;
  }
  return result;
}

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

export {getRandomInteger,humanizeDueDateComment,formatMinutesHour,humanizeDueDatePopup,humanizeDueDateFilmCard,updateItem};
