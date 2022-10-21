import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCarsComponent } from './edit-cars.component';

describe('EditCarsComponent', () => {
  let component: EditCarsComponent;
  let fixture: ComponentFixture<EditCarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCarsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
