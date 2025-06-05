import { Routes } from '@angular/router';
import { ToDoListComponent } from './components/todo-list/todo-list.component';

export const routes: Routes = [
    {path: '', redirectTo: '/todo-items', pathMatch: 'full'},
    {path: 'todo-items', component: ToDoListComponent}
];
