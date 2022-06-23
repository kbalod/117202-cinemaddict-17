import dayjs from 'dayjs';
import {MAX_DESCRIPTION_LENGTH, MIN_DESCRIPTION_LENGTH, DESCRIPTION_SLICE_LENGTH} from '../const';
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

const more = (a, b) => {
  if (a < b) {
    return 1;
  }
  return -1;
};

export const formatDescription = (description) => description.length > MAX_DESCRIPTION_LENGTH ? `${description.slice(MIN_DESCRIPTION_LENGTH, DESCRIPTION_SLICE_LENGTH)}...` : description;

const sortByRating = (taskA, taskB) => {
  const a = taskA.filmsInfo.totalRating;
  const b = taskB.filmsInfo.totalRating;
  return more(a,b);
};
const sortByDate = (taskA, taskB) => {
  const a = taskA.filmsInfo.release.date;
  const b = taskB.filmsInfo.release.date;
  return dayjs(b).diff(dayjs(a));
};

const profileRating = {
  MOVIE_BUFF: 21,
  FAN: 11,
};
export const getProfileRating = (item) => {
  if (item >= profileRating.MOVIE_BUFF) {
    return 'Movie Buff';
  } else if (item >= profileRating.FAN && item < profileRating.MOVIE_BUFF) {
    return 'Fan';
  } else if (item > 0 && item < profileRating.FAN) {
    return 'Novice';
  }
  return '';
};

export {getRandomInteger,humanizeDueDateComment,formatMinutesHour,humanizeDueDatePopup,humanizeDueDateFilmCard,updateItem,sortByDate,sortByRating};
