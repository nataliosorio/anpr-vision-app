import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { GeneralService } from 'src/app/generic/services/general.service';
import { VehicleDto } from 'src/app/generic/models/IEntitys';
import { FormatDatePipe } from "../../shared/formatDate/format-date-pipe";

type FilterKey = 'all' | 'car' | 'moto' | 'bike';

// interface VehicleDto {
//   id: number;
//   plate: string;
//   color: string;
//   typeVehicleId: number;
//   typeVehicle?: string | null; // "Auto" | "Moto" | "Bicicletas"
//   clientId: number;
//   client?: string | null;
//   asset: boolean;
//   isDeleted: boolean;
// }
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  details?: any;
}

/** Mapa de imágenes por tipo */
const TYPE_IMAGE_MAP_ID: Record<number, string> = {
  1: 'assets/images/vehiculos/auto.png',
  4: 'assets/images/vehiculos/moto.png',
  5: 'assets/images/vehiculos/bici.png',
  // agrega otros ids si corresponde
};
const TYPE_IMAGE_MAP_NAME: Record<string, string> = {
  'auto': 'assets/images/vehiculos/auto.png',
  'moto': 'assets/images/vehiculos/moto.png',
  'bicicletas': 'assets/images/vehiculos/bici.png',
  'Bicicletas': 'assets/images/vehiculos/bici.png',
  'bicicleta': 'assets/images/vehiculos/bici.png',
  'car': 'assets/images/vehiculos/auto.png',
  'motorcycle': 'assets/images/vehiculos/moto.png',
};
const DEFAULT_VEHICLE_IMG = 'assets/images/vehiculos/default.png';
const OTHER_VEHICLE_IMG = 'assets/images/vehiculos/otros.png';

function normalizeTypeName(name?: string | null) {
  return (name || '').trim().toLowerCase();
}

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule, FormatDatePipe]
})
export class HomePageC implements OnInit, OnDestroy {
  username: string | null = null;

  // Vehículos
  selectedFilter: FilterKey = 'all';
  allVehicles: VehicleDto[] = [];
  selectedVehicle: VehicleDto | null = null;
  loadingVehicles = true;

  // (Si aún usas tu slider, puedes mantenerlo)
  private slideInterval: any;
  currentSlideIndex = 0;
  totalSlides = 3;

  constructor(private general: GeneralService) {}

  async ngOnInit() {
    await this.loadUserInfo();
    await this.loadVehiclesFromApi();
    this.initializeSlider();
  }

  ngOnDestroy() {
    if (this.slideInterval) clearInterval(this.slideInterval);
  }

  private async loadUserInfo() {
    this.username = await this.general.getUsername();
  }

  private mapFilterToType(filter: FilterKey): string | null {
    if (filter === 'car') return 'Auto';
    if (filter === 'moto') return 'Moto';
    if (filter === 'bike') return 'Bicicletas';
    return null; // all
  }

  async loadVehiclesFromApi() {
    this.loadingVehicles = true;
    try {
      const clientId = await this.general.getClientId();
      if (!clientId) {
        this.allVehicles = [];
        this.selectedVehicle = null;
        return;
      }
      const resp = await firstValueFrom(
        this.general.get<ApiResponse<VehicleDto[]>>(`Vehicle/byClient/${clientId}`)
      );
      this.allVehicles = resp?.data ?? [];
      this.autoPickFirst();
    } catch (e) {
      console.error('Error cargando vehículos', e);
      this.allVehicles = [];
      this.selectedVehicle = null;
    } finally {
      this.loadingVehicles = false;
    }
  }

  get filteredVehicles(): VehicleDto[] {
    const type = this.mapFilterToType(this.selectedFilter);
    if (!type) return this.allVehicles;
    return this.allVehicles.filter(v => (v.typeVehicle ?? '').toLowerCase() === type.toLowerCase());
  }

  onChangeFilter(f: FilterKey) {
    this.selectedFilter = f;
    this.autoPickFirst();
  }

  autoPickFirst() {
    const list = this.filteredVehicles;
    this.selectedVehicle = list.length > 0 ? list[0] : null;
  }

  onPick(v: VehicleDto) {
    this.selectedVehicle = v;
  }

  getVehicleImg(v: VehicleDto | null): string {
    if (!v) return DEFAULT_VEHICLE_IMG;

    // 1) por ID
    if (v.typeVehicleId != null && TYPE_IMAGE_MAP_ID[v.typeVehicleId]) {
      return TYPE_IMAGE_MAP_ID[v.typeVehicleId];
    }
    // 2) por nombre
    const key = normalizeTypeName(v.typeVehicle);
    if (key && TYPE_IMAGE_MAP_NAME[key]) {
      return TYPE_IMAGE_MAP_NAME[key];
    }
    // 3) fallback
    return OTHER_VEHICLE_IMG;
  }

  // Slider demo (si lo usas)
  private initializeSlider(): void {
    this.slideInterval = setInterval(() => this.nextSlide(), 4000);
  }
  nextSlide(): void {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.totalSlides;
  }
}
