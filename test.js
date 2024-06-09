
let dt = 1716029080000
let date = new Date(dt);
console.log('date:', date);

let schedule30DaysDate = date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000);
console.log('schedule30DaysDate:', schedule30DaysDate);
console.log('schedule30DaysDateh:',  new Date(schedule30DaysDate));
let schedule60DaysDate = date.setTime(date.getTime() + 60 * 24 * 60 * 60 * 1000);
console.log('schedule60DaysDate:', schedule60DaysDate);
console.log('schedule60DaysDateh:',  new Date(schedule60DaysDate));
let schedule90DaysDate = date.setTime(date.getTime() + 90 * 24 * 60 * 60 * 1000);
console.log('schedule90DaysDate:', schedule90DaysDate);
console.log('schedule90DaysDateh:',  new Date(schedule90DaysDate));