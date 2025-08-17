import { AbstractControl, ValidationErrors } from "@angular/forms";

export class ToDoItemValidator {
  static futureDate(control: AbstractControl): ValidationErrors | null {
    const nowDate = new Date();
    const selectedDate = new Date(control.value);

    return selectedDate.getTime() >= nowDate.getTime() ? null : { notFutureDate: true };
  }
}