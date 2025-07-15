import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import {enc,mode,AES,pad} from 'crypto-js';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class EncryptDecryptService {
    private key = enc.Utf8.parse(environment.EncryptKey.toString());
    private iv = enc.Utf8.parse(environment.EncryptIV.toString());
    constructor() {}
    // Methods for the encrypt and decrypt Using AES
    encryptUsingAES256(text): any {
      
       let v= JSON.stringify(text)
        var encrypted = AES.encrypt(enc.Utf8.parse(v), this.key, {
            keySize: 128 / 8,
            iv: this.iv,
            mode: mode.CBC,
            padding: pad.Pkcs7
        });
        return encrypted.toString();
    }
    decryptUsingAES256(decString) {
        
        var decrypted = AES.decrypt(decString, this.key, {
            keySize: 128 / 8,
            iv: this.iv,
            mode: mode.CBC,
            padding: pad.Pkcs7
        });
        return decrypted.toString();
    }
}