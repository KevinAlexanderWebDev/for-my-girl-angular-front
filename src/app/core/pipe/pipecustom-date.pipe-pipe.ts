import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDate',
  standalone: true
})
export class CustomDatePipe implements PipeTransform {
  transform(value: string | Date, format: 'long' | 'short' = 'long', locale: string = 'es-MX'): string {
    if (!value) return '';

    const date = new Date(value);

    const options: Intl.DateTimeFormatOptions =
      format === 'short'
        ? { day: '2-digit', month: '2-digit', year: 'numeric' }
        : { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    return new Intl.DateTimeFormat(locale, options).format(date);
  }
}
