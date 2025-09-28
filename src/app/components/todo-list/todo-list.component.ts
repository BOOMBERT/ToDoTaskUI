import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ToDoItemService } from '../../services/todo-item.service';
import { ToDoItem } from '../../models/todo-item';
import { PaginationInfo } from '../../models/pagination-info';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ToDoDialogComponent } from '../todo-dialog/todo-dialog.component';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, filter, map, Observable, of, shareReplay, startWith, switchMap, tap } from 'rxjs';
import { PaginationParams } from '../../interfaces/pagination-params';

@Component({
  selector: 'app-todo-list',
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatProgressBarModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToDoListComponent implements OnInit {
  toDoItems$: Observable<ToDoItem[]> = of();
  pagination$: Observable<PaginationInfo> = of();

  private _paginationSubject = new BehaviorSubject<PaginationParams>({ pageNumber: 1, pageSize: 5 });
  private readonly _toDoItemService = inject(ToDoItemService);
  private readonly _dialog = inject(MatDialog);

  searchPhraseControl = new FormControl('', [Validators.maxLength(512)]);

  ngOnInit(): void {
    const searchPhrase$ = this.searchPhraseControl.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      startWith(this.searchPhraseControl.value ?? ''),
      tap(() => this._paginationSubject.next({ pageNumber: 1, pageSize: this._paginationSubject.value.pageSize }))
    );

    const pagination$ = this._paginationSubject.asObservable();

    const response$ = combineLatest([searchPhrase$, pagination$]).pipe(
      switchMap(([searchPhrase, { pageNumber, pageSize }]) =>
        this._toDoItemService.getToDoItems(searchPhrase ?? '', pageNumber, pageSize)
      ),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    this.toDoItems$ = response$.pipe(map(response => response.data));
    this.pagination$ = response$.pipe(map(response => response.pagination));
  }

  onPageChange(event: PageEvent): void {
    this._paginationSubject.next({ pageNumber: event.pageIndex + 1, pageSize: event.pageSize });
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, toDoItem: ToDoItem): void {
    const dialogRef = this._dialog.open(ToDoDialogComponent, {
      width: '80%',
      data: toDoItem,
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true,
      autoFocus: false
    });

    dialogRef.afterClosed().pipe(
      filter((result) => typeof result === 'number' && toDoItem.completionPercentage !== result),
      switchMap((result) => this._toDoItemService.updateToDoItemCompletionPercentage(toDoItem.id, result)),
      tap(() => this._paginationSubject.next(this._paginationSubject.value))
    ).subscribe();
  }

  markToDoItemAsDone(toDoItem: ToDoItem): void {
    if (toDoItem.completionPercentage === 100) {
      return;
    }
    
    this._toDoItemService.markToDoItemAsDone(toDoItem.id).pipe(
      tap(() => this._paginationSubject.next(this._paginationSubject.value))
    ).subscribe();
  }

  deleteToDoItem(id: string): void {
    this._toDoItemService.deleteToDoItem(id).pipe(
      tap(() => this._paginationSubject.next({ pageNumber: 1, pageSize: this._paginationSubject.value.pageSize }))
    ).subscribe();
  }

  clearSearchPhrase() {
    this.searchPhraseControl.setValue('');
  }
}
