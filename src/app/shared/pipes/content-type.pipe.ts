import { Pipe, PipeTransform } from '@angular/core';
import { DataService } from '@core/utils/data.service';

@Pipe({
    name: '_content_type',
})
export class ContentTypePipe implements PipeTransform {
    constructor(private dataService: DataService) {}

    transform(value: string): string {
        const data = this.dataService.getStaticData('CONTENT_TYPES');
        const item = data.filter(contentType => {
            return contentType.key === value;
        });
        if (item.length) {
            return item[0].description;
        } else {
            return '';
        }
    }
}
