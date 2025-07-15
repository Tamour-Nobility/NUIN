import { AbstractControl } from '@angular/forms';

export function ZipCodeLength(control: AbstractControl) {
    let zipCode = control.value;
    if (zipCode != null)
        return zipCode.length == 5 || zipCode.length == 9 ? null : { 'ZipCodeLength': true };
    else
        return null;
}