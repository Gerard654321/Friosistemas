import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule, TitleCasePipe, DecimalPipe, CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

type MaterialKey = 'EPS' | 'PUR';
type PuertaKey = 'batiente' | 'vaiven' | 'corredera';
type InstalacionKey = 'recoger' | 'instalar';
type UbicacionKey = 'lima' | 'otro';
type MotorHPKey = 2 | 2.5 | 3;

interface MaterialOption {
  value: MaterialKey;
  name: string;
  price: number;
  image: string;
  description: string;
}

interface PuertaOption {
  value: PuertaKey;
  name: string;
  price: number;
  image: string;
}

interface UbicacionOption {
  value: UbicacionKey;
  name: string;
  costo: number;
}

interface MotorOption {
    value: MotorHPKey;
    name: string;
    incremento: number;
}

@Component({
  selector: 'app-cameras',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TitleCasePipe, DecimalPipe, CurrencyPipe],
  templateUrl: './cameras.component.html',
  styleUrls: ['./cameras.component.css']
})
export class CamerasComponent {
  private fb = inject(FormBuilder);

  readonly IGV = 0.18;
  readonly ALTO_DEFAULT = 2.5;

  readonly PRECIO_BASE_LOCAL_EPS = 3500;
  readonly PRECIO_BASE_LOCAL_PUR = 4500;
  readonly PRECIO_BASE_LIMITE_M2_SUPERFICIE = 5.0;

  readonly TARIFA_M3_EPS = 175;
  readonly TARIFA_M3_PUR = 225;

  readonly M2_PRECIOS: Record<MaterialKey, number> = { EPS: 25, PUR: 38 };
  readonly PUERTA_PRECIOS: Record<PuertaKey, number> = { batiente: 500, vaiven: 600, corredera: 700 };

  readonly images = {
    heroBg: 'assets/Camaras/Camara_01.jpg',
    eps: 'assets/Poliestireno_pared.jpg',
    pur: 'assets/Poliuretano_pared.jpg',
    batiente: 'assets/Puertas/Pivotante.jpg',
    vaiven: 'assets/Puertas/Vaiven.jpg',
    corredera: 'assets/Puertas/Corredera.jpg',
    planoCamara: 'assets/camara_plano.jpg'
  };

  readonly materialOptions: MaterialOption[] = [
    { value: 'EPS', name: 'Poliestireno', price: this.M2_PRECIOS.EPS, image: this.images.eps, description: 'Económico y ligero.' },
    { value: 'PUR', name: 'Poliuretano', price: this.M2_PRECIOS.PUR, image: this.images.pur, description: 'Alta eficiencia térmica.' },
  ];

  readonly puertaOptions: PuertaOption[] = [
    { value: 'batiente', name: 'Batiente', price: this.PUERTA_PRECIOS.batiente, image: this.images.batiente },
    { value: 'vaiven', name: 'Vaivén', price: this.PUERTA_PRECIOS.vaiven, image: this.images.vaiven },
    { value: 'corredera', name: 'Corredera', price: this.PUERTA_PRECIOS.corredera, image: this.images.corredera },
  ];

  readonly ubicacionOptions: UbicacionOption[] = [
    { value: 'lima', name: 'Lima', costo: 500 },
    { value: 'otro', name: 'Fuera de Lima', costo: 1000 },
  ];

  readonly motorOptions: MotorOption[] = [
    { value: 2, name: '2 HP', incremento: 0 },
    { value: 2.5, name: '2.5 HP', incremento: 500 },
    { value: 3, name: '3 HP', incremento: 1000 },
  ];

  material = signal<MaterialKey>('EPS');
  puertaTipo = signal<PuertaKey>('batiente');
  instalacion = signal<InstalacionKey>('recoger');
  instalacionUbicacion = signal<UbicacionKey>('lima');
  motorHP = signal<MotorHPKey>(2);

  cotizarAhora = signal(0);

  medidasForm = this.fb.group({
    ancho: [2.0, [Validators.required, Validators.min(0.5)]],
    alto: [2.5, [Validators.required, Validators.min(0.5)]],
    largo: [2.0, [Validators.required, Validators.min(0.5)]]
  });

  parseValue(value: string | null | undefined): number {
    if (value === null || value === undefined) {
        return NaN;
    }
    return parseFloat(value);
  }

  forzarCotizacion(): void {
    this.cotizarAhora.update(val => val + 1);
  }

  superficieBase = computed((): number => {
    const force = this.cotizarAhora();
    const { ancho, largo } = this.medidasForm.value;
    return (ancho || 0) * (largo || 0);
  });

  m3 = computed((): number => {
    const force = this.cotizarAhora();
    const { ancho, alto, largo } = this.medidasForm.value;
    return (ancho || 0) * (alto || 0) * (largo || 0);
  });

  aplicaOfertaFija = computed((): boolean => {
    const superficie = this.superficieBase();
    const alto = this.medidasForm.value.alto || 0;

    return superficie <= this.PRECIO_BASE_LIMITE_M2_SUPERFICIE && alto <= this.ALTO_DEFAULT;
  });

  costoBaseTotal = computed((): number => {
    const force = this.cotizarAhora();
    const materialKey = this.material();
    const volumen = this.m3();

    if (this.aplicaOfertaFija()) {
      return materialKey === 'EPS' ? this.PRECIO_BASE_LOCAL_EPS : this.PRECIO_BASE_LOCAL_PUR;
    }

    let tarifaM3 = materialKey === 'EPS' ? 227 : 280;

    return volumen * tarifaM3;
  });

  costoPuertaAdicional = computed((): number => {
    const force = this.cotizarAhora();
    const puerta = this.puertaTipo();

    if (this.aplicaOfertaFija()) {
      if (puerta === 'batiente') {
        return 0;
      }
      return this.PUERTA_PRECIOS[puerta] - this.PUERTA_PRECIOS['batiente'];
    }

    return this.PUERTA_PRECIOS[puerta];
  });

  costoMotorAdicional = computed((): number => {
    const motor = this.motorHP();
    if (motor === 2) {
      return 0;
    }
    return this.motorOptions.find(opt => opt.value === motor)?.incremento || 0;
  });

  costoInstalacion = computed((): number => {
    if (this.instalacion() === 'recoger') {
      return 0;
    }

    const ubicacion = this.instalacionUbicacion();
    return this.ubicacionOptions.find(opt => opt.value === ubicacion)?.costo || 0;
  });

  totalSinIgv = computed((): number => {
    return this.costoBaseTotal() + this.costoPuertaAdicional() + this.costoMotorAdicional() + this.costoInstalacion();
  });

  igv = computed((): number => {
    return this.totalSinIgv() * this.IGV;
  });

  totalConIgv = computed((): number => {
    return this.totalSinIgv() + this.igv();
  });

  onImgError(ev: Event): void {
    (ev.target as HTMLImageElement).src = 'https://dummyimage.com/1600x900/484f58/ffffff&text=IMG+404';
  }
}
