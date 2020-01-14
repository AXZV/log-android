import { Component, NgZone, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Alert, Events, Platform, ToastController, } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
// import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Profile } from '../../models/profile';
import { storage } from 'firebase';
import { Camera, CameraOptions } from '@ionic-native/camera';
import firebase from 'firebase';
import { Diagnostic } from '@ionic-native/diagnostic';
import { AngularCropperjsComponent } from 'angular-cropperjs';
import { LoadingProvider } from '../../providers/loading/loading';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';






@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
  providers: [Camera]
})
export class ProfilePage {

  @ViewChild('angularCropper') public angularCropper: AngularCropperjsComponent;
  imagetocrop:any;

  cropperOptions: any;
  croppedImage = null;
  myImage = null;
  scaleValX = 1;
  scaleValY = 1;

  public isCameraEnabled 		: boolean 	= false;

  firestore = firebase.storage();
  imgsource: any;


  // profileData: AngularFireObject<Profile>;
  profile: any;
  profileimage: Array<{alphabet:string}>;

  private profileDatax: AngularFirestoreDocument<Profile>;
  profilex: Observable<Profile>;



  constructor(
    public navCtrl: NavController,
    public authProvider: AuthProvider,
    private afAuth : AngularFireAuth,
    // private afDatabase :AngularFireDatabase,
    public auth: AuthProvider,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public events: Events,
    private camera: Camera,
    private diagnostic: Diagnostic,
    private platform    : Platform,
    public zone: NgZone,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingProvider,
    public afstore: AngularFirestore,



    ) 
    {
      // ====================== remove error date firestore ===================================
      afstore.firestore.settings({ timestampsInSnapshots: true });

      // =============================== Minta ijin camera ===================================
      this.platform.ready()
      .then(() =>
      {
         this.isCameraAvailable();
      });

      // =============================== CROP camera ===================================

      this.cropperOptions =
      {

        dragMode: 'crop',
        aspectRatio: 1,
        guides:false,
        minContainerWidth:300,
        minContainerHeight:300,
        autoCrop:true,
        background:false,
        autoCropArea:1, 
      };
      
     
    }

    // this.loadingCtrl.presentWithGif1(); 
    // this.loadingCtrl.dismiss();



// =============================== Minta ijin camera ===================================
isCameraAvailable()
{
   this.diagnostic.isCameraPresent()
   .then((isAvailable : any) =>
   {
      this.isCameraEnabled = true;
   })
   .catch((error :any) =>
   {
      console.dir('Camera is:' + error);
   });
}


// =============================== Upload foto Profile =======================================


    captureImage()
    {
      
        const options: CameraOptions =
            {
              quality:80,
              destinationType: this.camera.DestinationType.DATA_URL,
              encodingType:this.camera.EncodingType.JPEG,
              mediaType: this.camera.MediaType.PICTURE,
              sourceType: this.camera.PictureSourceType.CAMERA,
              
            }
        this.loadingCtrl.presentWithGif1()

        this.camera.getPicture(options).then((ImageData)=>
      {
          this.loadingCtrl.dismiss()

          this.myImage = 'data:image/jpeg;base64,' + ImageData;

          this.imagetocrop=1;})

      
    }
    pickImage()
    {
      
        const options: CameraOptions =
            {
              quality:80,
              destinationType: this.camera.DestinationType.DATA_URL,
              encodingType:this.camera.EncodingType.JPEG,
              mediaType: this.camera.MediaType.PICTURE,
              sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
              
            };
        this.loadingCtrl.presentWithGif1();

        this.camera.getPicture(options).then((ImageData)=>
      {
          this.loadingCtrl.dismiss();

          this.myImage = 'data:image/jpeg;base64,' + ImageData;

           this.imagetocrop=1;
      });
      
    }

