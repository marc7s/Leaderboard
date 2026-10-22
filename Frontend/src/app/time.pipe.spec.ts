import { TimePipe } from './time.pipe';

describe('TimePipe', () => {
  const pipe = new TimePipe();

  it('formats milliseconds as mm:ss.SSS', () => {
    expect(pipe.transform(83456)).toBe('01:23.456');
  });

  it('pads minutes, seconds and milliseconds with zeros', () => {
    expect(pipe.transform(5007)).toBe('00:05.007');
  });

  it('formats zero', () => {
    expect(pipe.transform(0)).toBe('00:00.000');
  });
});
