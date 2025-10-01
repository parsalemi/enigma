import { Component, inject, Input, input, OnChanges, OnInit, output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Rotor, RotorsModel } from '../../services/rotor';

@Component({
  selector: 'app-rotors',
  templateUrl: './rotors.html',
  styleUrl: './rotors.css',
  imports: [FormsModule],
  inputs: ['settings']
})
export class Rotors implements OnChanges, OnInit{
  @Input() settings: number[] = [0, 0, 0];
  settingsValue = output<number[]>();
  defaultSettings = [0, 0, 0];

  private _rotors = inject(Rotor);

  ngOnInit(): void {
    this.defaultSettings = [...this.settings];
    this._rotors.loadRotors().catch(() => {});
  }

  ngOnChanges(): void {
    this.defaultSettings = [...this.settings];
  }

  async emitValue(){
    this.settingsValue.emit(this.settings);
    await this._rotors.setRotorSetting(this.settings);
  }

  async apply() {
    this.settingsValue.emit([...this.defaultSettings]);
    await this._rotors.setRotorSetting(this.defaultSettings);
  }

  async randomizeSettings() {
    await this._rotors.loadRotors();
    this.defaultSettings = Array.from({ length: 3 }, () => Math.floor(Math.random() * 53));
    this.settingsValue.emit([...this.defaultSettings]);
    await this._rotors.setRotorSetting(this.defaultSettings);
  }

  async reset() {
    this.defaultSettings = [0, 0, 0];
    this.settingsValue.emit([...this.defaultSettings]);
    await this._rotors.setRotorSetting(this.defaultSettings);
  }
}
