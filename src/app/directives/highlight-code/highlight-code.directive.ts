import { Directive, ElementRef, Input } from '@angular/core';
import hljs from 'highlight.js';
import { environment } from 'src/app/environment/environment';

@Directive({
  selector: '[foHighlightCode]'
})
export class HighlightCodeDirective {

  @Input("foHighlightCode") public code:string = "";

  @Input("language") public language: string = "typescript";

  constructor(private elementRef: ElementRef<HTMLElement>) { }

  ngOnInit() {
    if(!environment.production){ // example code
      this.code = "@Directive({\n    selector: '[foToto]'\n})\nexport class Toto{\n    constructor(public tata: string){}\n}"
    }
    this.highlight();
  }

  highlight() {
    this.elementRef.nativeElement.innerHTML = `<pre class="hljs"><code class="hljs">${hljs.highlight(this.code, {language: this.language }).value }</code></pre>`;
  }
}

