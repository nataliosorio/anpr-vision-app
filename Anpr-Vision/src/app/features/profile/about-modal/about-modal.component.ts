import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonIcon,
  IonText,
  IonCard,
  IonCardContent,
  ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  closeOutline,
  informationCircleOutline,
  globeOutline,
  schoolOutline,
  codeOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-about-modal',
  templateUrl: './about-modal.component.html',
  styleUrls: ['./about-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonIcon, IonText, IonCard, IonCardContent]
})
export class AboutModalComponent {

  private modalController = inject(ModalController);

  constructor() {
    addIcons({
      closeOutline,
      informationCircleOutline,
      globeOutline,
      schoolOutline,
      codeOutline
    });
  }

  dismiss() {
    this.modalController.dismiss();
  }

  openWebsite() {
    window.open('https://6908da95978cb100082b47fc--courageous-salamander-30e352.netlify.app/', '_blank');
  }

}
