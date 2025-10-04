import { inject, Injectable } from '@angular/core';
import { Rotor, RotorsModel } from './rotor';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Encrypte {
  private _rotorService = inject(Rotor);
  
  private get _alphabet() {
    return this._rotorService.language === 'english' 
    ? 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789=+-_()*&^%$#@![]{};:/?.,<> ' 
    : 'آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی=+-_()*&^%$#@![]{};:/?.,<>0123456789 ';
  }

  async encrypte_one_char(c: string){
    await this._rotorService.loadRotors();
    const rotors = this._rotorService.getRotorSnapshot(); 
    if(!rotors) return
    const alphabet = this._alphabet;

    let index = alphabet.indexOf(c);
    if(index === -1) return c;

    const { rotor1: r1, rotor2: r2, rotor3: r3} = rotors;
    let c1, c2, c3, reflected;
    c1 = r1[alphabet.indexOf(c)];
    c2 = r2[alphabet.indexOf(c1)];
    c3 = r3[alphabet.indexOf(c2)];
    reflected = this._rotorService.getReflector(c3);
    c3 = alphabet[r3.indexOf(reflected)];
    c2 = alphabet[r2.indexOf(c3)];
    c1 = alphabet[r1.indexOf(c2)];
    return c1;
  }

  async encrypte_full_text(plain: string , settings: number[]) {
    await this._rotorService.loadRotors();
    const rotors = await firstValueFrom(this._rotorService.rotors$);
    if(!rotors) return plain;

    let cipher = '';

    for(let i = 0; i < plain.length; i++){
      const char = plain[i];
      cipher += await this.encrypte_one_char(char);
      await this._rotorService.rotateRotors(i + 1);
    }
    await this._rotorService.resetRotor(settings);
    return cipher;
  }
}
