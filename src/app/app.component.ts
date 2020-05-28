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
      this.isLoading = false;
      console.log(response)
    })
  }

  saveLink() {
    let isExistingLink: boolean = this.links.find(i => i === this.link) ? true : false;
    if (isExistingLink) {
      console.log(this.alerts)
      this.showAlert('error', 'Link already exists.');
    }
    else {
      this.firebaseLinks.push(this.link);
      this.showAlert('success', `Saved Link!`);
      this.link = '';
    }
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
