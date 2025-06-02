// src/app/directives/promocao.directive.ts
import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appPromocao]',
  standalone: true // Importante: mantenha standalone como true
})
export class PromocaoDirective implements OnInit {
  @Input() emPromocao: boolean = false;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    if (this.emPromocao) {
      this.el.nativeElement.style.border = '2px solid var(--ion-color-success)';
      this.el.nativeElement.style.borderRadius = '8px';
      this.el.nativeElement.style.position = 'relative';
      this.el.nativeElement.style.overflow = 'hidden';
      
      const badge = document.createElement('div');
      badge.textContent = 'PROMOÇÃO';
      badge.style.position = 'absolute';
      badge.style.top = '10px';
      badge.style.right = '-30px';
      badge.style.backgroundColor = 'var(--ion-color-success)';
      badge.style.color = 'white';
      badge.style.padding = '2px 30px';
      badge.style.transform = 'rotate(45deg)';
      badge.style.fontSize = '10px';
      badge.style.fontWeight = 'bold';
      badge.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
      
      this.el.nativeElement.appendChild(badge);
    }
  }
}