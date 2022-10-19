import { Component } from '@angular/core';
import { Icon, IconShape, IconSize, IconType, IconWithRelPath } from './components/icon/icon';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'Leaderboard';
  profileIcon: Icon = { 
    type: IconType.Image,
    shape: IconShape.Circle,
    size: IconSize.Icon,
    alt: 'Profile',
    relPath: 'img/ProfileIcon.png'
  }
}

