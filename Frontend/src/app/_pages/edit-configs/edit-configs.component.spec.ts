import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditConfigsComponent } from './edit-configs.component';

describe('EditConfigsComponent', () => {
  let component: EditConfigsComponent;
  let fixture: ComponentFixture<EditConfigsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditConfigsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditConfigsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
