import { Pipe, PipeTransform } from '@angular/core';
 
@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;
 
    // Convert search text to lowercase for case-insensitive search
    const lowerSearchText = searchText.toLowerCase();
 
    return items.filter(item => {
      return Object.keys(item).some(key => {
        const value = item[key];
 
        // Check if the value is a date object or a date string
        const isDate = !isNaN(Date.parse(value));
 
        if (isDate) {
          // Convert the date to a standardized format for comparison (e.g., MM/dd/yyyy)
          const date = new Date(value);
          const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
         
          // Check if the formatted date contains the search text
          return formattedDate.includes(lowerSearchText);
        } else {
          // Perform standard string search for non-date values
          return String(value).toLowerCase().includes(lowerSearchText);
        }
      });
    });
  }
}
