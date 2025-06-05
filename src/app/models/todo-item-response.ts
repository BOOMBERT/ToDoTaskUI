import { PaginationInfo } from "./pagination-info";
import { ToDoItem } from "./todo-item";

export interface ToDoItemResponse {
    data: ToDoItem[];
    pagination: PaginationInfo;
}
