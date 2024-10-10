//remove Space
export function removeSpace(item:string) {
    const noSpace = item.trim().replace(/\s/g, "");
      if (noSpace) {
        return noSpace;
      } else {
        return item;
      }
 }  


// Return duration from specified date
export function dateDifferenceWithUnit(startDate:any) {
  // Parse the input date strings
  const startDateObj = new Date(startDate);
  const endDateObj = new Date();

  // Calculate the time difference in milliseconds
  const timeDifference = Math.abs(endDateObj.getTime() - startDateObj.getTime());

  // Define the time units and their respective milliseconds
  const timeUnits = [
    { unit: "yr", milliseconds: 365 * 24 * 60 * 60 * 1000 },
    { unit: "month", milliseconds: 30 * 24 * 60 * 60 * 1000 },
    { unit: "wk", milliseconds: 7 * 24 * 60 * 60 * 1000 },
    { unit: "day", milliseconds: 24 * 60 * 60 * 1000 },
    { unit: "hr", milliseconds: 60 * 60 * 1000 },
    { unit: "min", milliseconds: 60 * 1000 },
  ];

  // Find the largest unit that fits into the time difference
  for (const { unit, milliseconds } of timeUnits) {
    if (timeDifference >= milliseconds) {
      const difference = Math.floor(timeDifference / milliseconds);
      return `${difference} ${unit}${difference > 1 ? "s" : ""} ago`;
    }
  }

  // If the difference is less than a minute
  const difference = Math.floor(timeDifference / 1000);
  return `${difference} second${difference > 1 ? "s" : ""} ago`;
}
