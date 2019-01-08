import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/user/auth.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { DateTimeService } from '../../services/date-time.service';

/**
 * S I G N  U P   -    P A G E
 * 
 * Description:
 * A new Account can be created here, by providing required user data
 * A FormGroup is used to apply some validators.
 * AuthService is called to signup the new user with provided password
 * 
 */

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  public signupForm: FormGroup;
  public loading: any;

  constructor(
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private formBuilder: FormBuilder,
    private dateTimeService: DateTimeService,
    private router: Router
  ) {
    this.signupForm = this.formBuilder.group({
      email: [
        '',
        Validators.compose([Validators.required, Validators.email]),
      ],
      password: [
        '',
        Validators.compose([Validators.minLength(6), Validators.required]),
      ],
      firstname: [
        '',
        Validators.compose([Validators.required]),
      ],
      lastname: [
        '',
        Validators.compose([Validators.required]),
      ],
      nickname: [
        '',
        Validators.compose([Validators.required]),
      ],
      birthdate: [
        '',
        Validators.compose([Validators.required]),
      ],
    });
   }

  ngOnInit() {
  }

  async signupUser(signupForm: FormGroup): Promise<void> {
    if (!signupForm.valid) {
      console.log('Need to complete the form, current value: ', signupForm.value);
    } else{
      const newUser: User = {
        
        email: signupForm.value.email,
        firstname: signupForm.value.firstname,
        lastname: signupForm.value.lastname,
        nickname: signupForm.value.nickname,
        birthdate: signupForm.value.birthdate,
        friends: [],
        token: null,
        createdAt: this.dateTimeService.getCurrentDate()
      }

      const password: string = signupForm.value.password;

      this.authService.signupUser(newUser, password).then(
        () => {
          this.loading.dismiss().then(() => {
            this.router.navigateByUrl('food-list');
          });
        },
        error => {
          this.loading.dismiss().then(async () => {
            const alert = await this.alertCtrl.create({
              message: error.message,
              buttons: [{ text: 'Ok', role: 'cancel' }],
            });
            await alert.present();
          });
        }
      );
      this.loading = await this.loadingCtrl.create();
      await this.loading.present();
    }
  }
  
}
