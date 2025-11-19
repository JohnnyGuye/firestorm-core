import { CanMatchFn, Route, Routes, UrlMatchResult, UrlSegment, UrlSegmentGroup } from '@angular/router';
import { isLocalGuard } from '@guards';


function docMatcher(segments: UrlSegment[], group: UrlSegmentGroup, route: Route): UrlMatchResult | null {

  if (segments[0].path != 'doc') return null

  const dfp = `${segments.join("/")}/index.md`
  const result = {
    consumed: segments,
    posParams: {
      docFilePath: new UrlSegment(dfp, {})
    }
  }

  return result
}



export const routes: Routes = [
  {
    path: '',
    title: 'Home',
    loadComponent: () => import('./pages/home').then(m => m.HomePage)
  },
  {
    path: 'playground',
    title: 'Playground',
    loadComponent: () => import('./pages/playground').then(m => m.PlaygroundPage)
  },
  {
    path: 'dev/db',
    pathMatch: 'full',
    title: 'Dev DB Tools',
    loadComponent: () => import('./pages/db-tools').then(m => m.DbtoolsPage)
  },
  {
    matcher: docMatcher,
    title: 'Doc',
    loadComponent: () => import('./pages/markdown-doc').then(m => m.MarkdownDocPage)
  },
  {
    title: 'Tests',
    path: 'tests',
    pathMatch: 'full',
    canMatch: [isLocalGuard()],
    loadComponent: () => import('./pages/tests').then(m => m.TestsPage)
  }
];
