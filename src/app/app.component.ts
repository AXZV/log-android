import { Component,ViewChild } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import * as firebase from 'firebase'
import { Unsubscribe } from '@firebase/util';
import { FIREBASE_CREDENTIALS } from './firebase.credentials';
import { Platform, Nav, ToastController, AlertController,   } from 'ionic-angular';
import { AboutPage } from '../pages/about/about';
import { HomePage } from '../pages/home/home';
import { Events } from 'ionic-angular';
import { ProfilePage } from '../pages/profile/profile';
import { Network } from '@ionic-native/network';




@Component({
  templateUrl: 'app.html',
})


export class MyApp {
  platform: any;
  keyboard: any;
  rootPage:any;
  profile: any;
  imgsource: any;
  public counter=0;
  

  @ViewChild(Nav) nav:Nav;  

  pages: Array<{myIcon:string, title:string, component:any}>;
  profileimage: Array<{alphabet:string}>;
  
  iconhome:string = "home";
  icongroup:string = "people";
  iconfaq:string = "help";
  iconsetting:string = "settings";
  iconlogout:string = "log-out";

  activePage:any;

  constructor(
    
    platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen,
    public events: Events,
    public toastCtrl: ToastController,
    private network: Network,
    public alertCtrl: AlertController,
 

) 
    {

      // ================================ check connection ===================================

      let alertoffline = this.alertCtrl.create({
        // title: 'Low battery',
        // subTitle: '10% of battery remaining',
        message: 'Device is offline, Some function may not be work, Please check your connection :(',
        buttons: ['Dismiss']
      });

      this.network.onDisconnect().subscribe(() => {
        console.log('network was disconnected :-(');
        alertoffline.present();
        
      });

      this.network.onConnect().subscribe(() => {
        console.log('network connected!');
        alertoffline.dismiss();
        this.toastCtrl.create({
          message: 'Device is online :)',
          duration: 3000
        }).present();
      });



      // ====================== exit button ===================================
      

        platform.registerBackButtonAction(() => {
          if (this.counter == 0) {
            this.counter++;
            this.presentToast();
            setTimeout(() => { this.counter = 0 }, 3000)
          } else {
            // console.log("exitapp");
            platform.exitApp();
          }
        }, 0);
    
  
  
     

// =============================== Get data =================================================

      events.subscribe('event:senddata', (data) => {
        // console.log(data);
        this.profile = data;
    
         // ========================= Profile Pict =============================================
              var x = (data.fullname);
              this.profileimage=
              [
                {alphabet:(x.charAt(0))}
              ];
         // =====================================================================================
      });

// =============================== Get data =================================================
      events.subscribe('event:sendprofilepic', (url) => {
        this.imgsource = url;
    
      });

       

// =====================================================================================
      firebase.initializeApp(FIREBASE_CREDENTIALS);
      const unsubscribe: Unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.rootPage = 'HomePage';
        unsubscribe();
      } else {
        this.rootPage = 'LoginPage';
        unsubscribe();
      }
      });

// =====================================================================================
      
      
      this.pages=[
        {myIcon:this.iconhome, title:'Home', component:HomePage},
        {myIcon:this.icongroup, title:'Group', component:AboutPage},
        {myIcon:this.iconsetting, title:'Setting', component:ProfilePage},
        {myIcon:this.iconfaq, title:'FAQ', component:AboutPage},
      ];

      this.activePage=this.pages[0];

// =====================================================================================
      platform.ready().then(() => 
      {
        statusBar.styleDefault();
        splashScreen.hide();





      });

      

  }

  
// =====================================================================================

  openPage(page)
  {
      this.nav.setRoot(page.component);
      this.activePage=page;

  }

  checkActive(page)
  {
    return page == this.activePage;
  }

// =====================================================================================
navigatetoprofile()
{
  this.nav.setRoot(ProfilePage);
}
// =====================================================================================

presentToast() {
  let toast = this.toastCtrl.create({
    message: "Press again to exit",
    duration: 3000,
    position: "middle",
    cssClass: "toastexit",
  });
  toast.present();
}


// ======================================================================================  

  
}


