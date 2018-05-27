// turn into usefull data

let locations;
let films;
let weekly;

let cinemaByID = {};
let filmByID = {};

const convertLocations = cinemas => {
  return cinemas.reduce((acc, data) => {
    const cinema = {
      slug: data.url[0].replace('http://www1.cineworld.co.uk/cinemas/', ''),
      name: data.name[0].replace('Cineworld ', ''),
      postcode: data.postcode[0] || '',
    };

    cinemaByID[data.id] = cinema.slug;
    acc[cinema.slug] = cinema;

    return acc;
  }, {});
};

const convertFilms = films => {
  return films.reduce((acc, data) => {
    const film = {
      slug: data.url[0].replace('http://www1.cineworld.co.uk/films/', ''),
      title: data.title[0],
      length: data.runningTime[0],
      img: data.posterUrl[0],
      id: data.id[0],
    };

    filmByID[data.id[0]] = film.slug;
    acc[film.slug] = film;

    return acc;
  }, {});
};

const attrs = {
  ST: 'subs',
  AD: 'desc',
  AUT: 'autism',
  CINB: 'babies',
  Box: 'box',
  M4J: 'junior',
  DBOX: 'dbox',
  SS: 'super',
  SKY: 'sky',
  STAR: 'star',
  SC: 'hire',
  VIP: 'vip',
  AC: 'event',
  FEV: 'festival',
  MID: 'midnight',
  PRE: 'unlimited',
  QA: 'qa',
};

const convertAttr = data => {
  let type = '';
  let attr = {};

  const types = {
    '2D': () => (type = '2D' + type),
    '3D': () => (type = '3D' + type),
    '4DX': () => (type = type + '-4DX'),
    IMAX: () => (type = type + '-IMAX'),
  };

  data.split(',').forEach(element => {
    if (types[element]) types[element]();
    if (attrs[element]) attr[attrs[element]] = true;
  });

  return { type, attr };
};

const convertWeekly = screens => {
  return screens.reduce((acc, data) => {
    const cid = cinemaByID[data.cinema[0]];
    const film = filmByID[data.film[0]];

    const { type, attr } = convertAttr(data.attributes[0]);

    acc[cid] = acc[cid] || { ...locations[cid], films: {} };
    acc[cid].films[film] = acc[cid].films[film] || {
      ...films[film],
      screens: {},
    };
    acc[cid].films[film].screens[type] =
      acc[cid].films[film].screens[type] || [];

    acc[cid].films[film].screens[type].push({
      date: data.date[0],
      ...attr,
    });

    return acc;
  }, {});
};

module.exports = data => {
  return new Promise((resolve, reject) => {
    locations = convertLocations(data.feed.cinemas[0].cinema);
    films = convertFilms(data.feed.films[0].film);
    weekly = convertWeekly(data.feed.performances[0].screening);

    resolve({
      // locations,
      // weekly,
      weekly: weekly['birmingham-broad-street'],
    });
  });
};
