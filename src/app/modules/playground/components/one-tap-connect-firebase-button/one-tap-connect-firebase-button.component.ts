import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseOptions } from 'firebase/app';
import { Firestorm } from 'src/firestorm';
import { FirestormConnectionEvent } from '../events';


@Component({
  selector: 'fo-one-tap-connect-firebase-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './one-tap-connect-firebase-button.component.html',
  styleUrls: ['./one-tap-connect-firebase-button.component.scss']
})
export class OneTapConnectFirebaseButtonComponent {

  @Input()
  name!: string

  @Input()
  options!: FirebaseOptions

  @Output()
  onConnection = new EventEmitter<FirestormConnectionEvent>()

  private firestorm?: Firestorm
  
  get isConnected() {
    return !!(this.firestorm?.isConnected)
  }

  get canTap() {
    return !!this.name && !!this.options && !this.isConnected
  }

  submit() {
    if (!this.canTap) return
    
    this.firestorm = new Firestorm(this.name)
    this.firestorm.connect(this.options)
    this.onConnection.emit(new FirestormConnectionEvent(this.firestorm, this.options))
  }

}
