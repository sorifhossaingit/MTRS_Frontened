import { Component } from '@angular/core';
import { Save, UserPlus } from 'lucide-angular';

@Component({
  selector: 'app-doctors-list',
  templateUrl: './doctors-list.component.html',
  styleUrl: './doctors-list.component.css'
})
export class DoctorsListComponent {

  UserPlus = UserPlus;
  Save = Save;

  doctor: any = {};
}
