// /**
//  * Test the event objects
//  */
// /* global it expect jest */
// import 'react-native';

// import Database from '@models';

// function sampleEvents() {
//   var db = new Database('inst', 'test');
//   const date = new Date();
//   var objs = {
//     1: { _id: '1', eventName: 'event 1', eventDesc: 'event desc1', startAt: date, endAt: date },
//     2: { _id: '2', eventName: 'event 2', eventDesc: 'event desc2', startAt: date, endAt: date },
//     3: { _id: '3', eventName: 'event 3', eventDesc: 'event desc3', startAt: date, endAt: date },
//     4: { _id: '4', eventName: 'event 4', eventDesc: 'event desc4', startAt: date, endAt: date },
//   };
//   db.events.addAll(objs);
//   return Object.keys(objs).length;
// }


// it('list getters', () => {
//   var db = new Database('inst', 'test');
//   // lets reset the db
//   db.reset();
//   const g = sampleEvents();
//   expect(db.events.list).toHaveLength(g);
//   // findById
//   expect(db.events.findById('1')).toMatchObject({ eventName: 'event 1' });
//   expect(db.events.findById('10')).toBeNull();
//   const x = db.events.findById('1');
//   // console.log(x);
//   db.events.addAll(null);
// });

// it('delete events', () => {
//   var db = new Database('inst', 'test');
//   // lets reset the db
//   db.reset();
//   const g = sampleEvents();
//   expect(db.events.list).toHaveLength(g);
//   db.events.deleteEvents({});
//   db.events.deleteEvents(null);
//   let objs = {
//     2: { _id: '2',
//       name: 'event 2',
//     },
//   };
//   db.events.deleteEvents(objs);
//   expect(db.events.list).toHaveLength(3);
//   objs = {
//     10: { _id: '10',
//       name: 'event 10',
//     },
//   };
//   db.events.deleteEvents(objs);
//   expect(db.events.list).toHaveLength(3);
// });
