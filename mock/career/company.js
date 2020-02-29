const faker = require('faker');
const Random = faker.random;
const Company = faker.company;
const Address = faker.address;

module.exports = function () {
  return {
    id: Random.uuid(),
    logo: Random.image(),
    name: Company.companyName(),
    type: Random.word(4, 8),
    location: Address.city(),
  };
};
