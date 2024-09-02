import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTyresComponent } from './edit-tyres.component';

describe('EditTyresComponent', () => {
  let component: EditTyresComponent;
  let fixture: ComponentFixture<EditTyresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTyresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTyresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
