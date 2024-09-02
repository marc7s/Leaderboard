import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWeathersComponent } from './edit-weathers.component';

describe('EditWeathersComponent', () => {
  let component: EditWeathersComponent;
  let fixture: ComponentFixture<EditWeathersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditWeathersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditWeathersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
