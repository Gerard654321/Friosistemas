import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type TipoPuerta = 'batiente' | 'vaiven' | 'corrediza';

@Component({
  selector: 'app-doors',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './doors.component.html',
  styleUrls: ['./doors.component.css']
})
export class DoorsComponent {
  tipoPuerta: TipoPuerta = 'batiente';
  hojas: number = 1;
  ancho: number = 1;
  alto: number = 2;
  precio: number = 0;

  precios: Record<TipoPuerta, number> = {
    batiente: 500,
    vaiven: 600,
    corrediza: 700
  };

  get area(): number {
    return this.ancho * this.alto;
  }

  calcularPrecio() {
    this.precio = this.area * this.precios[this.tipoPuerta];
  }

  get whatsappMessage(): string {
    const detalleHojas = this.tipoPuerta === 'vaiven' ? ` con ${this.hojas} hoja(s)` : '';
    return `Hola, estoy interesado en una puerta tipo ${this.tipoPuerta}${detalleHojas} de ${this.ancho}m x ${this.alto}m. La cotización es $${this.precio.toFixed(2)}`;
  }

  enviarWhatsApp() {
    const url = `https://wa.me/51991038374?text=${encodeURIComponent(this.whatsappMessage)}`;
    window.open(url, '_blank');
  }
}
