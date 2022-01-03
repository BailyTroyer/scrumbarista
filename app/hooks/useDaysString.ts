import { useEffect, useState } from "react";

import { weekDays } from "utils/constants";

const capitalizeFirstLetter = (word: string) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

export const zeroPad = (num: number, places: number) =>
  String(num).padStart(places, "0");

export const toRegularTime = (militaryTime: string) => {
  const [hours, minutes, seconds] = militaryTime
    .split(":")
    .map((s) => Number(s));
  return `${hours > 12 ? hours - 12 : zeroPad(hours, 2)}:${zeroPad(
    minutes,
    2
  )}${seconds ? `:${seconds}` : ""} ${hours >= 12 ? "PM" : "AM"}`;
};

// if cluster (island) of days return that otherwise return split list
const daysToString = (days: string[]): string => {
  if (days.length === 0) return "";
  if (days.length === 1) return days[0];

  let pointer = days.indexOf(days[0]);
  const daysToPrint = [days[0]];

  for (let step = 1; step < days.length; step++) {
    const index = days.indexOf(weekDays[step]);

    if (Math.abs(pointer - index) === 1) {
      pointer = index;
      daysToPrint.push(days[step]);
    }
  }

  if (daysToPrint.length === days.length) {
    return `from ${capitalizeFirstLetter(
      daysToPrint[0]
    )} to ${capitalizeFirstLetter(daysToPrint[daysToPrint.length - 1])}`;
  } else {
    const last = days.pop();
    const result =
      days.map((d) => capitalizeFirstLetter(d)).join(", ") + " and " + last;

    return `on ${result}`;
  }
};

const useDaysToString = (days: string[]) => {
  const [daysString, setDaysString] = useState("");

  useEffect(() => {
    setDaysString(daysToString(days));
  }, [days]);

  return daysString;
};

export default useDaysToString;
