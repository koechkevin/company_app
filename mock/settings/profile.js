const faker = require('faker');
const Random = faker.random;
const Name = faker.name;
const Date = faker.date;
const Phone = faker.phone;
const Internet = faker.internet;

module.exports = function () {
  return {
    id: 1,
    username: Name.findName(),
    email: Internet.email(),
    createdAt: Date.past(),
    jobTitle: Name.jobTitle(),
    avatarUrl: Internet.avatar(),
    displayName: Name.firstName(),
    phone: Phone.phoneNumber(),
    mobile: Phone.phoneNumber(),
  };
}
