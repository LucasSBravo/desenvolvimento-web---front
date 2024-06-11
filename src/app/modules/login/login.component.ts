import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/shared/models/usuario';
import { LoginService } from 'src/app/shared/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  loginForm: FormGroup;
  usuarios: Usuario[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      usuario: ["", [Validators.required, Validators.pattern(/^\S*$/)]],
      senha: ["", Validators.required]
    })
  }

  onSubmit() {
    this.entrar();
  }

  entrar() {
    if (this.loginForm.valid) {
      this.loginService.getUsers().subscribe({
        next: resp => {
          let form = this.loginForm.value;
          this.usuarios = resp
          this.authenticate(this.usuarios, form.usuario, form.senha);      
        },
        error: resp => {
          console.log(resp.error);          
        }
      })
    }
  }

  limparUsuario() {
    this.loginForm.controls["usuario"].setValue(null)
  }

  limparSenha() {
    this.loginForm.controls["senha"].setValue(null)
  }

  authenticate(usuarios: any[], usuario: string, senha: string) {
    const user = usuarios.find(u => u.usuario === usuario && u.senha === senha);
    if (user) {
      localStorage.setItem('usuario', JSON.stringify(user))
      localStorage.setItem('autenticado', 'true');  
      this.toastr.success(`Login efetuado com sucesso!`)     
      this.router.navigateByUrl("/home")
    } else {
      this.toastr.error("Credenciais inválidas.")     
    }
  }
}
