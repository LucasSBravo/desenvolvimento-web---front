import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "home",
    loadChildren: () => import("./modules/home/home.module").then(mod => mod.HomeModule)
  },
  {
    path: "login",
    loadChildren: () => import("./modules/login/login.module").then(mod => mod.LoginModule)
  },
  {
    path: "cadastro",
    loadChildren: () => import("./modules/cadastro/cadastro.module").then(mod => mod.CadastroModule)
  },
  {
    path: "",
    redirectTo: "/login",
    pathMatch: "full",

  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
