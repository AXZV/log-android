import { Component, NgZone } from '@angular/core';
import {  NavController, IonicPage, ToastController, NavParams, Events, AlertController, Alert,  } from "ionic-angular";
import { AuthProvider } from '../../providers/auth/auth';
// import { AngularFireDatabase, AngularFireObject} from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Profile } from '../../models/profile';
import firebase from 'firebase';
import { LoadingProvider } from '../../providers/loading/loading';
import { AngularFirestoreDocument, AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';






@IonicPage()
@Component({
  
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  firestore = firebase.storage();
  imgsource: any;

 
  // profileData: AngularFireObject<Profile>;
  profile: any;
  private profileDatax: AngularFirestoreDocument<Profile>;
  profilex: Observable<Profile>;
  


  constructor(
    public afstore: AngularFirestore,
    public navCtrl: NavController,
    public authProvider: AuthProvider,
    private afauth : AngularFireAuth,
    // private afdatabase :AngularFireDatabase,
    public auth: AuthProvider,
    public toastCtrl: ToastController,
    public navParams: NavParams,
    public events: Events,
    public alertCtrl: AlertController,
    public zone: NgZone,
    public loadingCtrl: LoadingProvider,
    

) 
    {
      // ====================== remove error date firestore ===================================
      afstore.firestore.settings({ timestampsInSnapshots: true });
      // ====================== remove error date firestore ===================================
      // afstore.firestore.settings({ timestampsInSnapshots: true });
      // const settings = { timestampsInSnapshots: true };
      // afstore.app.firestore().settings( settings );
     
     
    }
    // =====================================================================================
    ionViewDidLoad() {
      this.afauth.authState.take(1).subscribe(data => {
        if(data && data.email && data.uid)
        {

          this.profileDatax = this.afstore.doc<Profile>(`profile/${data.uid}`);
          this.profilex=this.profileDatax.valueChanges();
          this.profilex.subscribe(data=>{

            this.profile = data;
            // console.log(data);
              // ============================== Send Data ============================================
              this.events.publish('event:senddata', data);
              // =====================================================================================
              
              
               // ========================= get pict from database =============================================
                var imgvalue=data.ppstatus;
                if(imgvalue=='1')
                {
                    this.afauth.authState.take(1).subscribe(auth => {
                      this.firestore.ref().child(`ProfilePicture/${auth.uid}/image`).getDownloadURL().then((url) => {
                        this.zone.run(() => {
                          this.imgsource = url;
                          // ============================== Send Data ============================================
                          this.events.publish('event:sendprofilepic', url);
                          // =====================================================================================
                        })
                      })
                  });

                }
          });
        }
      });


     
    
    }
    // =====================================================================================

    async logOut(): Promise<void> {

      const alert: Alert = this.alertCtrl.create({
        message: 'Are You Sure Want Exit ?',
        buttons: [
          { text: 'No', role: 'cancel' },
          {
            text: 'Yes',
            handler: data => {
              
              this.authProvider.logoutUser();
              this.navCtrl.setRoot('LoginPage');
            }
          }
        ]
      });
      alert.present();

    }


  sl()
  {
    this.loadingCtrl.presentWithGif1(); 
  }






    // ======================================================================================

   
}
