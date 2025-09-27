import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-todo-list',
  imports: [CommonModule, RouterLink, MatCardModule, MatProgressBarModule, MatIconModule, MatButtonModule, MatPaginatorModule],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css'
})
export class ToDoListComponent implements OnInit {
  toDoItems: ToDoItem[] = [];
  pagination: PaginationInfo = {
    totalItemCount: 0,
    totalPageCount: 0,
    pageSize: 0,
    currentPage: 0
  };

  private pageSize = 5;
  private currentPage = 1;

  constructor(
    private readonly toDoItemService: ToDoItemService,
    private readonly dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadItems();
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.loadItems();
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, toDoItem: ToDoItem): void {
    const dialogRef = this.dialog.open(ToDoDialogComponent, {
      width: '80%',
      data: toDoItem,
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (typeof result === 'number') {
        const item = this.toDoItems.find(item => item.id === toDoItem.id);
        if (item && item.completionPercentage !== result) {
          item.completionPercentage = result;
        }
      }
    });
  }

  markToDoItemAsDone(id: string, currentCompletionPercentage: number): void {
    if (currentCompletionPercentage >= 100) return;

    this.toDoItemService.markToDoItemAsDone(id).subscribe(() => {
      const item = this.toDoItems.find(item => item.id === id);
      if (item) {
        item.completionPercentage = 100;
      }
    });
  }

  deleteToDoItem(id: string): void {
    this.toDoItemService.deleteToDoItem(id).subscribe(() => {
      const index = this.toDoItems.findIndex(item => item.id === id);
      if (index !== -1) {
        this.toDoItems.splice(index, 1);
      }
    });
  }

  private loadItems(): void {
    this.toDoItemService.getToDoItems(this.currentPage, this.pageSize).subscribe(response => {
      this.toDoItems = response.data;
      this.pagination = response.pagination;
    });
  }
}
