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
  IonList,
  IonItem,
  IonLabel,
  IonText,
  ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  closeOutline,
  chevronDownOutline,
  chevronUpOutline,
  helpCircleOutline
} from 'ionicons/icons';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  isExpanded: boolean;
}

@Component({
  selector: 'app-help-modal',
  templateUrl: './help-modal.component.html',
  styleUrls: ['./help-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonIcon, IonList, IonItem, IonLabel, IonText]
})
export class HelpModalComponent {

  private modalController = inject(ModalController);

  faqItems: FAQItem[] = [
    {
      id: 1,
      question: '¿Qué es ANPR VISION?',
      answer: 'ANPR VISION es una aplicación móvil desarrollada como proyecto de grado académico. Utiliza reconocimiento automático de placas (ANPR) para gestionar el ingreso y salida de vehículos en parqueaderos, permitiendo a los usuarios consultar información en tiempo real sobre sus vehículos.',
      isExpanded: false
    },
    {
      id: 2,
      question: '¿Cómo funciona la detección de vehículos?',
      answer: 'La aplicación utiliza cámaras y algoritmos de visión computacional para leer las placas de los vehículos automáticamente cuando entran o salen del parqueadero. Esta información se registra en tiempo real y se muestra en la aplicación móvil.',
      isExpanded: false
    },
    {
      id: 3,
      question: '¿Qué información puedo ver sobre mis vehículos?',
      answer: 'Puedes consultar: estado actual (dentro/fuera del parqueadero), tiempo de permanencia, ubicación dentro del parqueadero, historial de ingresos y salidas, y valores estimados de cobro.',
      isExpanded: false
    },
    {
      id: 4,
      question: '¿Es segura mi información?',
      answer: 'Como proyecto académico, manejamos la información con buenas prácticas básicas de seguridad. Solo se almacenan datos necesarios para el funcionamiento de la aplicación y se usan únicamente con fines académicos.',
      isExpanded: false
    },
    {
      id: 5,
      question: '¿Puedo registrar múltiples vehículos?',
      answer: 'Sí, puedes asociar múltiples vehículos a tu cuenta usando sus respectivas placas. La aplicación te permitirá consultar la información de todos tus vehículos registrados.',
      isExpanded: false
    },
    {
      id: 6,
      question: '¿Cómo se calculan los cobros?',
      answer: 'Los valores mostrados son estimaciones basadas en el tiempo de permanencia y las tarifas del parqueadero. Los cobros finales se gestionan directamente con el operador del parqueadero.',
      isExpanded: false
    },
    {
      id: 7,
      question: '¿Qué hago si hay un error en la detección?',
      answer: 'Como es un prototipo académico, pueden existir errores de lectura de placas. En caso de discrepancias, contacta al operador del parqueadero para verificar manualmente.',
      isExpanded: false
    },
    {
      id: 8,
      question: '¿La aplicación funciona sin conexión a internet?',
      answer: 'La aplicación requiere conexión a internet para sincronizar datos en tiempo real. Sin conexión, podrás ver información previamente cargada pero no actualizaciones en vivo.',
      isExpanded: false
    },
    {
      id: 9,
      question: '¿Cómo contacto al soporte técnico?',
      answer: 'Para soporte técnico o consultas sobre el proyecto, puedes comunicarte con el equipo desarrollador a través del correo: anprVision@gmail.com',
      isExpanded: false
    },
    {
      id: 10,
      question: '¿Es esta una aplicación comercial?',
      answer: 'No, ANPR VISION es un proyecto académico desarrollado por estudiantes del Tecnólogo en Análisis y Desarrollo de Software. No constituye un producto comercial ni un servicio formal de parqueadero.',
      isExpanded: false
    }
  ];

  constructor() {
    addIcons({
      closeOutline,
      chevronDownOutline,
      chevronUpOutline,
      helpCircleOutline
    });
  }

  dismiss() {
    this.modalController.dismiss();
  }

  toggleAnswer(item: FAQItem) {
    item.isExpanded = !item.isExpanded;
  }

  getExpandedIcon(item: FAQItem): string {
    return item.isExpanded ? 'chevron-up-outline' : 'chevron-down-outline';
  }
}
