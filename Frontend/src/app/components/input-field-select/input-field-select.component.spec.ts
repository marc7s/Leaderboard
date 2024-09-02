import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputFieldSelectComponent } from './input-field-select.component';

describe('InputFieldSelectComponent', () => {
  let component: InputFieldSelectComponent;
  let fixture: ComponentFixture<InputFieldSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputFieldSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputFieldSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
