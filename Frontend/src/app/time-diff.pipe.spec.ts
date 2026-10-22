import { TimeDiffPipe } from './time-diff.pipe';

describe('TimeDiffPipe', () => {
  const pipe = new TimeDiffPipe();

  it('shows a slower time as a positive difference in seconds', () => {
    expect(pipe.transform(61500, 60000)).toBe('+1.500s');
  });

  it('shows a faster time as a negative difference in seconds', () => {
    expect(pipe.transform(60000, 61500)).toBe('-1.500s');
  });

  it('pads the milliseconds part', () => {
    expect(pipe.transform(61005, 60000)).toBe('+1.005s');
  });

  it('shows differences of a minute or more in whole minutes', () => {
    expect(pipe.transform(200000, 60000)).toBe('+2m');
  });

  it('shows nothing for equal times', () => {
    expect(pipe.transform(60000, 60000)).toBe('');
  });

  it('shows nothing when there is no time to compare with', () => {
    expect(pipe.transform(60000)).toBe('');
    expect(pipe.transform(60000, undefined)).toBe('');
  });
});
