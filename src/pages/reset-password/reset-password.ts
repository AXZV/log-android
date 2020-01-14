import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Alert,AlertController,Loading,LoadingController, } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { regexValidators } from '../validators/validators';
import { User } from '../../models/user';
import { LoginPage } from '../login/login';
import { AuthProvider } from '../../providers/auth/auth';


/**
 * Generated class for the ResetPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html',
})
export class ResetPasswordPage {

  credentialsForm: FormGroup;
// ============================================================================================
  navigateToLoginPage()
  {
    this.navCtrl.push(LoginPage);
  }
// ============================================================================================


  user = {} as User;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public toastCtrl: ToastController,
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public authProvider: AuthProvider,) 
    {
             // ============================================================================================
             this.credentialsForm = this.formBuilder.group({
              email: [
                '', Validators.compose([
                  Validators.pattern(regexValidators.email),
                  Validators.required
                ])
              ],
            });
             // ============================================================================================
    }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ResetPasswordPage');
  }
// ============================================================================================
  async resetPassword(user): Promise<void> {

      const loading: Loading = this.loadingCtrl.create();
      loading.present();

      const email =  this.credentialsForm.value.email;

      try {
        // const loginUser: void = await this.authProvider.resetPassword(email);
        await this.authProvider.resetPassword(email);
        await loading.dismiss();
        const alert: Alert = this.alertCtrl.create({
          message: 'Please check your email for a password reset link',
          buttons: [
            { text: 'Cancel', role: 'cancel' },
            {
              text: 'Ok',
              handler: data => {
                this.navCtrl.pop();
              }
            }
          ]
        });
        alert.present();
      } catch (error) {
        await loading.dismiss();
        const alert: Alert = this.alertCtrl.create({
          message: error.message,
          buttons: [{ text: 'Ok', role: 'cancel' }]
        });
        alert.present();
      }

    
  }

}
