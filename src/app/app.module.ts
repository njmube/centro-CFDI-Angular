import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { LoginComponent } from './usuarios/login.component';
import { ClienteComponent } from './clientes/cliente.component';
import {RouterModule,Routes} from '@angular/router';
import { HttpClientModule} from '@angular/common/http';
import { CreateComponent } from './usuarios/create/create.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { VerComponent } from './clientes/ver/ver.component';
import { EditarComponent } from './clientes/editar/editar.component';
import { CfdiComponent } from './cfdi/cfdi.component';
import { DataTablesModule } from "angular-datatables";
import { DatePipe } from '@angular/common';
import { VerUsuarioComponent } from './usuarios/ver-usuario/ver-usuario.component';
import { EditarUsuarioComponent } from './usuarios/editar-usuario/editar-usuario.component';
import { AuthGuard } from './usuarios/guards/auth.guard';
import { HeaderMobileComponent } from './header-mobile/header-mobile.component';
import { ContentComponent } from './content/content.component';
import { HomeComponent } from './home/home.component';
import { PanelComponent } from './panel/panel.component';
import { CfdiSatComponent } from './cfdi-sat/cfdi-sat.component';

const routes:Routes=[
  //definicion pagina principal
  {path: '', redirectTo:'/login',pathMatch:'full'},
  //{path:'home',component:HeaderComponent},
  {path:'home',component:HomeComponent},
  {path:'login',component:LoginComponent},
  {path:'usuarios/crear', component:CreateComponent},
  {path:'usuarios/ver', component:VerUsuarioComponent , canActivate:[AuthGuard]},
  {path:'usuario/editar/:id',component:EditarUsuarioComponent, canActivate:[AuthGuard]},
  {path:'clientes/ver',component:VerComponent, canActivate:[AuthGuard]},
  {path:'cliente/crear',component:ClienteComponent, canActivate:[AuthGuard]},
  {path:'cliente/editar/:id',component:EditarComponent, canActivate:[AuthGuard]},
  {path:'cfdi/ver',component:CfdiComponent, canActivate:[AuthGuard]},
  {path:'cfdi/sat/ver', component:CfdiSatComponent, canActivate:[AuthGuard]}

]
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ClienteComponent,
    CreateComponent,
    HeaderComponent,
    FooterComponent,
    VerComponent,
    EditarComponent,
    CfdiComponent,
    VerUsuarioComponent,
    EditarUsuarioComponent,
    HeaderMobileComponent,
    ContentComponent,
    HomeComponent,
    PanelComponent,
    CfdiSatComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    DataTablesModule,
    RouterModule.forRoot(routes)
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
