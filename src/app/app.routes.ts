import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { PanelsComponent } from './pages/panels/panels.component';
import { DoorsComponent } from './pages/doors/doors.component';
import { CamerasComponent } from './pages/cameras/cameras.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'panels', component: PanelsComponent },
  { path: 'doors', component: DoorsComponent },
  { path: 'cameras', component: CamerasComponent },
  { path: '**', redirectTo: '' }
];
