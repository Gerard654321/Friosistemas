import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule, TitleCasePipe, DecimalPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

type MaterialKey = 'EPS' | 'PUR';
type PuertaKey = 'batiente' | 'vaiven' | 'corredera';
type InstalacionKey = 'recoger' | 'instalar';
type UbicacionKey = 'lima' | 'otro';
type MotorHPKey = 2 | 2.5 | 3 | 'otro';

interface MaterialOption {
  value: MaterialKey;
  name: string;
  image: string;
  description: string;
}
interface PuertaOption {
  value: PuertaKey;
  name: string;
  image: string;
}
interface UbicacionOption {
  value: UbicacionKey;
  name: string;
}
interface MotorOption {
  value: MotorHPKey;
  name: string;
}

@Component({
  selector: 'app-cameras',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TitleCasePipe],
  templateUrl: './cameras.component.html',
  styleUrls: ['./cameras.component.css']
})
export class CamerasComponent {
  private fb = inject(FormBuilder);

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
    { value: 'EPS', name: 'Poliestireno', image: this.images.eps, description: 'Económico y ligero.' },
    { value: 'PUR', name: 'Poliuretano', image: this.images.pur, description: 'Alta eficiencia térmica.' }
  ];

  readonly puertaOptions: PuertaOption[] = [
    { value: 'batiente', name: 'Batiente', image: this.images.batiente },
    { value: 'vaiven', name: 'Vaivén', image: this.images.vaiven },
    { value: 'corredera', name: 'Corredera', image: this.images.corredera }
  ];

  readonly ubicacionOptions: UbicacionOption[] = [
    { value: 'lima', name: 'Lima' },
    { value: 'otro', name: 'Fuera de Lima' }
  ];

  readonly motorOptions: MotorOption[] = [
    { value: 2, name: '2 HP' },
    { value: 2.5, name: '2.5 HP' },
    { value: 3, name: '3 HP' },
    { value: 'otro', name: 'Otra potencia' }
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

  contactarAsesor(): void {
    const ancho = this.medidasForm.value.ancho;
    const alto = this.medidasForm.value.alto;
    const largo = this.medidasForm.value.largo;
    const mensaje = `Hola, me gustaría información sobre una cámara frigorífica con las siguientes características:

• Tipo de panel: ${this.material()}
• Tipo de puerta: ${this.puertaTipo()}
• Tipo de motor: ${this.motorHP()} HP
• Dimensiones: ${ancho}m (Ancho) x ${alto}m (Alto) x ${largo}m (Largo)
• Entrega y servicio: ${
      this.instalacion() === 'recoger'
        ? 'Recoger en local'
        : 'Instalar en ' + this.instalacionUbicacion()
    }

Gracias.`;

    const url = `https://wa.me/51998691832?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  }

  onImgError(ev: Event): void {
    (ev.target as HTMLImageElement).src =
      'https://dummyimage.com/1600x900/484f58/ffffff&text=IMG+404';
  }
}
