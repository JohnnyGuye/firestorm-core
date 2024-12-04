import { Route, Routes, UrlMatchResult, UrlSegment, UrlSegmentGroup } from '@angular/router';


function docMatcher(segments: UrlSegment[], group: UrlSegmentGroup, route: Route): UrlMatchResult | null {

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
    matcher: docMatcher,
    title: 'Doc',
    loadComponent: () => import('./pages/markdown-doc').then(m => m.MarkdownDocPage)
  }
];
