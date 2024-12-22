import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter',
    standalone: false
})
export class FilterPipe implements PipeTransform {

    transform(items: any[], searchTerm: string, labelKey?: string) {
        if (!items || !searchTerm) {
            return items;
        }
        return items.filter(item => item[labelKey || 'label'].toLowerCase().includes(searchTerm.toLowerCase()) === true);
    }
}
