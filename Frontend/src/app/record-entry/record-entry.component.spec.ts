import { ComponentFixture, TestBed } from '@angular/core/testing';
import { appTestingModule } from '../testing/app-testing';

import { RecordEntryComponent } from './record-entry.component';

describe('RecordEntryComponent', () => {
  let component: RecordEntryComponent;
  let fixture: ComponentFixture<RecordEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(appTestingModule)
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
