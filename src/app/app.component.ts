import { Component, OnInit } from '@angular/core';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  firebaseBookmarks: AngularFireList<Bookmark>;
  bookmarks: Array<Bookmark> = [];
  link: string;
  isLoading: boolean = true;
  alerts: {
    success?: boolean,
    error?: boolean
  } = {};
  alertMessage: {
    success?: string,
    error?: string
  } = {};

  constructor(
    public db: AngularFireDatabase) {
    this.firebaseBookmarks = db.list('/bookmarks');
  }

  ngOnInit() {
    this.getBookmarks();
  }

  getBookmarks() {
    this.db.list('/bookmarks').snapshotChanges().subscribe(response => {
      this.bookmarks = [];
      if (response && response.length) {
        for (let data of response) {
          let firebaseData = data.payload.val();
          let bookmark: Bookmark = {
            link: firebaseData['link'],
            updatedAt: firebaseData['updatedAt']
          }
          this.bookmarks.push(bookmark)
        }
      }
      this.isLoading = false;
    })
  }

  saveBookmark() {
    let isExistingBookmark: boolean = this.bookmarks.find(i => i.link === this.link) ? true : false;
    var expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    let urlRegex = new RegExp(expression);
    if (isExistingBookmark) {
      this.showAlert('error', 'Bookmark already exists.');
    }
    else if (!this.link.match(urlRegex)) {
      this.showAlert('error', 'Bookmark is not a valid link.');
    }
    else {
      let bookmark: Bookmark = {
        link: this.link,
        updatedAt: new Date().valueOf()

      };
      this.firebaseBookmarks.push(bookmark);
      this.showAlert('success', `Saved bookmark!`);
      this.link = '';
    }
  }

  openBookmark(bookmark: string) {
    window.open(bookmark);
  }

  showAlert(type: string, message: string) {
    this.alertMessage[type] = message;
    this.alerts[type] = true;
    setTimeout(() => {
      this.alerts[type] = false;
      this.alertMessage[type] = undefined;
    }, 3000);
  }
}

export interface Bookmark {
  link: string
  updatedAt: number
}
