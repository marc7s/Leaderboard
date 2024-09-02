import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputFieldTextComponent } from './input-field-text.component';

describe('InputFieldTextComponent', () => {
  let component: InputFieldTextComponent;
  let fixture: ComponentFixture<InputFieldTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputFieldTextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputFieldTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
