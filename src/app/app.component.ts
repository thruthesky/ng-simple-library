import { Component } from '@angular/core';
import { SimpleLibrary as _ } from 'ng-simple-library';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = '';


  constructor() {
    const str = '<h1>H1</h1>';
    console.log(_.stripTags(str));
    console.log(_.getBrowserLanguage());
    console.log(_.t({ en: 'Name', ko: '이름' }));
  }
}
