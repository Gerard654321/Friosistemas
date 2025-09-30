import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFacebookF, faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.css']
})
export class Footer {
  faFacebook = faFacebookF;
  faInstagram = faInstagram;
  faWhatsapp = faWhatsapp;
}
