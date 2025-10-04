import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Rotor, RotorsModel } from './services/rotor';
import { Texts } from "./components/texts/texts";
import { Rotors } from "./components/rotors/rotors";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Texts, Rotors],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{
  protected title = 'enigma';
  private _rotorService = inject(Rotor);
  rotors!: RotorsModel;
  rotorSettings: number[] = [0, 0, 0];
  language = this._rotorService.language;

  async ngOnInit() {
    this.rotors = await this._rotorService.loadRotors();
  }
  async setLanguage(lang: 'english' | 'farsi') {
    this.language = lang;
    this._rotorService.setLanguage(lang);
    await this._rotorService.loadRotors();
    await this._rotorService.setRotorSetting(this.rotorSettings);
  }

  updateSettings(settings: number[]) {
    this.rotorSettings = [...settings];
  }
  
  async onCipherDone() {
    await this._rotorService.resetRotor(this.rotorSettings);
    await this._rotorService.setRotorSetting(this.rotorSettings);
  }

  async onResetAll() {
    this.rotorSettings = [0, 0, 0];
    await this._rotorService.resetRotor(this.rotorSettings);
    await this._rotorService.setRotorSetting([0, 0, 0]);
  }
}
