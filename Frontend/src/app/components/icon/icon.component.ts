import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Icon, IconShape, IconType, IconWithAbsPath, IconWithRelPath } from './icon';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.sass']
})
export class IconComponent implements OnInit {

  @Input() icon?: Icon;
  assetsPath: string = '../../assets/';
  path: string = '';

  types = IconType;

  constructor() {
  }

  ngOnInit(): void {
    this.updatePath();
  }

  ngOnChanges(changes: SimpleChanges): void{
    this.updatePath();
  }

  updatePath(): void{
    if(this.icon){
      this.icon.shape = this.icon.shape ?? IconShape.Square;
      
      if((this.icon as IconWithAbsPath).absPath)
        this.path = (this.icon as IconWithAbsPath).absPath;
      else if((this.icon as IconWithRelPath).relPath)
        this.path = this.assetsPath + (this.icon as IconWithRelPath).relPath;
    }
  }

}
