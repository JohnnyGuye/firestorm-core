import { Component } from "@angular/core";
import * as firestormpackage from "@firestorm/core/package.json"
const pack = firestormpackage

@Component({
  selector: 'j-fo-firestorm-version-badge',
  template: `<div class="vtmn-badge"><span class="npm"></span><span>v{{version}}</span></div>`,
  standalone: true
})
export class FirestormVersionBadgeComponent {


  constructor() {

    // this._badge = renderBadge("npmversion", { })
  }

  get version() {
    return pack.version
  }

  // get badge() {
  //   return this._badge
  // }
}