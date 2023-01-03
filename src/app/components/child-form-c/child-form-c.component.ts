import { Component, forwardRef, Input, OnInit, Provider, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, ControlContainer, ControlValueAccessor, FormControl, FormGroup, FormGroupDirective, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule, ValidationErrors, Validator } from '@angular/forms';

function createSubformProviders<T>(type: Type<T>) {
  return [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => type),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => type),
      multi: true
    }
  ]
}

@Component({
  selector: 'fo-child-form-c',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './child-form-c.component.html',
  styleUrls: ['./child-form-c.component.scss'],
  providers: [
    ...createSubformProviders(ChildFormCComponent)
    // {
    //   provide: NG_VALUE_ACCESSOR,
    //   useExisting: forwardRef(() => ChildFormCComponent),
    //   multi: true
    // },
    // {
    //   provide: NG_VALIDATORS,
    //   useExisting: forwardRef(() => ChildFormCComponent),
    //   multi: true
    // }
  ]
})
export class ChildFormCComponent implements ControlValueAccessor, Validator {

    
  form = new FormGroup({
    title: new FormControl('')
  })

  //#region Validator region
  validate(control: AbstractControl<any, any>): ValidationErrors | null {
    console.log("Child c validation", control)
    if (this.form.valid) return null
    return {
      invalidForm: { 
        valid: false, 
        message: "Child C is invalid!" 
      }
    }
  }
  // registerOnValidatorChange?(fn: () => void): void {
  //   throw new Error('Method not implemented.');
  // }
  //#endregion

  //#region CVA
  
  public onTouched: () => void = () => {}

  writeValue(value: any): void {
    value && this.form.setValue(value, { emitEvent: false })
  }

  registerOnChange(fn: any): void {
    console.log("on change")
    this.form.valueChanges.subscribe(fn)
  }

  registerOnTouched(fn: any): void {  
    console.log("on touched")
    this.onTouched = fn
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.form.disable() : this.form.enable()
  }
  //#endregion


}
