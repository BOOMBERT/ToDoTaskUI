import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToDoItem } from '../../models/todo-item';
import { MatInputModule } from '@angular/material/input';
import { ToDoItemService } from '../../services/todo-item.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-todo-dialog',
  imports: [CommonModule, MatInputModule, FormsModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './todo-dialog.component.html',
  styleUrl: './todo-dialog.component.css'
})
export class ToDoDialogComponent {
  toDoDialogForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ToDoItem,
    private readonly dialogRef: MatDialogRef<ToDoDialogComponent>,
    private readonly toDoItemService: ToDoItemService,
    private readonly formBuilder: FormBuilder
  ) {
    this.toDoDialogForm = this.formBuilder.group({
      completionPercentage: [data.completionPercentage, [Validators.required, Validators.pattern(/^100(\.0{0,2})?$|^([0-9]|[1-9][0-9])(\.[0-9]{0,2})?$/)]]
    });
  }

  closeDialog(): void {
    if (this.toDoDialogForm.valid) {
      if (this.toDoDialogForm.value.completionPercentage !== this.data.completionPercentage) {
        this.toDoItemService.updateToDoItemCompletionPercentage(this.data.id, this.toDoDialogForm.value.completionPercentage).subscribe();
      }
      this.dialogRef.close(this.toDoDialogForm.value.completionPercentage);
    }
  }
}
