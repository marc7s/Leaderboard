import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-info-panel',
    templateUrl: './info-panel.component.html',
    styleUrls: ['./info-panel.component.sass'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class InfoPanelComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
