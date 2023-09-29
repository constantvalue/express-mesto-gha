const SERVER_FAILURE = 500;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const CREATED = 201;
const regEx = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;

module.exports = {
  SERVER_FAILURE, BAD_REQUEST, NOT_FOUND, CREATED, regEx,
};
