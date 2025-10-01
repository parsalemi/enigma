import { inject, Injectable } from '@angular/core';
import { Rotor, RotorsModel } from './rotor';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Encrypte {
  private _rotorService = inject(Rotor);
  private _alphabet = 'abcdefghijklmnopqrstuvwxyz=+-_()*&^%$#@![]{};:/?.,<> ';

  async encrypte_one_char(c: string){
    await this._rotorService.loadRotors();
    const rotors = this._rotorService.getRotorSnapshot(); 
    if(!rotors) return
    let index = this._alphabet.indexOf(c);
    if(index === -1) return c;

    const { rotor1: r1, rotor2: r2, rotor3: r3} = rotors;
    let c1, c2, c3, reflected;
    c1 = r1[this._alphabet.indexOf(c)];
    c2 = r2[this._alphabet.indexOf(c1)];
    c3 = r3[this._alphabet.indexOf(c2)];
    reflected = this._rotorService.getReflector(c3);
    c3 = this._alphabet[r3.indexOf(reflected)];
    c2 = this._alphabet[r2.indexOf(c3)];
    c1 = this._alphabet[r1.indexOf(c2)];
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
