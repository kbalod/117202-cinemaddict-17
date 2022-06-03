import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import {getRandomInteger,formatMinutesHour} from '../utils/utils.js';

const generateTitleFilm = () => {
  const title = ['Ирония судьбы','Иван Васильевич меняет профессию','Приключения Шурика'];
  const randomIndex = getRandomInteger(0, title.length - 1);
  return title[randomIndex];
};
const generateAlternativeTitleFilm = () => {
  const alternativeTitle = ['Терминатор','Бой с тенью','Золотой компос',];
  const randomIndex = getRandomInteger(0, alternativeTitle.length - 1);
  return alternativeTitle[randomIndex];
};
const generatePosterFilm = () => {
  const poster = ['the-dance-of-life.jpg','santa-claus-conquers-the-martians.jpg','sagebrush-trail.jpg',];
  const randomIndex = getRandomInteger(0, poster.length - 1);
  return poster[randomIndex];
};
const generateDescriptionFilm = () => {
  const description = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    'Cras aliquet varius magna, non porta ligula feugiat eget',
    'Fusce tristique felis at fermentum pharetra',
    'Aliquam id orci ut lectus varius viverra',
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante'
  ];
  return description.slice(0,getRandomInteger(1, description.length - 1)).join('.');
};
const generateGenresFilm = () => {
  const genres = ['Комедия','Драма','Детектив'];
  return genres.slice(0,getRandomInteger(1, genres.length - 1));
};

const generateRandomPeople = () =>{
  const author = ['Мартин Скорсезе','Илья Найтшулер','Джони Браво','Алекс Рубен','Джони Депп','Морган Фриман'];
  const randomIndex = getRandomInteger(0, author.length - 1);
  return author[randomIndex];
};

const generateReleaseCountry = () => {
  const releaseCountry = ['Испания','Эстония','Германия'];
  const randomIndex = getRandomInteger(0, releaseCountry.length - 1);
  return releaseCountry[randomIndex];
};

const generateComment = () =>{
  const comment = ['Фильм хороший','Фильм нормальный','Фильм ужасный'];
  const randomIndex = getRandomInteger(0, comment.length - 1);
  return comment[randomIndex];
};

const generateEmotion = () =>{
  const emotion = ['smile', 'sleeping', 'puke', 'angry'];
  const randomIndex = getRandomInteger(0, emotion.length - 1);
  return emotion[randomIndex];
};
const generateData = () => {
  const maxDaysGap = 360;
  const daysGap = getRandomInteger(-maxDaysGap,maxDaysGap);
  return dayjs().add(daysGap, 'day').toDate();
};
const generateRandomBoolean = () => Boolean(getRandomInteger(0,1));

const generateOneComment = (id) =>({
  id: id,
  author : generateRandomPeople(),
  comment : generateComment(),
  date : generateData(),
  emotion : generateEmotion()
});
export const generateComments = (data) => {
  const array = [];
  for(let i = 0;i < data.length;i++){
    array.push(generateOneComment(data[i]));
  }
  return array;
};

const generateCommentsArray = () => Array.from({length: getRandomInteger(0,5)},()=> getRandomInteger(1,1000));


export const generateFilmsCard = () =>({
  id: nanoid(),
  comments: generateCommentsArray(),
  filmsInfo:{
    title: generateTitleFilm(),
    alternativeTitle: generateAlternativeTitleFilm(),
    totalRating: (Math.random()*10).toFixed(1),
    poster: generatePosterFilm(),
    ageRating: Math.ceil(Math.random()*18),
    director: generateRandomPeople(),
    writers: [generateRandomPeople()],
    actors: generateRandomPeople(),
    release: {
      date: generateData(),
      releaseCountry: generateReleaseCountry(),
    },
    runtime: formatMinutesHour(Math.ceil(Math.random()*100)),
    genre: generateGenresFilm(),
    description: generateDescriptionFilm(),
  },
  userDetails: {
    watchList: generateRandomBoolean(),
    alreadyWatched: generateRandomBoolean(),
    watchingDate: generateData(),
    favorite: generateRandomBoolean()
  }
});

