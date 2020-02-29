const auth = require('./auth');
const channels = require('./jobs/channels');
const jobs = require('./jobs/jobs');
const career = require('./career/jobs');
const company = require('./career/company');
const profile = require('./settings/profile');
const activityLog = require('./settings/activityLog');

module.exports = function () {
  return {
    auth: auth(),
    jobs: jobs(),
    career: career(),
    company: company(),
    profile: profile(),
    channels: channels(),
    activityLog: activityLog(),
  };
};
