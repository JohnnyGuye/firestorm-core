import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FirebaseOptions } from 'firebase/app';
import { ConnectFirebaseComponent } from '../../components/connect-firebase/connect-firebase.component';
import { FirestormConnectionEvent } from '../../components/events';
import { OneTapConnectFirebaseButtonComponent } from '../../components/one-tap-connect-firebase-button/one-tap-connect-firebase-button.component';
import { PlaygroundService } from '../../services/playground.service';

import { environment } from 'src/app/environment/environment';

const defaultOptions: FirebaseOptions = environment.firestorm

type TapOption = {

  name: string
  options: FirebaseOptions

}

@Component({
  selector: 'fo-dev-test',
  standalone: true,
  imports: [
    CommonModule, 
    ConnectFirebaseComponent,
    OneTapConnectFirebaseButtonComponent,
  ],
  templateUrl: './dev-test.component.html',
  styleUrls: ['./dev-test.component.scss']
})
export class DevTestComponent {

  constructor(
    private playgroundService: PlaygroundService
  ) {
  }

  get tap(): TapOption {
    return { name: "Test store", options: defaultOptions }
  }

  get connectors() {
    return this.playgroundService.connectors
  }

  defaultOptions = defaultOptions

  onConnection(event: FirestormConnectionEvent) {
    this.playgroundService.register(event.firestorm)
    console.log(this.playgroundService.instances)
  }
}
