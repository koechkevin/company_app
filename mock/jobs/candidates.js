const faker = require('faker');

const candidates = [
  {
    id: 1,
    name: 'Mark Neuner',
    tag: 'Draft',
    position: null,
    addr: null,
    specialists: [],
    completed: false,
    via: null,
    viaDate: null,
    avatar: faker.image.avatar(),
    isRobot: false
  },
  {
    id: 2,
    name: 'johnsmith.pdf',
    tag: 'Temp',
    position: null,
    addr: null,
    specialists: [],
    completed: false,
    via: null,
    viaDate: null,
    avatar: faker.image.avatar(),
    status: 'online',
    inCall: true,
    isRobot: false
  },
  {
    id: 3,
    name: 'Nora Wile',
    tag: 'Draft',
    position: 'Accounts Specialist',
    addr: 'San Bernardino, CA',
    specialists: [],
    completed: false,
    via: null,
    viaDate: null,
    avatar: faker.image.avatar(),
    status: 'online',
    inCall: false,
    isRobot: false
  },
  {
    id: 4,
    name: 'Stefan Neuner',
    tag: 'New',
    position: 'Accounts Receivable',
    addr: 'San Bernardino, CA',
    specialists: ['engineering', 'technical knowledge', 'systems integration'],
    completed: true,
    via: 'Ann Stevenson',
    viaDate: 'about 1 month ago',
    avatar: faker.image.avatar(),
    status: 'online',
    inCall: true,
    isRobot: false
  },
  {
    id: 5,
    name: 'Dave Thompson',
    tag: 'New',
    position: 'Full-Stack Developer ',
    addr: 'San Bernardino, CA',
    specialists: ['engineering', 'technical knowledge'],
    completed: true,
    via: null,
    viaDate: null,
    avatar: faker.image.avatar(),
    status: 'offline',
    inCall: false,
    isRobot: false
  },
  {
    id: 6,
    name: 'Ann Stevenson',
    tag: 'Top Match',
    position: 'Full-Stack Developer ',
    addr: 'San Bernardino, CA',
    specialists: ['functional programming', 'technical knowledge', 'unit test'],
    completed: true,
    via: null,
    viaDate: null,
    avatar: faker.image.avatar(),
    status: 'offline',
    inCall: false,
    isRobot: false
  }
];

module.exports = candidates;
