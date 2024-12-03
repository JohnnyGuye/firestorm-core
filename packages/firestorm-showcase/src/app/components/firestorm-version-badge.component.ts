import { Component } from "@angular/core";
import * as firestormpackage from "@jiway/firestorm-core/package.json"
const pack = firestormpackage

@Component({
  standalone: true,
  selector: 'firestorm-firestorm-version-badge',
  template: `<div class="vtmn-badge"><span class="npm"></span><span>v{{version}}</span></div>`,
})
export class FirestormVersionBadgeComponent {
  get version() { return pack.version }
}