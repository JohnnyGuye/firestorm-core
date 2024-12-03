import { Component } from "@angular/core";
import { MatTreeModule, MatTreeNestedDataSource } from "@angular/material/tree"

import { DocumentationPageTreeItem, DOC_TREE } from "../../routing";
import { NestedTreeControl } from "@angular/cdk/tree";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { RouterModule } from "@angular/router";

const DATA = DOC_TREE

@Component({
  selector: 'j-fo-sidebar-navigation',
  templateUrl: './sidebar-navigation.component.html',
  imports: [
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    RouterModule
  ],
  standalone: true
})
export class SidebarNavigationComponent {

  private _treeData = new MatTreeNestedDataSource<DocumentationPageTreeItem>()
  treeControl = new NestedTreeControl<DocumentationPageTreeItem>(node => node.children);
  
  constructor() {
    this._treeData.data = DATA
  }

  get treeData() {
    return this._treeData
  }

  hasChild = (_: number, node: DocumentationPageTreeItem) => !!node.children && node.children.length > 0

  nodeLink(node: DocumentationPageTreeItem) {
    return `doc/${node.id}`
  }
}