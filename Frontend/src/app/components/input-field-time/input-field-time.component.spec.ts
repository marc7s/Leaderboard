import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputFieldTimeComponent } from './input-field-time.component';

describe('InputFieldTimeComponent', () => {
  let component: InputFieldTimeComponent;
  let fixture: ComponentFixture<InputFieldTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputFieldTimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputFieldTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
