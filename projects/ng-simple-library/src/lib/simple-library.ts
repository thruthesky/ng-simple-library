const LANGUAGE_CODE = 'language_code';

export interface LanguageText {
  [code: string]: string;
}

export class SimpleLibrary {
  /**
   * Default language code.
   * It can be changed at run tiem.
   */
  static languageCode = 'en';
  constructor() { }
  /**
   * Returns browser language
   *
   * @param full If it is true, then it returns the full language string like 'en-US'.
   *              Otherwise, it returns the first two letters like 'en'.
   *
   * @returns
   *      - the browser language like 'en', 'en-US', 'ko', 'ko-KR'
   *      - null if it cannot detect a language.
   */
  static getBrowserLanguage(full = false): string {
    const nav = window.navigator;
    const browserLanguagePropertyKeys = ['language', 'browserLanguage', 'systemLanguage', 'userLanguage'];
    let ln: string = null;
    // support for HTML 5.1 "navigator.languages"
    if (Array.isArray(nav.languages)) {
      for (let i = 0; i < nav.languages.length; i++) {
        const language = nav.languages[i];
        if (language && language.length) {
          ln = language;
          break;
        }
      }
    }
    // support for other well known properties in browsers
    for (let i = 0; i < browserLanguagePropertyKeys.length; i++) {
      const language = nav[browserLanguagePropertyKeys[i]];
      if (language && language.length) {
        ln = language;
        break;
      }
    }
    if (ln) {
      if (full === false) {
        ln = ln.substring(0, 2);
      }
    }
    return ln;
  }


  /**
   * Gets data from localStroage and returns after JSON.parse()
   * .set() automatically JSON.stringify()
   * .get() automatically JSON.parse()
   *
   * @return
   *      null if there is error or there is no value.
   *      Or value that were saved.
   */
  static get(key: string): any {
    const value = localStorage.getItem(key);
    if (value !== null) {
      try {
        return JSON.parse(value);
      } catch (e) {
        return null;
      }
    }
    return null;
  }




  /**
   * Saves data to localStorage.
   *
   * It does `JSON.stringify()` before saving, so you don't need to do it by yourself.
   *
   * @param key key
   * @param data data to save in localStorage
   */
  static set(key, data): void {
    // console.log("storage::set()", data);
    localStorage.setItem(key, JSON.stringify(data));
  }


  /**
   * Returns language code like 'ko', 'en', 'jp'.
   *
   * It first checks if user has selected his language already (from localStorage).
   * If not, it returns browser language.
   *
   * @return language code.
   */
  static getUserLanguage(): string {
    const ln = SimpleLibrary.get(LANGUAGE_CODE);
    if (ln && ln.length === 2) {
      return ln;
    } else {
      return SimpleLibrary.getBrowserLanguage();
    }
  }

  static setUserLanguage(code: string) {
    SimpleLibrary.set(LANGUAGE_CODE, code);
  }



  /**
   *
   * Returns a string after patching error information.
   * @param str Error string
   * @param info Error information to patch into the string
   *
   *
   *
   * @return patched string
   *
   * @code
   *      _.patchmarker( 'Unknown #no', {no: 123} ) // returns 'Unknown 123'
   *
   */
  static patchMarker(str, info: object = null): string {

    if (info === null || typeof info !== 'object') {
      return str;
    }
    const keys = Object.keys(info);
    if (!keys.length) {
      return str;
    }

    for (const k of keys) {
      str = str.replace('#' + k, (<string>info[k]));
    }
    return str;
  }



  /**
   * Returns http query string.
   *
   * @desc This method is not perfect. It is not developed for complicated query.
   *
   * @param params Object to build as http query string
   * @return
   *      - http query string
   *      - Or null if the input is emtpy or not object.
   */
  static httpBuildQuery(params): string | null {

    if (SimpleLibrary.isEmpty(params)) {
      return null; //
    }

    const keys = Object.keys(params);
    if (keys.length === 0) {
      return null; //
    }

    const esc = encodeURIComponent;
    const query = keys
      .map(k => esc(k) + '=' + esc(params[k]))
      .join('&');
    return query;
  }

