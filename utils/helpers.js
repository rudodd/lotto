// Helper function that returns whether a variable is empty, null, or undefined
export const empty = (variable) => {

  // check undefined 
  if (typeof variable === 'undefined') {
    return true;
  
  // check for null
  } else if (variable === null) {
    return true;

  // check for empty string
  } else if (typeof variable === 'string' && variable.length === 0){
    return true;

  // check for bad number  
  } else if (typeof variable === 'number' && isNaN(variable)){
    return true;

  // check for empty object 
  } else if (typeof variable === 'object' && Object.keys(variable).length === 0){
    return true;

  // check for empty arrays 
  } else if (Array.isArray(variable) && variable.length === 0){
    return true;

  } else {
    return false;
  }
}
// Helper function to convert a string to title case
export const titleCase = (string) => {
  return string.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
}

// Determine the next drawing date based on the date - drawings are Mon, Wed, Sat
export const nextDate = () => {
  const today = new Date().getDay();
  const drawingDays = [1, 3, 6];
  const oneDay = [0, 2, 5];
  const daysBetween = drawingDays.includes(today) ? 0 : oneDay.includes(today) ? 1 : 2;
  const next = new Date();
  next.setDate(next.getDate() + daysBetween)
  return next.toDateString();
}
