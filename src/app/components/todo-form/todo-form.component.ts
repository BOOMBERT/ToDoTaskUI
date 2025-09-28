import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToDoItemValidator } from '../../validators/todo-item.validator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ToDoItemService } from '../../services/todo-item.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToDoItem } from '../../models/todo-item';

@Component({
  selector: 'app-todo-form',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatButtonModule],
  templateUrl: './todo-form.component.html',
  styleUrl: './todo-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToDoFormComponent implements OnInit {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _router = inject(Router);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _todoItemService = inject(ToDoItemService);

  toDoForm: FormGroup = new FormGroup({});

  ngOnInit(): void {
    this.toDoForm = this._formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(128), Validators.pattern(/\S+/)]],
      description: ['', [Validators.maxLength(512)]],
      ExpiryDate: [null, [Validators.required, ToDoItemValidator.futureDate]],
      completionPercentage: [0, [Validators.required, Validators.pattern(/^100(\.0{0,2})?$|^([0-9]|[1-9][0-9])(\.[0-9]{0,2})?$/)]],
    });

    let id = this._activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this._todoItemService.getToDoItem(id).subscribe(toDoItem => {
        this.toDoForm.patchValue({
          ...toDoItem,
          ExpiryDate: this.formatDateForInput(new Date(toDoItem.expiryDateTimeUtc))
        });
      });
    }
  }

  onSubmit(): void {
    if (this.toDoForm.valid) {
      let toDoitem: ToDoItem = this.toDoForm.value;
      const toDoItemExpiryDate: Date = new Date(this.toDoForm.value.ExpiryDate);
      toDoitem.expiryDateTimeUtc = toDoItemExpiryDate.toISOString();

      let id = this._activatedRoute.snapshot.paramMap.get('id');
      if (id) {
        this._todoItemService.updateToDoItem(id, toDoitem).subscribe(() => {
          this._router.navigate(['/todo-items']);
        });
      } else {
        this._todoItemService.addToDoItem(toDoitem).subscribe(() => {
          this._router.navigate(['/todo-items']);
        });
      }
    }
  }

  private formatDateForInput(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return date.getFullYear() + '-' +
      pad(date.getMonth() + 1) + '-' +
      pad(date.getDate()) + 'T' +
      pad(date.getHours()) + ':' +
      pad(date.getMinutes());
  }
}
