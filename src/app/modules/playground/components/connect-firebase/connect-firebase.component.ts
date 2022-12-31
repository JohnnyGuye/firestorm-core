import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseOptions } from 'firebase/app';
import { FormsModule } from '@angular/forms';
import { FirestormConnectionEvent } from '../events';
import { Firestorm } from '@firestorm/firestorm';

@Component({
  selector: 'fo-connect-firebase',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './connect-firebase.component.html',
  styleUrls: ['./connect-firebase.component.scss']
})
export class ConnectFirebaseComponent {

  
  @Input()
  firestorm: Firestorm = new Firestorm("default")

  @Input()
  set defaultOptions(options: FirebaseOptions) {
    for (let opt in options) (this.options as any)[opt] = (options as any)[opt]
  }

  @Output()
  onConnection = new EventEmitter<FirestormConnectionEvent>()

  name: string = "default"
  options: FirebaseOptions = {}

  get canSubmit() {
    return !!this.firestorm
  }


  submit() {
    this.firestorm = new Firestorm(this.name)
    this.firestorm.connect(this.options)
    this.onConnection.emit(new FirestormConnectionEvent(this.firestorm, this.options))
  }
}
