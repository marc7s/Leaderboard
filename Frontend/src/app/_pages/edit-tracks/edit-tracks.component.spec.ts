import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTracksComponent } from './edit-tracks.component';

describe('EditTracksComponent', () => {
  let component: EditTracksComponent;
  let fixture: ComponentFixture<EditTracksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTracksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTracksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
