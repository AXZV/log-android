import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { User } from "../../models/user";
import { AngularFireAuth } from 'angularfire2/auth';
import { RegisterPage } from '../register/register';
import { ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { regexValidators } from '../validators/validators';
import { ResetPasswordPage } from '../reset-password/reset-password';
import { LoadingProvider } from '../../providers/loading/loading';
// import { errorHandler } from '@angular/platform-browser/src/browser';
// import { ProfilePage } from '../profile/profile';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  

  credentialsForm: FormGroup;

  // =========================================== SHOW PASS =================================================

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

  // ============================================================================================
  navigateToResetPasswordPage() 
  {
    this.navCtrl.push(ResetPasswordPage);
  }
 // ============================================================================================
  navigateToRegisterPage() 
  {
    this.navCtrl.push(RegisterPage);
  }
   // ============================================================================================

   

  user = {} as User;
   // ============================================================================================
  constructor(private afAuth: AngularFireAuth,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public toastCtrl: ToastController,
    private formBuilder: FormBuilder,
    public events: Events,
    public loadingCtrl: LoadingProvider,
    ) 
    {
      

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
      });


       // ============================================================================================

       
    }

   

//   loginmessage()
//   {
//     // ================================= Toast Message ========================================
//     this.events.subscribe('event:senddata', (data) => {
       
//       var namex=(data.fullname)
//       this.toastCtrl.create({
//         message: `Welcome back, ${ namex}`,
//         duration: 5000
//       }).present();
// });
//   }
 
 // ============================================================================================
  async login(user) {
    try {
      this.loadingCtrl.presentWithGif1();
      const result = await this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password);
      if (result) 
      {
        this.navCtrl.setRoot('HomePage');
        this.loadingCtrl.dismiss();
        // this.loginmessage();
      }
    }
    catch (e) {

      console.error(e);
      
        if(e.code == "auth/user-not-found" )
        {
          this.toastCtrl.create({
            message: `User Not Found`,
            duration: 5000
          }).present();
        }
        if(e.code == "auth/wrong-password" )
        {
          this.toastCtrl.create({
            message: `Password Incorrect`,
            duration: 5000
          }).present();
        }
        
      this.loadingCtrl.dismiss();


    }
  }


 
}