import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { ToDoItemResponse } from '../models/todo-item-response';

@Injectable({
  providedIn: 'root'
})
export class ToDoItemService {
  private readonly apiUrl = environment.apiUrl + '/todoitems';

  constructor(private readonly http: HttpClient) { }

  getTodoItems() : Observable<ToDoItemResponse> {
    return this.http.get<ToDoItemResponse>(this.apiUrl);
  }

  markToDoItemAsDone(id: string) : Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/mark-as-done`, {});
  }

  deleteToDoItem(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
