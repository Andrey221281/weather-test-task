export const dewPoint = (temp: number, humi: number) => {
  const a = 17.27;
  const b = 237.7;

  const sd = (a * temp) / (b + temp);
  const log = Math.log(humi / 100);
  const tr = sd + log;

  return Math.round((b * tr) / (a - tr));
};
