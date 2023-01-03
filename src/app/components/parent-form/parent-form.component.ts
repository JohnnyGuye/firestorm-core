import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChildFormAComponent } from '../child-form-a/child-form-a.component';
import { ChildFormBComponent } from '../child-form-b/child-form-b.component';
import { ChildFormCComponent } from '../child-form-c/child-form-c.component';

@Component({
  selector: 'fo-parent-form',
  standalone: true,
  imports: [CommonModule, ChildFormAComponent, ChildFormBComponent, ChildFormCComponent, ReactiveFormsModule],
  templateUrl: './parent-form.component.html',
  styleUrls: ['./parent-form.component.scss']
})
export class ParentFormComponent {

  form: FormGroup = new FormGroup({
    parentTitle: new FormControl(''),
    childATitle: new FormControl(''),
    childBStandalone: new FormGroup({
      title: new FormControl('')
    }),
    childCStandalone: new FormControl(""),
    nestedChildBStandalone: new FormGroup({
      nest: new FormGroup({
        title: new FormControl('')
      })
    }),
    childBArray: new FormArray([
      new FormGroup({
        title: new FormControl('')
      }),
      new FormGroup({
        title: new FormControl('')
      })
    ])
  })

  get childrenB() {
    return this.form.get('childBArray') as FormArray
  }

  get formValue() {
    return JSON.stringify(this.form.getRawValue(), null, 2)
  }

  public onSubmit() {
    console.log("Submission:", this.form)
  }
}
