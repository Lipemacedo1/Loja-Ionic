import { Directive, ElementRef, Input, OnChanges, SimpleChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appPromocao]',
  standalone: true
})
export class PromocaoDirective implements OnChanges {
  @Input() emPromocao: boolean = false;
  private badge: HTMLElement | null = null;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['emPromocao']) {
      this.atualizarEstiloPromocao();
    }
  }

  private atualizarEstiloPromocao() {
    const elemento = this.el.nativeElement;
    
    // Remove o badge existente se houver
    if (this.badge) {
      this.renderer.removeChild(elemento, this.badge);
      this.badge = null;
    }

    // Aplica estilos apenas se estiver em promoção
    if (this.emPromocao) {
      // Estilos no elemento principal
      this.renderer.setStyle(elemento, 'position', 'relative');
      this.renderer.setStyle(elemento, 'overflow', 'hidden');
      this.renderer.setStyle(elemento, 'border', '2px solid var(--ion-color-success)');
      this.renderer.setStyle(elemento, 'border-radius', '8px');
      
      // Cria o badge de promoção
      this.badge = this.renderer.createElement('div');
      this.renderer.addClass(this.badge, 'promo-badge');
      
      // Adiciona o ícone de tag
      const icon = this.renderer.createElement('ion-icon');
      this.renderer.setAttribute(icon, 'name', 'pricetag');
      this.renderer.setStyle(icon, 'margin-right', '4px');
      this.renderer.setStyle(icon, 'font-size', '0.9em');
      
      // Adiciona o texto
      const text = this.renderer.createText('PROMOÇÃO');
      
      // Monta a estrutura
      this.renderer.appendChild(this.badge, icon);
      this.renderer.appendChild(this.badge, text);
      
      // Estilos do badge
      this.renderer.setStyle(this.badge, 'position', 'absolute');
      this.renderer.setStyle(this.badge, 'top', '10px');
      this.renderer.setStyle(this.badge, 'right', '-25px');
      this.renderer.setStyle(this.badge, 'background-color', 'var(--ion-color-success)');
      this.renderer.setStyle(this.badge, 'color', 'white');
      this.renderer.setStyle(this.badge, 'padding', '3px 30px');
      this.renderer.setStyle(this.badge, 'transform', 'rotate(45deg)');
      this.renderer.setStyle(this.badge, 'font-size', '10px');
      this.renderer.setStyle(this.badge, 'font-weight', 'bold');
      this.renderer.setStyle(this.badge, 'box-shadow', '0 2px 5px rgba(0,0,0,0.2)');
      this.renderer.setStyle(this.badge, 'z-index', '10');
      this.renderer.setStyle(this.badge, 'pointer-events', 'none');
      
      // Adiciona o badge ao elemento
      this.renderer.appendChild(elemento, this.badge);
    } else {
      // Remove estilos se não estiver em promoção
      this.renderer.removeStyle(elemento, 'border');
      this.renderer.removeStyle(elemento, 'border-radius');
      this.renderer.removeStyle(elemento, 'position');
      this.renderer.removeStyle(elemento, 'overflow');
    }
  }
}