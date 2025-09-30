import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

type Material = 'EPS' | 'PUR';
type EpsTipo = 'techo' | 'pared';
type EpsEspesor = '100' | '200';
type PurEspesor = '100' | '150';

@Component({
  selector: 'app-panels',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './panels.component.html',
  styleUrls: ['./panels.component.css']
})
export class PanelsComponent {
  private fb = inject(FormBuilder);

  readonly IGV = 0.18;

  readonly EPS_TECHO_LARGO = 3;
  readonly EPS_TECHO_ANCHO = 1.16;
  readonly EPS_TECHO_PRECIO_M2 = 25;

  readonly EPS_PARED_ANCHO = 1.16;
  readonly EPS_PARED_PRECIO_100 = 25;
  readonly EPS_PARED_PRECIO_200 = 35;

  readonly PUR_PRECIO_100_CON_IGV = 650;
  readonly PUR_PRECIO_150_CON_IGV = 750;

  readonly images = {
    epsTecho: 'assets/Poliestireno_techo.jpg',
    epsPared: 'assets/Poliestireno_pared.jpg',
    pur: 'assets/Poliuretano_pared.jpg',
    panels: 'assets/Carapongo/Paneles_fondo.jpeg'
  };

  material = signal<Material>('EPS');
  epsTipo  = signal<EpsTipo>('techo');

  epsFormTecho = this.fb.group({
    cantidad: [1, [Validators.required, Validators.min(1)]],
  });

  epsFormPared = this.fb.group({
    espesor: ['100' as EpsEspesor, Validators.required],
    largoMetros: [1, [Validators.required, Validators.min(0.5)]],
  });

  purForm = this.fb.group({
    espesor: ['100' as PurEspesor, Validators.required],
    cantidad: [1, [Validators.required, Validators.min(1)]],
  });

  get epsTechoM2PorPlacha(): number {
    return this.EPS_TECHO_LARGO * this.EPS_TECHO_ANCHO;
  }
  get epsTechoCantidad(): number {
    return Number(this.epsFormTecho.get('cantidad')!.value) || 0;
  }
  get epsTechoSubtotal(): number {
    return this.epsTechoCantidad * this.epsTechoM2PorPlacha * this.EPS_TECHO_PRECIO_M2;
  }
  get epsTechoIgv(): number { return this.epsTechoSubtotal * this.IGV; }
  get epsTechoTotal(): number { return this.epsTechoSubtotal + this.epsTechoIgv; }

  get epsParedEspesor(): EpsEspesor {
    return (this.epsFormPared.get('espesor')!.value as EpsEspesor) ?? '100';
  }
  get epsParedLargo(): number {
    return Number(this.epsFormPared.get('largoMetros')!.value) || 0;
  }
  get epsParedM2(): number {
    return this.epsParedLargo * this.EPS_PARED_ANCHO;
  }
  get epsParedPrecioM2(): number {
    return this.epsParedEspesor === '100'
      ? this.EPS_PARED_PRECIO_100
      : this.EPS_PARED_PRECIO_200;
  }
  get epsParedSubtotal(): number { return this.epsParedM2 * this.epsParedPrecioM2; }
  get epsParedIgv(): number { return this.epsParedSubtotal * this.IGV; }
  get epsParedTotal(): number { return this.epsParedSubtotal + this.epsParedIgv; }

  get purEspesor(): PurEspesor {
    return (this.purForm.get('espesor')!.value as PurEspesor) ?? '100';
  }
  get purCantidad(): number {
    return Number(this.purForm.get('cantidad')!.value) || 0;
  }
  get purUnitConIgv(): number {
    return this.purEspesor === '100'
      ? this.PUR_PRECIO_100_CON_IGV
      : this.PUR_PRECIO_150_CON_IGV;
  }
  get purTotalConIgv(): number { return this.purCantidad * this.purUnitConIgv; }
  get purSubtotal(): number { return this.purTotalConIgv / (1 + this.IGV); }
  get purIgv(): number { return this.purTotalConIgv - this.purSubtotal; }

  cotizarEpsTecho() {
    this.epsFormTecho.markAllAsTouched();
    this.epsFormTecho.updateValueAndValidity({ onlySelf: false, emitEvent: true });
  }
  cotizarEpsPared() {
    this.epsFormPared.markAllAsTouched();
    this.epsFormPared.updateValueAndValidity({ onlySelf: false, emitEvent: true });
  }
  cotizarPur() {
    this.purForm.markAllAsTouched();
    this.purForm.updateValueAndValidity({ onlySelf: false, emitEvent: true });
  }

  money(v: number) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })
      .format(v || 0);
  }

  private wa(phone: string, text: string) {
    const encoded = encodeURIComponent(text);
    return `https://wa.me/${phone}?text=${encoded}`;
  }

  pedirEpsTecho() {
    const cant = this.epsTechoCantidad;
    const msg = `Hola, estoy interesado en comprar ${cant} planchas de paneles EPS para techo (3.00m x 1.16m, 200mm). Total aprox: ${this.money(this.epsTechoTotal)}`;
    window.open(this.wa('51991038374', msg), '_blank');
  }

  pedirEpsPared() {
    const largo = this.epsParedLargo;
    const esp = this.epsParedEspesor;
    const msg = `Hola, estoy interesado en paneles EPS para pared de ${esp}mm, ${largo}m de largo (ancho 1.16m). Total aprox: ${this.money(this.epsParedTotal)}`;
    window.open(this.wa('51991038374', msg), '_blank');
  }

  pedirPur() {
    const cant = this.purCantidad;
    const esp = this.purEspesor;
    const msg = `Hola, estoy interesado en ${cant} planchas de panel PUR de ${esp}mm. Total aprox: ${this.money(this.purTotalConIgv)}`;
    window.open(this.wa('51991038374', msg), '_blank');
  }

  onImgError(ev: Event) {
    (ev.target as HTMLImageElement).src = 'https://dummyimage.com/1200x675/1f2937/ffffff&text=Imagen+no+disponible';
  }
}
