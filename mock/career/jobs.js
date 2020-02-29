const faker = require('faker');
const Random = faker.random;

module.exports = function () {
  let jobs = [];

  for (let i = 0; i < 12; i++) {
    jobs.push({
      id: Random.uuid(),
      starred: false,
      isNew: (i === 0) || (i === 1),
      type: (i === 0) || (i === 1) ? 'Be an early applicant' : null,
      title: Random.word(4, 8),
      image: Random.image(),
      salary: 'Negotiable',
      description: Random.words(30, 50),
      proposals: Random.number(),
      allProposals: Random.number(),
    });
  }

  return jobs;
};
