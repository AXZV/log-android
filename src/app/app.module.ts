import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { AngularFireModule} from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { FIREBASE_CREDENTIALS } from './firebase.credentials';
import { RegisterPage } from '../pages/register/register';
import { PasswordStrengthBar } from './passwordStrengthBar';
import { AuthProvider } from '../providers/auth/auth';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { AboutPage } from '../pages/about/about';
import { ProfilePage } from '../pages/profile/profile';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { Camera } from '@ionic-native/camera';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Crop } from '@ionic-native/Crop';
import { AngularCropperjsModule} from 'angular-cropperjs';
import { LoadingProvider } from '../providers/loading/loading';
import { AngularFirestoreModule } from 'angularfire2/firestore';
// import { AngularFireOfflineModule } from 'angularfire2-offline';
import { Network } from '@ionic-native/network';










@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    RegisterPage,
    ResetPasswordPage,
    PasswordStrengthBar,
    ProfilePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,),
    AngularFireModule.initializeApp(FIREBASE_CREDENTIALS),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    IonicImageViewerModule,
    AngularCropperjsModule,
    AngularFirestoreModule,
    // AngularFireOfflineModule,

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ProfilePage,
    AboutPage,
    RegisterPage,
    ResetPasswordPage,
    
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    Camera,
    Diagnostic,
    Crop,
    LoadingProvider,
    Network


    
  ]
})
export class AppModule {}