  /**
   * Returns n'th portion of the input `str` after spliting by the `separator`
   *
   * @param str string to get a portion from.
   * @param separator to split the string. Default is a Blank.
   * @param n n'th portion to get. Index begins with 0. Default is 0.
   * @return
   *      - a portion of the input string.
   *      - or null
   *          - if the input `str` is empty.
   *          - if the input `str` is not a string.
   *          - if the n'th portion does not exists.
   *          - if the value of the portion is empty
   *          - if separator is not a string and empty.
   *
   * @code
   *      const str = 'abc.def.ghi';
   *      return this.library.segment( str, '.', 0 ); // returns `abc`
   *
   */
  static segment(str: string, separator: string = ' ', n: number = 0): string {
    if (typeof str !== 'string') {
      return null;
    }
    if (typeof separator !== 'string' || !separator) {
      return null;
    }
    if (str) {
      const re = str.split(separator);
      if (re[n] !== void 0 && re[n]) {
        return re[n];
      }
    }
    return null;
  }


  /**
   * Returns true if the input `what` is falsy or empty or no data.
   * @returns true if the input `what` is
   *          - falsy value.
   *              -- boolean and it's false,
   *              -- number with 0.
   *              -- string with empty. ( if it has any vlaue like blank, then it's not empty. )
   *              -- undefined.
   *          - object with no key.
   *          - array with 0 length.
   *
   *      - otherwise return false.
   */
  static isEmpty(what): boolean {
    if (!what) {
      return true; // for number, string, boolean, any falsy.
    }
    if (typeof what === 'object') {
      return Object.keys(what).length === 0;
    }
    if (Array.isArray(what)) {
      return what.length === 0;
    }
    return false;
  }

