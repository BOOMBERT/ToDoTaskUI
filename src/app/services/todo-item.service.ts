import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { ToDoItemResponse } from '../models/todo-item-response';
import { ToDoItem } from '../models/todo-item';

@Injectable({
  providedIn: 'root'
})
export class ToDoItemService {
  private readonly _apiUrl = environment.apiUrl + '/todoitems';
  private readonly _httpClient = inject(HttpClient);

  addToDoItem(item: ToDoItem): Observable<void> {
    return this._httpClient.post<void>(this._apiUrl, item);
  }

  getToDoItems(searchPhrase: string, pageNumber: number, pageSize: number): Observable<ToDoItemResponse> {
    return this._httpClient.get<ToDoItemResponse>(this._apiUrl, {
      params: {
        searchPhrase: searchPhrase,
        pageNumber: pageNumber,
        pageSize: pageSize
      }
    });
  }

  getToDoItem(id: string) : Observable<ToDoItem> {
    return this._httpClient.get<ToDoItem>(`${this._apiUrl}/${id}`);
  }

  updateToDoItem(id: string, item: ToDoItem) : Observable<void> {
    return this._httpClient.put<void>(`${this._apiUrl}/${id}`, item);
  }

  markToDoItemAsDone(id: string) : Observable<void> {
    return this._httpClient.patch<void>(`${this._apiUrl}/${id}/mark-as-done`, {});
  }

  updateToDoItemCompletionPercentage(id: string, newPercentage: number): Observable<void> {
    return this._httpClient.patch<void>(`${this._apiUrl}/${id}/completion-percentage`, { completionPercentage: newPercentage });
  }

  deleteToDoItem(id: string): Observable<void> {
    return this._httpClient.delete<void>(`${this._apiUrl}/${id}`);
  }
}
