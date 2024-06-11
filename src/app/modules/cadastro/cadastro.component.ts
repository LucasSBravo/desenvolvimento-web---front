import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/shared/models/usuario';
import { CadastroService } from 'src/app/shared/services/cadastro.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent implements OnInit{
  cadastroForm: FormGroup;
  usuario: Usuario;
 
  constructor(
    private formBuilder: FormBuilder,
    private cadastroService: CadastroService,
    private router: Router,
    private toastr: ToastrService
  ) {    
  }

  ngOnInit(): void {
    this.cadastroForm = this.formBuilder.group({
      nome: ['', [Validators.required, this.espacosInicioFimValidator()]],
      email: ['', [Validators.required, Validators.email, this.espacosInicioFimValidator()]],
      usuario: ['', [Validators.required, Validators.pattern(/^\S*$/)]],
      senha: ['', Validators.required],
      confirmacaoSenha: ['', Validators.required]
    }, {
      validators: this.senhaCoincideValidator()
    })
    
    this.stepperDinamico();
  }  

  onSubmit() {
    this.cadastrar();
  }

  cadastrar() {
    if (this.cadastroForm.valid) {
      this.cadastroService.addUser(this.montarUsuario()).subscribe({
        next: resp => {
          localStorage.setItem('usuario', JSON.stringify(resp));
          localStorage.setItem('autenticado', 'true');
          this.toastr.success("Cadastro efetuado com sucesso!")         
          this.router.navigateByUrl("/home")                      
        },
        error: resp => {
          console.log(resp.error);
        }
      })
    }
  }

  montarUsuario() {
    this.usuario = new Usuario();
    let form = this.cadastroForm.value;
    this.usuario.email = form.email;
    this.usuario.nome = form.nome;
    this.usuario.usuario = form.usuario;
    this.usuario.senha = form.senha;
    
    return this.usuario
  }

  senhaCoincideValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const senhaControl = formGroup.get('senha');
      const confirmacaoSenhaControl = formGroup.get('confirmacaoSenha');

      if (senhaControl && confirmacaoSenhaControl) {
        const senha = senhaControl.value
        const confirmacaoSenha = confirmacaoSenhaControl.value

        if (senha !== confirmacaoSenha) {
          return { senhaNaoCoincide: true }
        }
      }

      return null;
    };
  }

  espacosInicioFimValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valor = control.value;

      if (valor && (valor.startsWith(' ') || valor.endsWith(' '))) {
        return { espacosInicioFim: true };
      }

      return null;
    }
  }

  limparNome() {
    this.cadastroForm.controls["nome"].setValue(null);
  }

  limparEmail() {
    this.cadastroForm.controls["email"].setValue(null);
  }

  limparUsuario() {
    this.cadastroForm.controls["usuario"].setValue(null);
  }

  limparSenha() {
    this.cadastroForm.controls["senha"].setValue(null);
  }

  limparConfirmarSenha() {
    this.cadastroForm.controls["confirmacaoSenha"].setValue(null);
  }

  stepperDinamico() {
    const steps = document.querySelectorAll(".step");
    const stepContents = document.querySelectorAll(".step-content");

    steps.forEach(step => {
      step.addEventListener("click", () => {
        const stepNumber = parseInt(step.getAttribute("data-step") || "0");

        steps.forEach(step => {
          step.classList.remove("active");
        });

        step.classList.add("active");

        stepContents.forEach((stepContent, index) => {
          if (index + 1 === stepNumber) {
            (stepContent as HTMLElement).style.display = "flex";
          } else {
            (stepContent as HTMLElement).style.display = "none";
          }
        });
      });
    });
  }

  stepperTabEnter(event: KeyboardEvent) {
    if (event.key === "Tab" || event.key === "Enter") {      
      const steps = document.querySelectorAll(".step");
      const stepContents = document.querySelectorAll(".step-content");
      let stepNumber: any;
      let stepAtual: any;
      let stepContentNumber: any;

      steps.forEach(step => {
        if (step.classList.contains('active')) {
          stepNumber = parseInt(step.getAttribute("data-step") || "0");
          stepAtual = step;
        }
      })

      stepAtual.classList.remove('active')
      steps[stepNumber - 1 + 1].classList.add('active');

      stepContents.forEach((stepContent, index) => {
        let computedStyle = window.getComputedStyle(stepContent)

        if (computedStyle.getPropertyValue("display") === "flex") {
          (stepContent as HTMLElement).style.display = "none"
          stepContentNumber = index + 1
        }
        
      });

      (stepContents[stepContentNumber - 1 + 1] as HTMLElement).style.display = "flex";           
      }
    } 
  }
