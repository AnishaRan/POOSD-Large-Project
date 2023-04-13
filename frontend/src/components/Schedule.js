import * as React from 'react';
import Paper from '@mui/material/Paper';
import { ViewState, EditingState  } from '@devexpress/dx-react-scheduler';
import {
  Appointments,
  AppointmentTooltip,
  DateNavigator,
  DragDropProvider,
  MonthView,
  Resources,
  Scheduler,
  Toolbar,
  ViewSwitcher,
  WeekView,
} from '@devexpress/dx-react-scheduler-material-ui';





// Get current date
const current = new Date();
const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;
const currentDate = {date};


const appointments = [{
  title: 'COP4331',
  startDate: new Date("April 16, 2023 13:24"),
  endDate: new Date("April 16, 2023 15:24"),
  members: [5, 1, 3],
  id: 0,
  classId: 1,
  rRule: 'FREQ=WEEKLY;COUNT=2',
},
{
  title: 'Test 2',
  startDate: new Date("April 1, 2023 02:24"),
  endDate: new Date("April 1, 2023 05:24"),
  id: 1,
  classId: 2,
  members: [5, 1, 3],
  rRule: 'FREQ=DAILY;COUNT=3',
},
{
  title: 'Test 3',
  startDate: new Date("March 20, 2023 02:24"),
  endDate: new Date("March 20, 2023 05:24"),
  id: 2,
  classId: 3,
  rRule: 'FREQ=WEEKLY;COUNT=4',
},
{
  title: 'Test 4',
  startDate: new Date("April 17, 2023 02:24"),
  endDate: new Date("April 17, 2023 03:24"),
  id: 3,
  classId: 4,
  rRule: 'FREQ=DAILY;COUNT=2',
}
];

// These are the classIDs
export const resourcesData = [
  {
    text: 'Room 101',
    id: 0,
    color: '#FF5733',
  }, 
  {
    text: 'Room 102',
    id: 1,
    color: '#33B224',
  }, 
  {
    text: 'Room 103',
    id: 2,
    color: '#0ECDD6',
  }, 
  {
    text: 'Room 104',
    id: 3,
    color: '#D60E29',
  },
  {
    text: 'Meeting room',
    id: 4,
    color: '#7E57C1',
  },
];




export default class Demo extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: appointments,
      resources: [
        {
          fieldName: 'classId',
          title: 'Room',
          instances: resourcesData,
        },
      ],
    };

    this.commitChanges = this.commitChanges.bind(this);
  }

  commitChanges({ added, changed, deleted }) {
    this.setState((state) => {
      let { data } = state;
      if (added) {
        const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0;
        data = [...data, { id: startingAddedId, ...added }];
      }
      if (changed) {
        data = data.map(appointment => (
          changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment));
      }
      if (deleted !== undefined) {
        data = data.filter(appointment => appointment.id !== deleted);
      }
      return { data };
    });
  }

  render() {
    const { data, resources } = this.state;

    return (
      <Paper >
        <Scheduler data={data} height={'auto'} >
          <ViewState defaultCurrentDate= {currentDate} defaultCurrentViewName="Month"/>
          <EditingState onCommitChanges={this.commitChanges} />
          <WeekView startDayHour={6} endDayHour={18} />
          <MonthView />

          <Toolbar />
          <DateNavigator />
          <ViewSwitcher/>

          <Appointments />
          <AppointmentTooltip
            showCloseButton
            showOpenButton
          />
          <Resources data={resources} mainResourceName="classId" />

          <DragDropProvider />
        </Scheduler>
      </Paper>
    );
  }
}