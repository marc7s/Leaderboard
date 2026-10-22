import { IconSize, IconType } from './components/icon/icon';
import { IconPipe } from './icon.pipe';

describe('IconPipe', () => {
  const pipe = new IconPipe();

  it('creates an image icon from a URL', () => {
    expect(pipe.transform('https://example.com/flag.png', 'Flag')).toEqual({
      type: IconType.Image,
      size: IconSize.Icon,
      absPath: 'https://example.com/flag.png',
      alt: 'Flag',
    });
  });

  it(`uses 'Icon' as alt text when none is given`, () => {
    expect(pipe.transform('https://example.com/flag.png').alt).toBe('Icon');
  });
});
