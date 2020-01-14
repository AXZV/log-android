import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { User } from "../../models/user";
import { AngularFireAuth } from 'angularfire2/auth';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { regexValidators } from '../validators/validators';
import { Profile } from '../../models/profile';
import { Events } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { LoadingProvider } from '../../providers/loading/loading';





@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  credentialsForm: FormGroup;
// ================================== password strange  ===================================
  public account = 
  {
    password: null
  };
  public barLabel: string = "";

// =====================================================================
  // userRef$: AngularFireList<any>
  user = {} as User;
  profile = {} as Profile;


// =====================================================================
    navigateToLoginPage() 
    {
      this.navCtrl.push(LoginPage);
    }
// =====================================================================
    public type = 'password';
    public showPass = false;

    showPassword() {
      this.showPass = !this.showPass;
  
      if(this.showPass){
        this.type = 'text';
      } else {
        this.type = 'password';
      }
  }
  
// =====================================================================
  constructor( 
    public navCtrl: NavController, 
    public navParams: NavParams,
    private afAuth: AngularFireAuth,
    public toastCtrl: ToastController,
    private formBuilder: FormBuilder,
    public events: Events,
    public firestore: AngularFirestore,
    public loadingCtrl: LoadingProvider,) 
  {
      // ====================== remove error date firestore ===================================
      firestore.firestore.settings({ timestampsInSnapshots: true });
     // ============================================================================================
     this.credentialsForm = this.formBuilder.group({
      email: [
        '', Validators.compose([
          Validators.pattern(regexValidators.email),
          Validators.required
        ])
      ],
      password: [
        '', Validators.compose([
          Validators.pattern(regexValidators.password),
          Validators.required
        ])
      ],
      // name: [
      //   '', Validators.compose([
      //     Validators.pattern(regexValidators.name),
      //     Validators.required
      //   ])
      // ],
    });
    
  }
 
 

  // ============================================================================================
  async register(user: User) {
    try {
      this.loadingCtrl.presentWithGif1();
      const result = await this.afAuth.auth.createUserWithEmailAndPassword(
        user.email,
        user.password
      );
      if (result) {
        // ==========================================================================
        var profilex=this.profile;
        var userx=this.user;
        var datecreate=moment().format('MMMM Do YYYY, h:mm:ss a');
                  this.afAuth.authState.take(1).subscribe(auth => {
                    this.firestore.doc(`profile/${auth.uid}`).set({
                      email:userx.email,
                      username:profilex.username, 
                      fullname:profilex.fullname,
                      status:'0',
                      ppstatus:'0',
                      datecreate})
                      .then(() => this.navCtrl.setRoot('HomePage'))
                      .then(_=>{this.loadingCtrl.dismiss()});
                  });
        
        this.events.publish('user:created', profilex, Date.now());

      }
    } catch (e) {
      console.error(e);

      if(e.code == "auth/email-already-in-use" )
        {
          this.toastCtrl.create({
            message: `Email address is already in use`,
            duration: 5000
          }).present();
        };

      this.loadingCtrl.dismiss();

    }
  }

  
 


  


}
