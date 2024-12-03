import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";

import * as layout from "../../../public/doc/layout.json"

@Injectable({ providedIn: 'root' })
export class DocPageService {
  
  private http = inject(HttpClient)

  constructor() {}

  getDocLayout() {
    return layout.layout
    // return this.http.get()
  }
}