import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Rotor {
  private _http = inject(HttpClient);
  env = environment;

  private _rotors$ = new BehaviorSubject<RotorsModel | null>(null);
  rotors$ = this._rotors$.asObservable();

  private _language = new BehaviorSubject<'english' | 'farsi'>('english');
  language$ = this._language.asObservable();

  private _original: RotorsModel | null = null;

  setLanguage(lang: 'english' | 'farsi') {
    this._language.next(lang);
    this._original = null;
    this._rotors$.next(null);
  }

  get language() {
    return this._language.value;
  }

  private shift(rotor: string, n: number) {
    return rotor.slice(n) + rotor.slice(0, n);
  }

  async loadRotors(): Promise<RotorsModel> {
    if (!this._original) {
      const filename = this.language === 'farsi' ? 'farsi-shuffle.json' : 'shuffle.json';
      const rotors = await firstValueFrom(
        this._http.get<RotorsModel>(`${this.env.fileUrl}/${filename}`)
      );
      this._original = rotors;
      this._rotors$.next(rotors);
    } else if (!this._rotors$.value) {
      this._rotors$.next({ ...this._original });
    }
    return this._rotors$.value!;
  }

  getRotorSnapshot() {
    return this._rotors$.value;
  }

  async setRotorSetting(settings: number[]) {
    await this.loadRotors();
    if (!this._original) return;

    const [s1, s2, s3] = settings;
    this._rotors$.next({
      rotor1: this.shift(this._original.rotor1, s1 % this._original.rotor1.length),
      rotor2: this.shift(this._original.rotor2, s2 % this._original.rotor2.length),
      rotor3: this.shift(this._original.rotor3, s3 % this._original.rotor3.length),
    });
  }

  async rotateRotors(step: number) {
    const current = this.getRotorSnapshot();
    if (!current) return;

    let { rotor1: r1, rotor2: r2, rotor3: r3 } = current;
    const length = r1.length;

    r1 = r1.slice(1) + r1[0];
    if (step % length === 0) r2 = r2.slice(1) + r2[0];
    if (step % (length * length) === 0) r3 = r3.slice(1) + r3[0];

    this._rotors$.next({ rotor1: r1, rotor2: r2, rotor3: r3 });
  }

  async resetRotor(settings: number[]) {
    if (!this._original) await this.loadRotors();
    this._rotors$.next({ ...this._original! });
    await this.setRotorSetting(settings);
  }

  getReflector(c: string) {
    const english = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789=+-_()*&^%$#@![]{};:/?.,<> ';
    const farsi = 'آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی=+-_()*&^%$#@![]{};:/?.,<>0123456789 '
    const alphabet = this.language === 'farsi' ? farsi : english;
    return alphabet[alphabet.length - alphabet.indexOf(c) - 1];
  }
}

export interface RotorsModel {
  rotor1: string;
  rotor2: string;
  rotor3: string;
}