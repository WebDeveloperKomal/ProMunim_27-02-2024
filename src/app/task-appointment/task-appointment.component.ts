import { Component, ViewChild } from '@angular/core';
import { TaskAppointmentModel } from './task-appointment.component.model';
import { FormGroup } from '@angular/forms';
import { CalendarOptions } from '@fullcalendar/core';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import interactionPlugin from '@fullcalendar/interaction';
import { ApiService } from '../api.service';
import { Appointment, Service } from './task-appointment.service';
import { ActionEventArgs, EventSettingsModel, ScheduleComponent } from '@syncfusion/ej2-angular-schedule';

@Component({
  selector: 'app-task-appointment',
  templateUrl: './task-appointment.component.html',
  styleUrls: ['./task-appointment.component.css']
})
export class TaskAppointmentComponent {
  employeeForm !: FormGroup;
  SearchText : any ;
  branchid : number | undefined;
  branchname : any;
  branchcode: any;
  branchcity: any;
  branchaddress : any;
  page = 1;
  pageSize = 10 ;
  dataarray: TaskAppointmentModel[] = [];
  currentPage: number = 1;
  countries: TaskAppointmentModel[] | undefined;
  collectionSize =100;
  activeTab: string = 'tab1';

// calendarOptions: CalendarOptions = {
//   initialView: 'dayGridMonth',
//   plugins: [dayGridPlugin, interactionPlugin],
//   headerToolbar: {
//     left: 'prev,next today',
//     center: 'title',
//     right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
//   },
//   selectable: true,
//   selectMirror: true,
//   select: this.handleDateSelect.bind(this),
//   eventClick: this.handleEventClick.bind(this),
//   events: [
    
//   ],
// };



// handleDateSelect(selectInfo: any) {
//   const title = prompt('Please enter a new title for your event');
//   const calendarApi = selectInfo.view.calendar;
//   calendarApi.unselect(); 

//   if (title) {
//     calendarApi.addEvent({
//       title,
//       start: selectInfo.startStr,
//       end: selectInfo.endStr,
//       allDay: selectInfo.allDay,
//     });
//   }
// }

// handleEventClick(clickInfo: any) {
//   if (
//     confirm(
//       `Are you sure you want to delete the event '${clickInfo.event.title}'`
//     )
//   ) {
//     clickInfo.event.remove();
//   }
// }




// appointmentsData: Appointment[];

//   currentDate: Date = new Date(2021, 2, 28);

//   constructor(service: Service) {
//     this.appointmentsData = service.getAppointments();
//   }

// views: Array<string> = ['Month', 'Agenda'];
// public selectedDate: Date = new Date();
// public isFirst: boolean = true;
// testData = [
//   {
//     Id: '1',
//     Subject: 'Event 1',
//     StartTime: new Date(2021, 9, 1),
//     EndTime: new Date(2021, 9, 1, 23, 0),
//     Holiday: new Date(2021, 9, 1),
//     IsAllDay: true,
//   },
//   {
//     Id: '2',
//     Subject: 'Event 1',
//     StartTime: new Date(2021, 9, 2),
//     EndTime: new Date(2021, 9, 2, 23, 0),
//     Holiday: new Date(2021, 9, 2),
//     IsAllDay: true,
//   },
//   {
//     Id: '3',
//     Subject: 'Event 1',
//     StartTime: new Date(2021, 9, 3),
//     EndTime: new Date(2021, 9, 3, 23, 0),
//     Holiday: new Date(2021, 9, 3),
//     IsAllDay: true,
//   },
//   {
//     Id: '4',
//     Subject: 'Event 2',
//     StartTime: new Date(2021, 9, 5),
//     EndTime: new Date(2021, 9, 5, 23, 0),
//     Holiday: new Date(2021, 9, 5),
//     IsAllDay: true,
//   },
//   {
//     Id: '5',
//     Subject: 'Event 2',
//     StartTime: new Date(2021, 9, 6),
//     EndTime: new Date(2021, 9, 6, 23, 0),
//     Holiday: new Date(2021, 9, 6),
//     IsAllDay: true,
//   },
//   {
//     Id: '6',
//     Subject: 'Event 2',
//     StartTime: new Date(2021, 9, 8),
//     EndTime: new Date(2021, 9, 8, 23, 0),
//     Holiday: new Date(2021, 9, 8),
//     IsAllDay: true,
//   },
// ];
// public eventSettings: EventSettingsModel = {
//   dataSource: <Object[]>extend([], this.testData, null, true),
// };

// onDataBinding(args: { result: any[]; }) {
//   var result = (Object as any)
//     .values(
//       args.result.reduce((c, v) => {
//         let k = v.Subject;
//         c[k] = c[k] || [];
//         c[k].push(v);
//         return c;
//       }, {})
//     )
//     // .reduce((c: string | any[], v: string | any[]) => (v.length > 1 ? c.concat(v) : c), []);

//   console.log(result); //appointments which are duplicated
//   for (let i = 0; i <= result.length / 2; i += 2) {
//     args.result.splice(
//       args.result.findIndex(
//         (e) =>
//           e.Id == result[i + 1].Id && e.StartTime == result[i + 1].StartTime
//       ),
//       1
//     ); //to remove second event from schedule datasource
//     if (this.isFirst) {
//       args.result.find((e) => e.Id == result[i].Id).EndTime =
//         result[i + 1].EndTime; //to set event data
//     }
//   }
//   this.isFirst = false;
// }

// }
// function extend(arg0: never[], testData: { Id: string; Subject: string; StartTime: Date; EndTime: Date; Holiday: Date; IsAllDay: boolean; }[], arg2: null, arg3: boolean): Object[] {
//   throw new Error('Function not implemented.');
// }


public selectedDate: Date = new Date(2020, 9, 30);
  public eventSettings: EventSettingsModel = {
    dataSource: [
      {
        Id: 1,
        Subject: "Testing Event",
        StartTime: new Date(2020, 9, 30, 14, 0),
        EndTime: new Date(2020, 9, 30, 14, 50),
        RecurrenceRule: "FREQ=WEEKLY;BYDAY=FR;INTERVAL=1;",
        RecurrenceException: "20201106T130000Z"
      }
    ]
  };

  @ViewChild("schedule", { static: false })
  public scheduleObj!: ScheduleComponent;

  onPopupOpen(args: { data: any; }) {
    console.log("popUp args", args.data);
    console.log("getEvent result", this.scheduleObj.getEvents(args.data));
  }

  onActionComplete(args: ActionEventArgs): void {
    console.log("actionComplete", args.requestType, args);

    switch (args.requestType) {
      case "viewNavigate":
      case "dateNavigate":
        this.scheduleObj.refresh();
        break;
      case "toolBarItemRendered":
        break;
      default:
    }
  }




  
}
