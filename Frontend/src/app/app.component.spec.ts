import { TestBed } from '@angular/core/testing';
import { appTestingModule } from './testing/app-testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule(appTestingModule).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it(`should have 'Leaderboard' as title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance.title).toEqual('Leaderboard');
  });

  it('should render the navigation with home and profile links', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const home = compiled.querySelector('nav a.webpageName');
    expect(home?.textContent).toContain('Leaderboard');
    expect(home?.getAttribute('href')).toBe('/');
    expect(compiled.querySelector('nav a.profile')?.getAttribute('href')).toBe('/login');
  });
});
