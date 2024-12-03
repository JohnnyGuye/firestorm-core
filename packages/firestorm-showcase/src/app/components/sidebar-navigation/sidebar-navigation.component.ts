import { Component, inject } from "@angular/core";
import { MatTreeModule, MatTreeNestedDataSource } from "@angular/material/tree"

import { DocumentationPageTreeItem, DOC_TREE } from "../../routing";
import { NestedTreeControl } from "@angular/cdk/tree";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { RouterModule } from "@angular/router";
import { DocPageService } from "../../services";

const DATA = DOC_TREE

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

  private _treeData = new MatTreeNestedDataSource<DocumentationPageTreeItem>()
  treeControl = new NestedTreeControl<DocumentationPageTreeItem>(node => node.children);
  
  constructor() {
    this._treeData.data = DATA
    console.log(this.docLayout)
  }

  get treeData() {
    return this._treeData
  }

  hasChild = (_: number, node: DocumentationPageTreeItem) => !!node.children && node.children.length > 0

  nodeLink(node: DocumentationPageTreeItem) {
    return `doc/${node.id}`
  }
}