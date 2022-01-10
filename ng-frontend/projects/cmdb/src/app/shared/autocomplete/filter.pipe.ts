import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter'
})
export class FilterPipe implements PipeTransform {

    transform(items: any[], searchTerm: string, labelKey?: string) {
        if (!items || !searchTerm) {
            return items;
        }
        console.log(searchTerm, items);
        return items.filter(item => item[labelKey || 'label'].toLowerCase().includes(searchTerm.toLowerCase()) === true);
    }
}
