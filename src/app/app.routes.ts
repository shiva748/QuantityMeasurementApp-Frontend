import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Profile } from './pages/profile/profile';
import { AuthGuard } from './guards/auth-guard';
import { Operations } from './pages/operations/operations';
import { Units } from './pages/units/units';
import { History } from './pages/history/history';
import { Docs } from './pages/docs/docs';
import { NotFound } from './pages/not-found/not-found';




export const routes: Routes = [
    {path:"", component:Home},
    {path:"profile", component:Profile, canActivate: [AuthGuard]},
    {path:"operations", component:Operations, canActivate: [AuthGuard]},
    {path:"units", component:Units},
    {path:"history", component:History, canActivate: [AuthGuard]},
    {path:"api-docs", component:Docs},
    {path:"**", component:NotFound}
];
