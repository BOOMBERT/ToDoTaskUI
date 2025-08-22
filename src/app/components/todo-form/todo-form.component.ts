import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToDoItemValidator } from '../../validators/todo-item.validator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ToDoItemService } from '../../services/todo-item.service';
import { Router } from '@angular/router';
import { ToDoItem } from '../../models/todo-item';

@Component({
  selector: 'app-todo-form',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatButtonModule],
  templateUrl: './todo-form.component.html',
  styleUrl: './todo-form.component.css'
})
export class ToDoFormComponent implements OnInit {
  toDoForm: FormGroup = new FormGroup({});

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly todoItemService: ToDoItemService
  ) { }

  ngOnInit(): void {
    this.toDoForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(128), Validators.pattern(/\S+/)]],
      description: ['', [Validators.maxLength(512)]],
      ExpiryDate: [null, [Validators.required, ToDoItemValidator.futureDate]],
      completionPercentage: [0, [Validators.required, Validators.pattern(/^100(\.0{0,2})?$|^([0-9]|[1-9][0-9])(\.[0-9]{0,2})?$/)]],
    });
  }

  onSubmit(): void {
    if (this.toDoForm.valid) {
      let toDoitem: ToDoItem = this.toDoForm.value;
      const toDoItemExpiryDate: Date = new Date(this.toDoForm.value.ExpiryDate);
      toDoitem.expiryDateTimeUtc = toDoItemExpiryDate.toISOString();

      this.todoItemService.addToDoItem(toDoitem).subscribe(() => {
        this.router.navigate(['/todo-items']);
      });
    }
  }
}
