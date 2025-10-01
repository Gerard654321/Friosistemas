import { Component, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  private title = inject(Title);
  private meta = inject(Meta);

  constructor() {
    this.title.setTitle('Nosotros');
    this.meta.updateTag({
      name: 'description',
      content:
        'Friosistemas: especialistas en paneles de poliestireno y poliuretano, puertas y cámaras frigoríficas. Carapongo, Lima – Perú.'
    });
  }

  readonly company = {
    name: 'Friosistemas',
    location: 'Carapongo - Chosica, Lima - Perú',
    email: 'ventas@friosistemas.pe',
    phone: '+51 991 038 374'
  };

  readonly values = [
    { title: 'Calidad', desc: 'Trabajamos con estándares y materiales certificados.' },
    { title: 'Rapidez', desc: 'Fabricación e instalación con tiempos competitivos.' },
    { title: 'Ahorro energético', desc: 'Soluciones eficientes para frío comercial e industrial.' },
    { title: 'Soporte', desc: 'Acompañamiento técnico antes, durante y después del proyecto.' }
  ];

  readonly services = [
    'Venta de paneles de poliestireno y poliuretano',
    'Fabricación de puertas para cámaras frigoríficas',
    'Diseño y construcción de cámaras frigoríficas'
  ];
}
