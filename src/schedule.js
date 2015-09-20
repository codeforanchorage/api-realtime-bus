'use strict';

var later = require('later');
var activebuses;
var occurrences;

module.exports.schedulejob = function(job) {

  later.date.localTime(); // Set local clock time

  activebuses = { schedules: [
  { dw: [2,3,4,5,6], // M-F
  h: [6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22],
  m: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,
  24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,
  46,47,48,49,50,51,52,53,54,55,56,57,58,59,],},
  { dw: [0], // Saturday
  h: [7,8,9,10,11,12,13,14,15,16,17,18,19,20,21],
  m: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,
  24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,
  46,47,48,49,50,51,52,53,54,55,56,57,58,59,],},
  { dw: [1], // Sunday
  h: [9,10,11,12,13,14,15,16,17,18,19],
  m: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,
  24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,
  46,47,48,49,50,51,52,53,54,55,56,57,58,59,],},],
  exceptions: [],};  // TODO - Add holiday and closure dates

  function listSchedule() {
    occurrences = later.schedule(daily).next(15);

    for (var i = 0; i < 15; i++) {
      console.log(occurrences[i]);
    }
  }

  // Execute logTime for each occurrence of the text schedule
  return later.setInterval(job, activebuses);

};
