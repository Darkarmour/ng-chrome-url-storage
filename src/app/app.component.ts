import { Component, OnInit } from '@angular/core';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  firebaseLinks: AngularFireList<string>;
  links: Array<string> = [];
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
    this.firebaseLinks = db.list('/links');
  }

  ngOnInit() {
    this.getLinks();
  }

  getLinks() {
    this.db.list('/links').snapshotChanges().subscribe(response => {
      this.links = [];
      if (response && response.length) {
        for (let data of response) {
          this.links.push((data.payload.val()).toString())
        }
      }
      console.log('Links', this.links)
      this.isLoading = false;
    })
  }

  saveLink() {
    let isExistingLink: boolean = this.links.find(i => i === this.link) ? true : false;
    var expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    let urlRegex = new RegExp(expression);
    if (isExistingLink) {
      this.showAlert('error', 'Bookmark already exists.');
    }
    else if (!this.link.match(urlRegex)) {
      this.showAlert('error', 'Bookmark is not a valid link.');
    }
    else {
      this.firebaseLinks.push(this.link);
      this.showAlert('success', `Saved bookmark!`);
      this.link = '';
    }
  }

  openLink(link: string) {
    window.open(link);
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
