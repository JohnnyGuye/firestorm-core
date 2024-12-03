import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Home',
    loadComponent: () => import('./pages/home').then(m => m.HomePage)
  },
  {
    path: 'doc/:id',
    title: 'Doc',
    loadComponent: () => import('./pages/markdown-doc').then(m => m.MarkdownDocPage)
  }
];
