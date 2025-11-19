import { Component, inject } from "@angular/core";
import { MatTreeModule } from "@angular/material/tree"
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { RouterModule } from "@angular/router";
import { DocPageService } from "../../services";
import { isLocal } from "@guards";

interface DocNode {

  id?: string,
  name: string,
  path: string,
  children?: DocNode[]

}

@Component({
  standalone: true,
  selector: 'firestorm-sidebar-navigation',
  templateUrl: 'sidebar-navigation.component.html',
  imports: [
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    RouterModule
  ]
})
export class SidebarNavigationComponent {

  private docLayout = inject(DocPageService).getDocLayout()

  dataSource = this.docLayout

  
  constructor() {
  }

  childrenAccessor = (node: DocNode) => node.children ?? []

  hasChild = (_: number, node: DocNode) => !!node.children && node.children.length > 0

  nodeLink(node: DocNode) {
    return `doc/${node.path}`
  }

  get isLocal() {
    return isLocal()
  }
}