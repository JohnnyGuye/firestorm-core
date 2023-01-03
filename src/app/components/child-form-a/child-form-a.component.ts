import { Component, Provider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';

export const FormPart: Provider = {
  provide: ControlContainer,
  useExisting: FormGroupDirective,
};

@Component({
  selector: 'fo-child-form-a',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './child-form-a.component.html',
  styleUrls: ['./child-form-a.component.scss'],
  viewProviders: [FormPart]
})
export class ChildFormAComponent {
}
