import { Routes } from '@angular/router';
import { ToDoListComponent } from './components/todo-list/todo-list.component';
import { ToDoFormComponent } from './components/todo-form/todo-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/todo-items', pathMatch: 'full' },
  {
    path: 'todo-items',
    children: [
      { path: '', component: ToDoListComponent },
      { path: 'new', component: ToDoFormComponent }
    ]
  }
];
