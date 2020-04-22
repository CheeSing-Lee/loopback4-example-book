import {AnyObject} from '@loopback/repository';

export namespace testUtil {
  export function verifyJsonResult(obj1: AnyObject, obj2: AnyObject) {
    const errors: AnyObject = {};

    // Loop through the first object
    Object.keys(obj1).forEach(key => {
      const objDiff = compare(obj1[key], obj2[key], key);
      if (Object.keys(objDiff).length > 0) {
        errors[key] = objDiff;
      }
    });

    // Loop through the second object and find missing items
    Object.keys(obj2).forEach(key => {
      if (!obj1[key] && obj1[key] !== obj2[key]) {
        errors[key] = obj2[key];
      }
    });

    return errors;
  }

  // Check if two arrays are equal
  function arraysMatch(arr1: AnyObject, arr2: AnyObject) {
    // Check if the arrays are the same length
    if (arr1.length !== arr2.length) {
      return false;
    }

    // Check if all items exist and are in the same order
    for (let i = 0, sz = arr1.length; i < sz; i++) {
      const objDiff = verifyJsonResult(arr1[i], arr2[i]);
      if (Object.keys(objDiff).length > 0) {
        return false;
      }
    }

    // Otherwise, return true
    return true;
  }

  // Compare two items and push non-matches to object
  function compare(item1: AnyObject, item2: AnyObject, key: string) {
    const errors: AnyObject = {};

    // Get the object type
    const type1 = Object.prototype.toString.call(item1);
    const type2 = Object.prototype.toString.call(item2);

    // check if type2 is undefined
    if (type2 === '[object Undefined]') {
      errors[key] = null;
      return errors;
    }

    // check if types are different
    if (type1 !== type2) {
      errors[key] = item2;
      return errors;
    }

    // If an object, compare recursively
    if (type1 === '[object Object]') {
      const objDiff = verifyJsonResult(item1, item2);
      if (Object.keys(objDiff).length > 0) {
        errors[key] = objDiff;
      }
      return errors;
    }

    // If an array, compare
    if (type1 === '[object Array]') {
      if (!arraysMatch(item1, item2)) {
        errors[key] = item2;
      }
      return errors;
    }

    // If a string, compare
    if (type1 === '[object String]') {
      if (!compareDate(item1.toString(), item2.toString())) {
        errors[key] = item2;
      }
      return errors;
    }

    return errors;
  }

  function compareDate(item1: string, item2: string) {
    // verify date type
    const dateExp = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2}).(\d{3})/;
    return !(
      (dateExp.test(item1) && !dateExp.test(item2)) ||
      (dateExp.test(item2) && !dateExp.test(item1))
    );
  }
}
