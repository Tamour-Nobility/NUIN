import { AbstractControl } from '@angular/forms';

export function MatchPassword(group: AbstractControl) {
    let password = group.get('password').value;
    let confirmPassword = group.get('confirmPassword').value;
    if (password !== confirmPassword) {
        group.get('confirmPassword').setErrors({ MatchPassword: true });
    }
    else {
        return null;
    }
}