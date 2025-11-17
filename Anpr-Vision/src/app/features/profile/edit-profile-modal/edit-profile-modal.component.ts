import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonItem,
  IonInput,
  IonList,
  ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, saveOutline } from 'ionicons/icons';
import { AuthUserDto, PersonDto } from '../services/user.service';

@Component({
  selector: 'app-edit-profile-modal',
  templateUrl: './edit-profile-modal.component.html',
  styleUrls: ['./edit-profile-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonButtons,
    IonIcon,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonItem,
    IonInput,
    IonList
  ]
})
export class EditProfileModalComponent {

  @Input() user!: AuthUserDto;
  @Input() person!: PersonDto;

  selectedSegment: string = 'user';

  private modalController = inject(ModalController);

  constructor() {
    addIcons({
      closeOutline,
      saveOutline
    });
  }

  dismiss() {
    this.modalController.dismiss();
  }

  save() {
    this.modalController.dismiss({
      user: this.user,
      person: this.person
    });
  }

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
  }

}
