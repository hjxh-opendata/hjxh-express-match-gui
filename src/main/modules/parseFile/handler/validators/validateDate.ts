import { GenericError } from '../../../../base/interface/errors';
import { ErrorValidateInvalid } from '../../interface/errors/validatingRoes';

export const validateDate = (dateInput: string): string => {
  // TODO: [-----] fix the webstorm dummy inspection of named capture group, since the code actually works
  let g = dateInput.match(/(?<year>20\d\d)[^s](?<month>\d?\d)[^:](?<day>\d?\d)/);
  if (!g) {
    g = dateInput.match(/(?<month>\d?\d)\/(?<day>\d?\d)\/(?<year>20\d\d)/);
    // prettier-ignore
    if (!g) throw new GenericError(ErrorValidateInvalid, `should date(${dateInput}) satisfy 'YYYY-MM-DD' format`);
  }

  const date = [g.groups?.year, g.groups?.month, g.groups?.day].join('-');
  // console.log(dateInput, g.groups, date);
  if (date > '2030-01-01' || date < '2020-01-01')
    throw new GenericError(
      ErrorValidateInvalid,
      `should date(${date}) is valid, raw string: ${date}`
    );
  return date;
};
