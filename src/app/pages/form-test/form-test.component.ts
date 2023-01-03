import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParentFormComponent } from 'app/components/parent-form/parent-form.component';

@Component({
  selector: 'fo-form-test',
  standalone: true,
  imports: [
    CommonModule,
    ParentFormComponent
  ],
  templateUrl: './form-test.component.html',
  styleUrls: ['./form-test.component.scss']
})
export class FormTestComponent {

}
