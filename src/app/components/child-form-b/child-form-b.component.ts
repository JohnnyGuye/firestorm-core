import { Component, Input, Provider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';

export const FormPart: Provider = {
  provide: ControlContainer,
  useExisting: FormGroupDirective,
};

@Component({
  selector: 'fo-child-form-b',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './child-form-b.component.html',
  styleUrls: ['./child-form-b.component.scss'],
  viewProviders: [FormPart]
})
export class ChildFormBComponent {

  @Input()
  formGroupName: string | number = ""

}
