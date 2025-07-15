import * as moment from 'moment';

export abstract class Common {
    public static isNullOrEmpty(str: any): boolean {
        return (str == null || str == undefined || str == '' || str == 0) ? true : false;
    }
    public static isNullOrEmptywithoutzero(str: any): boolean {
        return (str == null || str == undefined || str == '') ? true : false;
    }
    public static Distinct = (value, index, self) => {
        return self.indexOf(value) === index;
    }
    public static SplitFullName = (fullName: string) => {
        let names = [] = fullName.trim().split(',');
        if (Array.isArray(names) && names.length)
            return { lastName: names[0].trim(), firstName: names[1].trim() };
        return { lastName: "", firstName: "" };
    }
    public static DateMask = (event) => {
        var v = event.target.value;
        if (v.match(/^\d{2}$/) !== null) {
            event.target.value = v + '/';
        } else if (v.match(/^\d{2}\/\d{2}$/) !== null) {
            event.target.value = v + '/';
        }
    }
    public static encodeBase64 = (plainText: string) => {
        return btoa(plainText);
    }
    public static decodeBase64 = (encodedText: string) => {
        return atob(encodedText);
    }
    public static monthYearToDate(monthYear: string, delimeter: string): any {
        // split the month year based on delimeter
        var my = monthYear.split(delimeter);
        // parse the string date and get the number of miliseconds
        var d = Date.parse(`${my[0]} 1, ${my[1]}`);
        if (!isNaN(d)) {
            return moment(new Date(d)).format("MM/DD/YYYY");
        }
        return -1;
    }
}