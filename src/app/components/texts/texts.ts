import { Component, computed, EventEmitter, inject, Input, input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Encrypte } from '../../services/encrypte';
import { Rotor } from '../../services/rotor';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-texts',
  imports: [FormsModule],
  templateUrl: './texts.html',
  styleUrl: './texts.css',
  standalone: true
})
export class Texts implements OnChanges{
  private _encrypte = inject(Encrypte);
  private _rotors = inject(Rotor);
  @Input() settings = [0, 0, 0];
  @Output() cipherDone = new EventEmitter<void>();
  @Output() resetAll = new EventEmitter<void>();

  plain = '';
  cipher = '';
  disabled = false;
  
  async encrypte() {
    if(!this.plain || this.disabled) return;
    
    await this._rotors.setRotorSetting(this.settings);
    this.cipher = await this._encrypte.encrypte_full_text(this.plain, this.settings);
    this.cipherDone.emit();
    this.disabled = true;
  }
  copyToClipboard(){
    navigator.clipboard.writeText(this.cipher);
  }

  pasteFromClipboard() {
    this.disabled = false;
    navigator.clipboard.readText().then(text => this.plain = text);
  }

  async reset() {
    this.plain = '';
    this.cipher = '';
    this.disabled = false;
    this.resetAll.emit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['settings']) {
      this.disabled = false;
    }
  }
}
