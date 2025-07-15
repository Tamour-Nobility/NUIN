import { AbstractControl } from '@angular/forms';
export function ValidateWhiteSpace(control: AbstractControl) {
    const isWhiteSpace = (control.value || '').trim().length === 0;
    const isValid = !isWhiteSpace;
    return isValid ? null : { 'whiteSpace': true };
}
