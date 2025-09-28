import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToDoItem } from '../../models/todo-item';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-todo-dialog',
  imports: [CommonModule, MatInputModule, FormsModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './todo-dialog.component.html',
  styleUrl: './todo-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToDoDialogComponent implements OnInit {
  private readonly _dialogRef = inject(MatDialogRef<ToDoDialogComponent>);
  private readonly _router = inject(Router);
  private readonly _formBuilder = inject(FormBuilder);
  readonly data = inject<ToDoItem>(MAT_DIALOG_DATA);

  toDoDialogForm: FormGroup = this._formBuilder.group({});

  ngOnInit(): void {
    this.toDoDialogForm = this._formBuilder.group({
      completionPercentage: [this.data.completionPercentage, [Validators.required, Validators.pattern(/^100(\.0{0,2})?$|^([0-9]|[1-9][0-9])(\.[0-9]{0,2})?$/)]]
    });
  }

  closeDialog(): void {
    this._dialogRef.close(this.toDoDialogForm.valid ? this.toDoDialogForm.value.completionPercentage : null);
  }

  navigateToEdit(): void {
    this._dialogRef.close();
    this._router.navigate([`/todo-items/${this.data.id}/edit`]);
  }
}
