import { Component, Input } from "@angular/core";
import { TestState } from "@modules/tests";

@Component({
    standalone: true,
    selector: 'firestorm-test-state-tag',
    imports: [],
    template: `<span class="tag" [class]="klass">{{label}}</span>`
})
export class TestStateComponent {

    @Input()
    state: TestState = TestState.Idle

    get klass() {
        switch (this.state) {
            case TestState.Idle: return "is-dark"
            case TestState.Failed: return "is-danger"
            case TestState.Running: return "is-warning"
            case TestState.Success: return "is-success"            
        }
    }

    get label() {
        switch (this.state) {
            case TestState.Idle:    return "Idle"
            case TestState.Failed:  return "Failure"
            case TestState.Running: return "Running"
            case TestState.Success: return "Success"
        }
    }
}