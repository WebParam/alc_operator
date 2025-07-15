import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastService } from 'src/app/services/toast.service';
import { UserService } from 'src/app/services/user.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  alert_text = '';
  //login_reg_test='';
  resetPassworChecked = false;
  setResetStaff = '';
  loginForm = this.fb.group({
    employeeNumber: ['', [Validators.required]],
    pin: ['', [Validators.required]],
    //login_reg_test:[],
  });

  constructor(
    private alertController: AlertController,
    private fb: FormBuilder,
    private router: Router,
    private AuthService: UserService,
    private cookieService: CookieService
  ) {}

  ngOnInit() {}

  updateresetstaff(event: any) {
    
    this.setResetStaff = event.target.value;
  }

  resetPassword() {
    
    if (this.setResetStaff.length > 4) {
      this.AuthService.ResetOperationsUser(this.setResetStaff).subscribe(
        (x) => {
          this.resetPassworChecked = false;
          this.presentResetAlert();
        }
      );
    }
  }

  toggleReset() {
    
    this.resetPassworChecked = !this.resetPassworChecked;
  }
  login() {
    const payload = {
      employeeNumber: this.loginForm.value.employeeNumber,
      pin: this.loginForm.value.pin,
    };

    this.AuthService.LoginOperationsUser(payload).subscribe(
      (x) => {
        this.resetloginattempts();
        this.cookieService.set('avis-user', JSON.stringify(x));
        this.router.navigateByUrl('/home-screen');
      },
      (x) => {
        if ('object' == typeof x && 'invalid' == x.error) {
          //handle invalid login attempts
          let invalid_attempts =
            Number(this.cookieService.get('invalid-attempts')) + 1;
          this.cookieService.set(
            'invalid-attempts',
            invalid_attempts.toString()
          );
          if (invalid_attempts >= 3) {
            //this.router.navigateByUrl('/account-locked');
            this.presentAlert();
          } else {
            this.alert_text =
              'You are left with ' +
              (3 - invalid_attempts).toString() +
              ' login attempts';
          }
        }
      },
      () => {
        console.log('here 3');
      }
    );
    //  if(!(this.loginForm.value.login_reg_test)){
    //     this.resetloginattempts();
    //     this.router.navigateByUrl('/manifest-screen');
    //  }
  }

  manifest() {
    this.router.navigateByUrl('/manifest-screen');
  }
  exchange() {
    this.router.navigateByUrl('/vehicle-exchange');
  }
  transfer(){
    this.router.navigateByUrl('/vehicle-scan-licence');
  }
  lostitem() {
    this.router.navigateByUrl('/forgot-item');
  }
  logoff() {
    this.cookieService.delete('avis-user');
    this.router.navigateByUrl('/login');
  }

  resetloginattempts() {
    this.cookieService.set('invalid-attempts', '0');
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      subHeader: 'Account has been locked',
      message: 'Please contact administrator!',
      buttons: ['OK'],
      cssClass: 'alertAvis',
    });

    await alert.present();
  }

  async presentResetAlert() {
    const alert = await this.alertController.create({
      header: 'Reset',
      subHeader: 'Pin has been reset',
      message: 'Please check your phone for an SMS with your new pin number',
      buttons: ['OK'],
      cssClass: 'alertAvis',
    });

    await alert.present();
  }
}
