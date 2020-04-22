import {bind, BindingScope} from '@loopback/core';
import {AnyObject} from '@loopback/repository';

@bind({scope: BindingScope.TRANSIENT})
export class BookService {
  public formatObject(result: AnyObject) {
    return this.findAndFormatDate(result);
  }

  private findAndFormatDate(result: AnyObject) {
    for (const key in result) {
      const obj = result[key];
      if (obj instanceof Date) {
        result[key] = this.formatDate(obj);
      } else if (obj && typeof obj === 'object') {
        result[key] = this.findAndFormatDate(obj);
      }

      if (key === 'id') {
        delete result[key];
      }
    }

    return result;
  }

  private formatDate(date: Date) {
    const offset = date.getTimezoneOffset();
    const localDateTime = new Date(date.getTime() - offset * 60 * 1000);
    const ISODate = localDateTime.toISOString();
    return `${ISODate.slice(0, 10)} ${ISODate.slice(11, 23)}`;
  }
}
