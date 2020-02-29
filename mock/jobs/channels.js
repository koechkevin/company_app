const random = require('lodash/random');
const candidates = require('./candidates');
const faker = require('faker');

const pipelines = [
  {
    name: 'Incomplete',
    count: 345,
    candidates: candidates.slice(0, 3)
  },
  {
    name: 'New Leads',
    count: 300,
    candidates: candidates.slice(3, candidates.length)
  }
];

const statistic = {
  jobStages: [
    {
      event: '',
      count: 15,
      status: 'Last Update',
      date: '3 days ago'
    },
    {
      event: 'In Review',
      count: 11,
      status: '',
      date: ''
    },
    {
      event: 'Phone Interview',
      count: 15,
      status: '3 interviews',
      date: 'today'
    },
    {
      event: 'Technical Test',
      count: 2,
      status: '1 finished',
      date: ''
    }
  ],
  conversions: [
    {
      event: 'views',
      count: 215,
      status: 'Last Update',
      date: '3 days ago'
    },
    {
      event: 'Applicants',
      count: 21,
      status: '',
      date: ''
    },
    {
      event: 'Retained',
      count: 2,
      status: '3 Interviews',
      date: 'today'
    },
    {
      event: 'Conversion',
      count: '10%',
      status: '1 finished',
      date: ''
    }
  ]
};

const replies = [];

for (let i = 0; i < 20; i++) {
  replies.push({
    id: faker.random.number(),
    type: 'REPLY',
    sentAt: faker.date.past(),
    author: candidates[random(0, candidates.length - 1)],
    text: faker.lorem.sentence(),
  });
}

const messages = [];

for (let i = 0; i < 50; i++) {
  const rand = random(0, 9);
  messages.push({
    id: faker.random.number(),
    type: random(0, 9) > 7 ? 'PRIVATE' : 'NORMAL',
    sentAt: faker.date.past(),
    author: candidates[random(0, candidates.length - 1)],
    text: faker.lorem.sentences(),
    replies: rand < 5 ? [] : replies.slice(random(5, 10), random(10, replies.length - 1)),
  });
}

const channels = [
  {
    id: faker.random.uuid(),
    name: 'pool',
    type: 'job-channel',
    pipelines: pipelines,
    members: candidates.slice(random(0, candidates.length - 1), candidates.length),
    statistic,
    starred: true,
    locked: false,
    messages: messages.slice(random(0, 20), random(20, messages.length - 1)),
    author: candidates[random(0, candidates.length - 1)],
    createdAt: faker.date.past(),
  },
  {
    id: faker.random.uuid(),
    name: 'big data engineer',
    type: 'job-channel',
    pipelines: pipelines,
    members: candidates.slice(random(0, candidates.length - 1), candidates.length),
    statistic,
    starred: true,
    locked: false,
    messages: messages.slice(random(0, 20), random(20, messages.length - 1)),
    author: candidates[random(0, candidates.length - 1)],
    createdAt: faker.date.past(),
  },
  {
    id: faker.random.uuid(),
    name: 'junior developers',
    type: 'job-channel',
    pipelines: pipelines,
    members: candidates.slice(random(0, candidates.length - 1), candidates.length),
    statistic,
    starred: true,
    locked: true,
    messages: messages.slice(random(0, 20), random(20, messages.length - 1)),
    author: candidates[random(0, candidates.length - 1)],
    createdAt: faker.date.past(),
  },
  {
    id: faker.random.uuid(),
    name: 'pool',
    type: 'job-channel',
    pipelines: pipelines,
    members: candidates.slice(random(0, candidates.length - 1), candidates.length),
    statistic,
    starred: false,
    locked: false,
    messages: messages.slice(random(0, 20), random(20, messages.length - 1)),
    author: candidates[random(0, candidates.length - 1)],
    createdAt: faker.date.past(),
  },
  {
    id: faker.random.uuid(),
    name: 'designer',
    type: 'job-channel',
    pipelines: pipelines,
    members: candidates.slice(random(0, candidates.length - 1), candidates.length),
    statistic,
    starred: false,
    locked: false,
    messages: messages.slice(random(0, 20), random(20, messages.length - 1)),
    author: candidates[random(0, candidates.length - 1)],
    createdAt: faker.date.past(),
  }
];

module.exports = () => channels;
