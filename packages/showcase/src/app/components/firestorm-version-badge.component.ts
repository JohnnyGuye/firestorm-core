import { Component } from "@angular/core";
import * as firestormpackage from "@jiway/firestorm-core/package.json"
const pack = firestormpackage

@Component({
  standalone: true,
  selector: 'firestorm-firestorm-version-badge',
  template: `<span class="npm"></span><span>v{{version}}</span>`,
})
export class FirestormVersionBadgeComponent {
  get version() { return pack.version }
}