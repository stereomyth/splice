// turn into usefull data

let locations;
let films;

let cinemaByID = {};
let filmByID = {};

const urlMask = 'http://www1.cineworld.co.uk/';
const posterMask = `${urlMask}xmedia-cw/repo/feats/posters/`;

const convertLocations = cinemas => {
  return cinemas.reduce((acc, data) => {
    const cinema = {
      slug: data.url[0].replace(`${urlMask}cinemas/`, ''),
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
      slug: data.url[0].replace(`${urlMask}films/`, ''),
      title: data.title[0],
      length: data.runningTime[0],
      img: data.posterUrl[0].replace(posterMask, ''),
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

    if (type) {
      acc[cid].films[film].screens[type] =
        acc[cid].films[film].screens[type] || [];

      acc[cid].films[film].screens[type].push({
        date: data.date[0],
        ...attr,
      });
    }

    return acc;
  }, {});
};

const flatten = data => {
  Object.keys(data).map(location => {
    data[location].films = Object.values(data[location].films);
  });

  return data;
};

module.exports = data => {
  return new Promise((resolve, reject) => {
    locations = convertLocations(data.feed.cinemas[0].cinema);
    films = convertFilms(data.feed.films[0].film);
    const weekly = convertWeekly(data.feed.performances[0].screening);

    resolve(flatten(weekly));
  });
};
