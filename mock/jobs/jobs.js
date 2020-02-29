const faker = require('faker');
const candidates = require('./candidates');
const Random = faker.random;
const Company = faker.company;
const Address = faker.address;
const Name = faker.name;

const options = {
  min: 0,
  max: 10000,
  precision: 2,
};

const status = {
  name: 'Awaiting Approval',
  state: 'awaiting-approved',
  createdAt: '45 minutes ago'
};

const statistic = {
  total: Random.number(options),
  new: Random.number(options),
  sourced: Random.number(options),
  Screened: Random.number(options),
  interview: Random.number(options),
  otherStages: Random.number(options),
  views: Random.number(options),
  applicants: Random.number(options),
  conversionRate: Random.number({
    min: 0,
    max: 100,
    precision: 2,
  }) + '%',
};

module.exports = function () {
  let jobs = [];

  for (let i = 0; i < 10; i++) {
    jobs.push({
      id: i,
      name: Name.jobTitle(),
      addr: Address.city(),
      position: Name.jobArea(),
      companyLogo: Random.image(),
      requisitionCode: Random.number({
        min: 100000,
        max: 999999
      }),
      urgencyLevel: 'Critical',
      companyName: Company.companyName(),
      description: Random.words(30, 50),
      status: i === 0 ? status : {
        ...status,
        name: 'Published',
        state: 'published'
      },
      statistic,
      jobType: Name.jobType(),
      experience: Name.jobDescriptor(),
      candidates: candidates.slice(0, 3),
      skills: [{
          id: Random.uuid(),
          name: Random.words(1)
        },
        {
          id: Random.uuid(),
          name: Random.words(1)
        },
        {
          id: Random.uuid(),
          name: Random.words(1)
        },
        {
          id: Random.uuid(),
          name: Random.words(1)
        },
        {
          id: Random.uuid(),
          name: Random.words(1)
        },
      ],
      qualifications: [{
          id: Random.uuid(),
          name: 'Bachelor’s in Accounting or related field.',
          type: 'Education'
        },
        {
          id: Random.uuid(),
          name: 'English Native or Bilingual',
          type: 'Language'
        },
      ],
      template: {
        id: Random.uuid(),
        name: 'Test Template Name'
      },
    });
  }

  return {
    items: jobs
  };
};
