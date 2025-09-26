import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { ToDoItemResponse } from '../models/todo-item-response';
import { ToDoItem } from '../models/todo-item';

@Injectable({
  providedIn: 'root'
})
export class ToDoItemService {
  private readonly apiUrl = environment.apiUrl + '/todoitems';

  constructor(private readonly http: HttpClient) { }

  addToDoItem(item: ToDoItem): Observable<void> {
    return this.http.post<void>(this.apiUrl, item);
  }

  getToDoItems() : Observable<ToDoItemResponse> {
    return this.http.get<ToDoItemResponse>(this.apiUrl);
  }

  getToDoItem(id: string) : Observable<ToDoItem> {
    return this.http.get<ToDoItem>(`${this.apiUrl}/${id}`);
  }

  updateToDoItem(id: string, item: ToDoItem) : Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, item);
  }

  markToDoItemAsDone(id: string) : Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/mark-as-done`, {});
  }

  updateToDoItemCompletionPercentage(id: string, newPercentage: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/completion-percentage`, { completionPercentage: newPercentage });
  }

  deleteToDoItem(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
