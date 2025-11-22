import { Component, Input } from "@angular/core";
import { TestState } from "@modules/tests";

export enum TestStateComponentMode {
    
    Label = 1,
    Icon = 2,
    Full = TestStateComponentMode.Label | TestStateComponentMode.Icon

}

@Component({
    standalone: true,
    selector: 'firestorm-test-state-tag',
    imports: [],
    template: `
    <span class="tag has-animated-colors" [class]="klass" [class.has-w-10]="isLongForm">
        
        @if (showIcon) {
            <span class="icon">
            @switch (state) {
                @case (TestState.Idle) {
                    <i class="fa-solid fa-stop"></i>
                }
                @case (TestState.Failed) {
                    <i class="fa-solid fa-exclamation fa-shake"></i>
                }
                @case (TestState.Running) {
                    <i class="fa-solid fa-spinner fa-spin-pulse"></i>
                }
                @case (TestState.Success) {
                    <i class="fa-solid fa-check"></i>
                }
            }
            </span>
        }

        @if (showLabel) {
            <span>{{label}}</span>
        }
        
    </span>`
})
export class TestStateComponent {

    protected TestStateComponentMode = TestStateComponentMode
    protected TestState = TestState

    @Input()
    state: TestState = TestState.Idle

    @Input()
    mode: TestStateComponentMode = TestStateComponentMode.Icon

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

    protected get showIconOnly() {
        return TestStateComponentMode.Icon == this.mode
    }

    protected get showLabelOnly() {
        return TestStateComponentMode.Label == this.mode
    }

    protected get showIcon() {
        return (TestStateComponentMode.Icon & this.mode) > 0
    }

    protected get showLabel() {
        return (TestStateComponentMode.Label & this.mode) > 0
    }

    protected get isLongForm() {
        return (TestStateComponentMode.Label & this.mode) > 0
    }

}