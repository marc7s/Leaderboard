import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoTimeDashboardComponent } from './autotime-dashboard.component';

describe('AutoTimeDashboardComponent', () => {
  let component: AutoTimeDashboardComponent;
  let fixture: ComponentFixture<AutoTimeDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutoTimeDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoTimeDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