    save()
    {
      this.loadingCtrl.presentWithGif1(); 
      
      let croppedImageB64String: string = this.angularCropper.cropper.getCroppedCanvas().toDataURL('image/jpeg',(100/100));
      this.croppedImage=croppedImageB64String;

      const imgcrop = this.croppedImage;
        this.afAuth.authState.take(1).subscribe(auth => {
          const picture = storage().ref(`ProfilePicture/${auth.uid}/image`);
          picture.putString(imgcrop, 'data_url' ).then((snapshot)=> {
            // Do something here when the data is succesfully uploaded!
            this.toastCtrl.create({
              message: 'Profile Picture Successfully Changed',
              duration: 2000
            }).present();
  
            this.afstore.doc<Profile>(`profile/${auth.uid}`).update({
              ppstatus:'1'
              })

              this.imagetocrop=0;
              
              this.loadingCtrl.dismiss();


              // this.navCtrl.setRoot(this.navCtrl.getActive().component);
          });
        });

     
    }
    reset()
    {
      this.angularCropper.cropper.reset();
    }
    cancel()
    {
      this.imagetocrop=0;
      this.myImage.reset();
    }


   
// =============================== Hapus foto Profile =======================================
    deleteimage() {
      const alert: Alert = this.alertCtrl.create({
        message: 'Are You Sure Want Delete Picture ?',
        buttons: [
          { text: 'No', role: 'cancel' },
          {
            text: 'Yes',
            handler: data => 
            {
              this.loadingCtrl.presentWithGif1(); 
              
              this.afAuth.authState.take(1).subscribe(auth => {
                // Create a reference to the file to delete
                this.firestore.ref().child(`ProfilePicture/${auth.uid}/image`).getDownloadURL().then((url) => {
       
                     var desertRef = firebase.storage().refFromURL(url)
                     // Delete the file
                     desertRef.delete().then((snapshot)=> {
                      // Do something here when the data is succesfully delete!
    
                      this.afstore.doc<Profile>(`profile/${auth.uid}`).update({ppstatus:'0'})

                      this.toastCtrl.create({
                          message: 'Picture Removed!',
                          duration: 3000
                      }).present();

                      this.loadingCtrl.dismiss(); 

                      }).catch(function(error){
                       
                       this.toastCtrl.create({
                         message: "Error Can't Removed Picture",
                         duration: 3000
                       }).present();
                     });
                 })
              });
      
            }
          }
        ]
      });
      alert.present();
     
    }


// ==================================== AUTOLOAD ===========================================  

    ionViewDidLoad() {
      this.afAuth.authState.take(1).subscribe(data => {
        if(data && data.email && data.uid)
        {

          this.profileDatax = this.afstore.doc<Profile>(`profile/${data.uid}`);
          this.profilex=this.profileDatax.valueChanges();
          this.profilex.subscribe(data=>{

            this.profile = data;



            // ========================= Profile Pict =============================================
            var x = (data.fullname);
            this.profileimage=
            [
              {alphabet:(x.charAt(0))}
            ];
            // ========================= Profile Pict =============================================
              
              // ========================= get pict from database =============================================
              var imgvalue=data.ppstatus;
              if(imgvalue=='1')
              {
                    this.afAuth.authState.take(1).subscribe(auth => {
                      this.firestore.ref().child(`ProfilePicture/${auth.uid}/image`).getDownloadURL().then((url) => {
                        this.zone.run(() => {
                          this.imgsource = url;
                        })
                      })
                  });
              }
            
          });
        }

      });
    }

 // =================================== edit Profile  =============================================
    editname() 
    {
      const alert: Alert = this.alertCtrl.create({
        inputs: [
          {
            name: 'name',
            value:this.profile.fullname,
            placeholder: this.profile.fullname
          }
        ],
        buttons: [
          { text: 'Cancel', role: 'cancel' },
          {
            text: 'Save',

            handler: data => 
            {
              this.loadingCtrl.presentWithGif1(); 
              

              this.afAuth.authState.take(1).subscribe(auth => {
                this.afstore.doc<Profile>(`profile/${auth.uid}`).update({
                  fullname:data.name,
                  }).then((snapshot)=> {

                    this.loadingCtrl.dismiss();

                  })
              });
            }
          }
        ]
      });
      alert.present();
    }
// ===================================== edit Profile  =============================================
    editusername()
    {
      const alert: Alert = this.alertCtrl.create({
        inputs: [
          {
            name: 'username',
            value:this.profile.username,
            placeholder: this.profile.username
          }
        ],
        buttons: [
          { text: 'Cancel', role: 'cancel' },
          {
            text: 'Save',

            handler: data => 
            {
              this.loadingCtrl.presentWithGif1(); 

              this.afAuth.authState.take(1).subscribe(auth => {
                this.afstore.doc<Profile>(`profile/${auth.uid}`).update({
                  username:data.username,
                  }).then((snapshot)=> {

                    this.loadingCtrl.dismiss();

                  })
              });
            }
          }
        ]
      });
      alert.present();
    }



       

        




}
