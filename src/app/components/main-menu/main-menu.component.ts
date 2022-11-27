import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface MenuSection {

  title: string
  children: MenuLevel[]

}

export interface MenuLevel {

  title: string
  path: string
  children?: MenuLevel[]
}

@Component({
  selector: 'fo-main-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent {

  @Input()
  menu: MenuSection[] = []

}
