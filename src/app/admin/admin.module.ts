import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AdminOverviewComponent } from './admin-overview/admin-overview.component';
import { QuizAdminComponent } from './quiz-admin/quiz-admin.component';
import { UserAdminComponent } from './user-admin/user-admin.component';

const routes: Routes = [
  {
    path: 'user',
    component: UserAdminComponent,
  }, {
    path: 'quiz',
    component: QuizAdminComponent,
  }, {
    path: '',
    component: AdminOverviewComponent,
  },
];

@NgModule({
  declarations: [UserAdminComponent, QuizAdminComponent, AdminOverviewComponent],
  imports: [
    SharedModule, RouterModule.forChild(routes),
  ],
})
export class AdminModule {
}