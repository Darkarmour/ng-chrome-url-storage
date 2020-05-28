import { Component } from '@angular/core';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  urls: AngularFireList<string>;
  url: string;

  constructor(db: AngularFireDatabase) {
    this.urls = db.list('/urls')
    console.log('Urls', this.urls);
  }

  saveUrl() {
    this.urls.push(this.url);
  }
}
