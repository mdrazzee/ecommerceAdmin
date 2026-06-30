import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { LabelComponent } from '../../form/label/label.component';
import { CheckboxComponent } from '../../form/input/checkbox.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { InputFieldComponent } from '../../form/input/input-field.component';

import { AuthService } from '../../../../core/services/auth.service';
import { TokenService } from '../../../../core/services/token.service';

@Component({
  selector: 'app-signin-form',
  standalone: true,
  imports: [
    LabelComponent,
    CheckboxComponent,
    ButtonComponent,
    InputFieldComponent,
    RouterModule,
    FormsModule
  ],
  templateUrl: './signin-form.component.html'
})
export class SigninFormComponent {

  showPassword = false;
  isChecked = false;

  email: string = '';
  password: string = '';

  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSignIn(): void {

    if (!this.email?.trim()) {
      this.errorMessage = 'Email is required';
      return;
    }

    if (!this.password?.trim()) {
      this.errorMessage = 'Password is required';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const payload = {
      email: this.email,
      password: this.password
    };

    this.authService.login(payload).subscribe({
      next: (response: any) => {

        this.loading = false;

        if (!response.success) {
          this.errorMessage = response.message;
          return;
        }

        const {
          accessToken,
          refreshToken,
          user
        } = response.data;

        this.tokenService.setAccessToken(accessToken);
        this.tokenService.setRefreshToken(refreshToken);

        localStorage.setItem(
          'user',
          JSON.stringify(user)
        );

        this.router.navigate(['/']);
      },

      error: (error) => {

        this.loading = false;

        this.errorMessage =
          error?.error?.message ||
          'Invalid email or password';

        console.error(error);
      }
    });
  }
}