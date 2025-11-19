import { bootstrapApplication } from '@angular/platform-browser';
import { Route, provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app/app.component';
import { UsersComponent } from './app/pages/users/users.component';
import { PostsComponent } from './app/pages/posts/posts.component';
import { TodosComponent } from './app/pages/todos/todos.component';
import { PromotionsComponent } from './app/pages/promotions/promotions.component';

const routes: Route[] = [
  { path: 'users', component: UsersComponent },
  { path: 'posts', component: PostsComponent },
  { path: 'todos/:userId', component: TodosComponent },
  { path: 'promotions', component: PromotionsComponent },
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  { path: '**', redirectTo: 'users' }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule)
  ]
})
.catch(err => console.error(err));
