import { validateId } from './validateId';

test('id', () => {
  expect(validateId('"75507081436348"')).toBe('75507081436348');
});
