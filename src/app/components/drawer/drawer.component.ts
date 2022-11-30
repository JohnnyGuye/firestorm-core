import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'fo-drawer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss']
})
export class DrawerComponent implements OnInit {

  @Input()
  opened: boolean = false

  @Input()
  position: 'start' | 'end' = 'end'

  @Input()
  height: 'container' | 'content' = 'content'

  @Input()
  drawerWidth: number | string = 'min(80vw,300px)'

  @Output()
  openedChange = new EventEmitter<boolean>()
  

  get width() {
    if (!this.opened) return '0px';
    if (typeof this.drawerWidth === 'number') return `${this.drawerWidth}px`
    return this.drawerWidth
  }

  constructor() { }

  ngOnInit(): void {
  }

  get heightKlass() {
    switch(this.height) {
      case 'container':
        return 'has-container-height'
      case 'content':
        return 'has-content-height'
    }
  }

  get klass() {
    return [this.heightKlass].join(" ")
  }

}
