// React Libraries
import React from 'react';
import Scheduler, { Resource } from 'devextreme-react/scheduler';


// Pull from database
const link = 'https://cop4331-ucaf1.herokuapp.com/user/getClasses';

async function getTimes() {
  let classes = (await getUserInfo(localStorage.getItem('a'), localStorage.getItem('b') ));
  console.log(classes.Classes);
  classes = classes.Classes;

  const times = [];

  for (let i = 0; i < classes.length; i++) {
    const time = formatTime(classes[i].Times);
    const obj = {
      Title: classes[i].Title,
      Time: time
    };
    times.push(obj);
  }

  return times;
}

async function getUserInfo (id, tokens) {
  const response = await fetch(`${link}/${id}/${tokens}`);
  const data = await response.json();
  //console.log(data);
  return data;
};

function formatTime(string) {
  const days = {
    M: 'Monday',
    T: 'Tuesday',
    W: 'Wednesday',
    R: 'Thursday',
    F: 'Friday',
    S: 'Saturday',
    U: 'Sunday'
  };

  let daysArray = [];
  let startTime = '';
  let endTime = '';

  const timeString = string.match(/\d.*\d/)[0];
  const [start, end] = timeString.split(' - ');
  startTime = start;
  endTime = end;

  const daysString = string.slice(0, string.indexOf(timeString)).trim();

  console.log(daysString);

  for (let i = 0; i < daysString.length; i++) {
    if (days[daysString[i]]) {
      daysArray.push(days[daysString[i]]);
    }
  }

  return {
    days: daysArray,
    startTime,
    endTime
  };
}
  
let times = [];

(async function() { 
  //console.log("UserId", localStorage.getItem('a'));
  //console.log("Token", localStorage.getItem('b'));

  times = await getTimes();
  convertFormats();
})();

let CourseCalendar = [];

// Convert the database formats to match the calendar
async function convertFormats() {

  for (let i = 0; i < times.length; i++) {
    // Convert rRule format
    let tempRule = 'FREQ=WEEKLY;INTERVAL=1;UNTIL=20230526T000000Z;BYDAY=';
    for(let j = 0; j < times[i].Time.days.length; j++) {
      
      switch(times[i].Time.days[j]) {
        case 'Monday': 
          tempRule +='MO';
          break;
        case 'Tuesday': 
          tempRule +='TU';
          break;
        case 'Wednesday': 
          tempRule += 'WE';
          break;
        case 'Thursday': 
          tempRule += 'TH';
          break;
        case 'Friday': 
          tempRule += 'FR';
          break;
        case 'Saturday': 
          tempRule += 'SA';
          break;
        case 'Sunday': 
          tempRule += 'SU';
          break;
        default:
      }
      tempRule += ',';
    }

    let editedText = tempRule.slice(0, -1);
    // Convert startTime and endTime

    if(times[i].Time.startTime.slice(-2) === 'PM') {
      times[i].Time.endTime = "January 9, 2023 " + times[i].Time.endTime + ' PM';
      times[i].Time.startTime = "January 9, 2023 " + times[i].Time.startTime +' PM';
    }
    else {
      times[i].Time.endTime = "January 9, 2023 " + times[i].Time.endTime + ' AM';
      times[i].Time.startTime = "January 9, 2023 " + times[i].Time.startTime + ' AM';
    }
    
    let obj = { 
      text: times[i].Title,
      startDate: new Date(times[i].Time.startTime),
      endDate: new Date(times[i].Time.endTime),
      roomId: i,
      recurrenceRule: editedText, // BYDAY - Every day of the week it happens
    };
    CourseCalendar.push(obj);
  }
}

export const resourcesData = [
  {
    text: 'Room 101',
    id: 1,
    color: '#bbd806',
  }, {
    text: 'Room 102',
    id: 2,
    color: '#f34c8a',
  }, {
    text: 'Room 103',
    id: 3,
    color: '#ae7fcc',
  }, {
    text: 'Meeting room',
    id: 4,
    color: '#ff8817',
  }, {
    text: 'Conference hall',
    id: 5,
    color: '#03bb92',
  },
];

function Schedule()  {

  // Get current date
  const currentDate = new Date();
  const views = ['week', 'month'];

  return (
    <Scheduler
      timeZone="America/New_York"
      dataSource={CourseCalendar}
      views={views}
      defaultCurrentView="month"
      defaultCurrentDate={currentDate}
      startDayHour={5}
      height={850}
    >
    <Resource
      dataSource={resourcesData}
      fieldExpr="roomId"
      label="Room"
    />
  </Scheduler>
  );
  
}

export default Schedule;