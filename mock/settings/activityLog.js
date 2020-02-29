const faker = require('faker');
const Random = faker.random;
const Name = faker.name;
const Date = faker.date;
const Phone = faker.phone;
const Internet = faker.internet;

module.exports = function () {
  let activityLog = [];

  for (let i = 0; i < 20; i++) {
    activityLog.push({
      id: Random.uuid(),
      createdAt: Date.past(),
      avatarUrl: Internet.avatar(),
      activity: '@Mark invited @darrewells for Big Data Engineer',
    });
  }

  return activityLog;
}
