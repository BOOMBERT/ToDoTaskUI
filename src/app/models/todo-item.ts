export interface ToDoItem {
    id: string;
    title: string;
    description: string;
    expiryDateTimeUtc: Date;
    completionPercentage: number;
}