  /**
   * Compares Scalars, Arrays, Objects.
   *
   * Returns true if the input `a` and `b` are identical.
   *
   * @param a It can be an array, string, number, objects.
   * @param b It can be an array, string, number, objects.
   */
  static isEqual(a, b): boolean {
    if (typeof a === 'object' && typeof b === 'object') {
      const aKeys = Object.keys(a);
      const bKeys = Object.keys(b);
      if (aKeys.length !== bKeys.length) {
        return false;
      }
      return aKeys.findIndex((v, i) => v !== bKeys[i]) === -1;
    } else if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) {
        return false;
      } else {
        for (let i = 0; i < a.length; i++) {
          if (a[i] !== b[i]) {
            return false;
          }
        }
        return true;
      }
    } else {
      return a === b;
    }
  }

  /**
   * Returns true if the input `str` is a string.
   *
   * @param str any value
   */
  static isString(str) {
    return typeof str === 'string';
  }


  /**
   *
   * Removes properties with `undefined` value from the object and returns it.
   *
   * You cannot set `undefiend` value into firestore `document`. It will produce a Critical error.
   *
   * @param obj Object to be set into `firestore`.
   *      It is passed by reference.
   *
   * @return the input object that has sanitized.
   */
  static sanitize(obj): any {
    if (obj) {
      if (typeof obj === 'object') {
        Object.keys(obj).forEach(key => obj[key] === undefined && delete obj[key]);
      }
    }

    /** Remove `password`. It should not  be saved on documents. */
    if (obj && obj['password'] !== void 0) {
      delete obj['password'];
    }

    return obj;
  }



  /**
   * Removes space(s) between the separator in `separator`
   * @description
   *      If the input str is given with `a, b, c c ,d `, then the return will be `a,b,c c,d`.
   * @param separator separator in string
   * @param str string to remove space from.
   *
   * @returns a string after removing spaces between the `separator`.
   *      - if the string is falsy, it returns the input `str` itself.
   */
  static removeSpaceBetween(separator: string, str: string): string {
    if (!str) {
      return str;
    } else {
      return str.split(separator).map(s => s.trim()).join(separator);
    }
  }

  /**
   * returns page width
   *
   * $sm: 576px;
      $md: 768px;
      $lg: 992px;
      $xg: 1200px;
   */
  static pageWidth(): number {
    return window.innerWidth;
  }

  static xs(): boolean {
    return SimpleLibrary.pageWidth() < 576;
  }
  /**
   * Returns true if page width is bigger than 575px
   */
  static sm(): boolean {
    return SimpleLibrary.pageWidth() >= 576;
  }
  /**
   * Returns true if page width is bigger than 767px
   *
   * @example below shows footer only on narrow size.
   *
   *      <ion-footer *ngIf=" ! _.md() ">
   *
   */
  static md(): boolean {
    return SimpleLibrary.pageWidth() >= 768;
  }
  /**
   * Returns true if page width is bigger than 991px
   */
  static lg(): boolean {
    return SimpleLibrary.pageWidth() >= 992;
  }
  /**
   * Returns true if page width is bigger than 1999px
   */
  static xg(): boolean {
    return SimpleLibrary.pageWidth() >= 1200;
  }



  /**
   * It scrolls the page to the top.
   *
   * Use this method when you need to scroll to the top of the page.
   *
   * @param timeout timeout ms
   * @example
   *      _.scrollToTop();
   *      _.scrollToTop(50);
   */
  static scrollToTop(timeout?) {
    if (timeout) {
      setTimeout(() => {
        window.document.body.scrollTop = window.document.documentElement.scrollTop = 0;
        // console.log('scroll, ', timeout);
      }, timeout);
    } else {
      window.document.body.scrollTop = window.document.documentElement.scrollTop = 0;
    }
  }

  /**
   * Returns true if the platform is Cordova.
   */
  static isCordova(): boolean {
    const win = window as any;
    return !!(win['cordova'] || win['phonegap'] || win['PhoneGap']);
  }
  static isWeb(): boolean {
    return !SimpleLibrary.isCordova();
  }

  /**
   * Returns true if the platform is mobile web. not cordova.
   */
  static isMobileWeb(): boolean {
    if (SimpleLibrary.isCordova()) {
      return false;
    }

    const isMobile = /Mobile|iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    return isMobile;
  }

  /**
   * Returns cookie value
   * @param name cookie name
   */
  static getCookie(name: string) {
    const ca: Array<string> = document.cookie.split(';');
    const cookieName = name + '=';
    let c: string;

    for (let i = 0; i < ca.length; i += 1) {
      if (ca[i].indexOf(name, 0) > -1) {
        c = ca[i].substring(cookieName.length + 1, ca[i].length);
        // console.log('valore cookie: ' + c);
        return c;
      }
    }
    return '';
  }




  /**
   * Returns number from string.
   *
   * @param v value of number
   *  number on success
   *  0 if the input cannot be converted into number.
   */
  static parseNumber(v): number {
    if (v) {
      if (isNaN(v)) {
        return 0;
      } else {
        if (typeof v === 'number') {
          return v;
        } else {
          return parseInt(v, 10);
        }
      }
    } else {
      return 0;
    }
  }


  /**
   * Returns true if the app has already requested 'push permission' to the user.
   *
   * @desc Use it only on 'web' platform.
   */
  static isWebPushPermissionRequested() {
    // Let's check if the browser supports notifications
    if (!('Notification' in window) || Notification === void 0 || Notification['permission'] === void 0) {
      // console.log('This browser does not support desktop notification');
      return false;
    }
    // console.log(`Notification['permission']`, Notification['permission']);
    return Notification['permission'] !== 'default';
  }
  /**
   *
   * @desc Use it only on 'web' platform.
   */
  static isWebPushPermissionDenied() {
    if (SimpleLibrary.isWebPushPermissionRequested()) {
      return Notification['permission'] === 'denied';
    } else {
      return false;
    }
  }
  /**
   *
   * @desc Use it only on 'web' platform.
   */
  static isWebPushPermissionGranted() {
    if (SimpleLibrary.isWebPushPermissionRequested()) {
      return Notification['permission'] === 'granted';
    } else {
      return false;
    }
  }



  /**
   * (Cordova 가 아니고) 푸시 권한을 물어보지 않았으면 참을 리턴.
   * Cordova 이거나, 권한을 이미 물어봤으면 false 를 리턴
   * Check if 'push notification' permission has requested to the user or not.
   *
   * @returns
   *      true - if the Permission is not requested yet. So, it needs to request.
   *      false - if the Permission is already requested to the user
   *              or if the platform is Cordova
   */
  // static get isWebPushPermissionNotRequested(): boolean {
  //     if (!SimpleLibrary.isCordova()) {
  //         if (!SimpleLibrary.isWebPushPermissionRequested()) {
  //             return true;
  //         }
  //     }
  //     return false;
  // }

  /**
   * (Cordova가 아니고) 푸시 권한을 거절했으면 참을 리턴.
   * Return true if the user rejected push notification.
   *
   * @returns
   *      true - (Cordova 가 아니고) 거절 했으면, 참.
   *      false - Cordova 이거나 거절을 안했으면 false.
   */
  // static get isWebPushPermissionDenied(): boolean {
  //     if (!SimpleLibrary.isCordova()) {
  //         if (SimpleLibrary.isPushPermissionDenied()) {
  //             return true;
  //         }
  //     }
  //     return false;
  // }



  /**
   * returns the last element of array or undefined if there is no value.
   * @param arr array
   */
  static last(arr) {
    if (arr && arr.length) {
      return arr[arr.length - 1];
    }
  }

  /**
   * Returns true if the mime type is for image.
   * @param type Mime type
   */
  static isImageType(type: string): boolean {
    if (type === void 0 || !type || typeof type !== 'string') {
      return false;
    }
    if (type.indexOf('image') !== 0) {
      return false;
    }
    return true;
  }

  static humanFileSize(size: any) {
    // var i = Math.floor(Math.log(size) / Math.log(1024));
    size = SimpleLibrary.parseNumber(size);
    const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
    return (<any>(size / Math.pow(1024, i))).toFixed(2) * 1 + '' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
  }

  /**
   * strip out HTML tags.
   * @param str string
   * @returns
   *    empty string on error.
   */
  static stripTags(str): string {
    if (!str) {
      return '';
    }
    const re = new RegExp(/<\/?.+?>/ig);
    return str.replace(re, '');
  }


  /**
   * Remove HTML entities
   * @param input input string
   */
  static htmlDecode(input) {
    const doc = new DOMParser().parseFromString(input, 'text/html');
    return doc.documentElement.textContent;
  }


  /**
   * Returns the salt
   * @param len length of random string without the length of salt
   * @param salt salt
   */
  static randomString(len = 15, salt = ''): string {
    const rnd = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
    const str = rnd.substring(2, len + 2);
    if (salt) {
      return salt + str;
    } else {
      return str;
    }
  }


  /**
   * Return binary from Base64.
   * Base64 데이터를 바이너리로 변경해서 리턴한다.
   *
   */
  static base64toBlob(b64Data, contentType = 'image/jpeg', sliceSize = 512): Blob {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  /**
   * Returns date string in 'YYYYMMDD-HHIISS'.
   */
  static dateString() {
    const d = new Date();
    return d.getFullYear() + (d.getMonth() + 1) + d.getDate() + '-' + d.getHours() + d.getMinutes() + d.getSeconds();
  }


  /**
   * @see https://www.jstips.co/en/javascript/create-range-0...n-easily-using-one-line/
   * @see https://jsperf.com/create-1-n-range
   *
   * @param n 0...N number to return as array.
   * @param base default
   */
  static makeArrayNumber(n: number = 0, base: number = 0): Array<number> {
    // return Array.apply(null, {length: n}).map((value, index) => index + indexStart);
    const arr = [];
    for (let i = 0; i < n; i++) {
      arr.push(i + base);
    }
    return arr;
  }

  /**
   * Returns age based on the birthday.
   * @param birthday Birthday
   */
  static getAge(birthday) {
    const n = new Date();
    const year = birthday.substr(0, 4);
    return n.getFullYear() - parseInt(year, 10);
  }

  /**
   * Returns keys of object.
   * @param o Object
   */
  static keys(o): Array<string> {
    if (o && typeof o === 'object') {
      return Object.keys(o);
    } else {
      return [];
    }
  }


  /**
   * Returns translated text string.
   * @param code code and text to translate
   * @param info information to add on the translated text
   * @example
   *    SimpleLibrary.translate({en: 'Name', ko: '이름'});
   */
  static translate(code: LanguageText, info?): string {
    // console.log('lang: ', this.languageCode);
    if (!code) {
      return 'CODE_EMPTY';
    }
    let str = code[SimpleLibrary.languageCode];
    if (!str) {
      str = code['en'];
    }
    return SimpleLibrary.patchMarker(str, info);
  }

  /**
   * Alias of translate()
   * @param code same as translate()
   * @param info same as transate()
   */
  static t(code: LanguageText, info?: any): string {
    return SimpleLibrary.translate(code, info);
  }


}

