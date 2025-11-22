import { Component, OnInit, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  PopoverController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  filterOutline,
  locationOutline,
  exitOutline,
  checkmarkOutline
} from 'ionicons/icons';

interface FilterOption {
  key: 'all' | 'parked' | 'not-parked';
  label: string;
  icon: string;
}

@Component({
  selector: 'app-filter-popover',
  templateUrl: './filter-popover.component.html',
  styleUrls: ['./filter-popover.component.scss'],
  standalone: true,
  imports: [CommonModule, IonList, IonItem, IonIcon, IonLabel]
})
export class FilterPopoverComponent implements OnInit {

  @Input() activeFilter: 'all' | 'parked' | 'not-parked' = 'all';
  @Input() filterOptions: FilterOption[] = [];

  private popoverController = inject(PopoverController);

  constructor() {
    addIcons({
      filterOutline,
      locationOutline,
      exitOutline,
      checkmarkOutline
    });
  }

  ngOnInit() {}

  selectFilter(filterKey: 'all' | 'parked' | 'not-parked') {
    this.popoverController.dismiss({
      selectedFilter: filterKey
    });
  }

  isActive(filterKey: string): boolean {
    return this.activeFilter === filterKey;
  }
}
