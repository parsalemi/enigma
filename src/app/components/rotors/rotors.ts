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
  rotors!: RotorsModel;


  async emitValue(){

    this.settingsValue.emit(this.settings);
    await this._rotors.setRotorSetting(this.settings);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.settings) {
      this.defaultSettings = [...this.settings];
    }
  }

  ngOnInit(): void {
    this.defaultSettings = [...this.settings];
    this._rotors.loadRotors().catch(() => {});
  }

  onChange() {
    this.settingsValue.emit([...this.defaultSettings]);
  }

  async apply() {
    this.settingsValue.emit([...this.defaultSettings]);
    await this._rotors.setRotorSetting(this.defaultSettings);
  }

  async randomizeSettings() {
    await this._rotors.loadRotors();
    this.settings = [
      Math.floor(Math.random() * 53),
      Math.floor(Math.random() * 53),
      Math.floor(Math.random() * 53),
    ];
    this.defaultSettings = [...this.settings];
    this.settingsValue.emit(this.settings);
    await this._rotors.setRotorSetting(this.settings);
  }

  reset() {
    this.settings = [0, 0, 0];
    this.defaultSettings = [0, 0, 0];
    this.emitValue();
    this.settingsValue.emit([...this.settings]);
    this._rotors.setRotorSetting(this.settings).catch(() => {})
  }
}
