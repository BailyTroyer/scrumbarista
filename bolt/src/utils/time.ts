export const timezones: { name: string; relative }[] = [
  { name: "GMT", relative: 0 },
  { name: "UTC", relative: 0 },
  { name: "ECT", relative: 1 },
  { name: "EET", relative: 2 },
  { name: "ART", relative: 2 },
  { name: "EAT", relative: 3 },
  { name: "MET", relative: 3.5 },
  { name: "NET", relative: 4 },
  { name: "PLT", relative: 5 },
  { name: "IST", relative: 5.5 },
  { name: "BST", relative: 6 },
  { name: "VST", relative: 7 },
  { name: "CTT", relative: 8 },
  { name: "JST", relative: 9 },
  { name: "ACT", relative: 9.5 },
  { name: "AET", relative: 10 },
  { name: "SST", relative: 11 },
  { name: "NST", relative: 12 },
  { name: "MIT", relative: -11 },
  { name: "HST", relative: -10 },
  { name: "AST", relative: -9 },
  { name: "PST", relative: -8 },
  { name: "PNT", relative: -7 },
  { name: "MST", relative: -7 },
  { name: "CST", relative: -6 },
  { name: "EST", relative: -5 },
  { name: "IET", relative: -5 },
  { name: "PRT", relative: -4 },
  { name: "CNT", relative: -3 },
  { name: "AGT", relative: -3 },
  { name: "BET", relative: -3 },
  { name: "CAT", relative: -1 },
];

/**
 * Calculates the current date given a timezone offset.
 */
export const dateTimezoneOffset = (offset: number): Date => {
  const date = new Date();
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  return new Date(utc + 3600000 * offset);
};

export const getTimezoneOffset = (name: string): number => {
  return timezones.find((tz) => tz.name === name)?.relative || 0;
};

export const getDayName = (date: Date) =>
  date.toLocaleDateString("en-US", {
    weekday: "long",
  });

// convert date to HH:MM:SS
export const toMilitaryTime = (date: Date) => date.toTimeString().split(" ")[0];

// HH:MM:SS
export const totalSeconds = (time: string) => {
  const s = time.split(":") as any[];
  return parseInt(s[0] * 3600 + s[1] * 60 + s[0]);
};
