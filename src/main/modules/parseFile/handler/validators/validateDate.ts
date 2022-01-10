import { GenericError } from '../../../../base/interface/errors';
import { ErrorValidateInvalid } from '../../interface/errors/validatingRoes';

interface Date {
  year: string;
  month: string;
  day: string;
}

export const validateDate = (dateInput: string): string => {
  // TODO: [-----] fix the webstorm dummy inspection of named capture group, since the code actually works
  let g = dateInput.match(/(?<year>20\d\d)[^s](?<month>\d?\d)[^:](?<day>\d?\d)/);
  if (!g || g.groups === undefined) {
    g = dateInput.match(/(?<month>\d?\d)\/(?<day>\d?\d)\/(?<year>20\d\d)/);
    // prettier-ignore
    if (!g) throw new GenericError(ErrorValidateInvalid, `should date(${dateInput}) satisfy 'YYYY-MM-DD' format`);
  }
  const gg = g.groups as unknown as Date;
  // repair: date format, 2022-01-11
  const date = [gg.year, gg.month.padStart(2, '0'), gg.day.padStart(2, '0')].join('-');
  // console.log(dateInput, g.groups, date);
  if (date > '2030-01-01' || date < '2020-01-01')
    throw new GenericError(
      ErrorValidateInvalid,
      `should date(${date}) is valid, raw string: ${date}`
    );
  return date;
};
