import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
// @ts-ignore - plugin expone window.SecureStoragePlugin
declare const SecureStoragePlugin: any;

const TOKEN_KEY = 'auth_token';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private secureAvailable = typeof (window as any).SecureStoragePlugin !== 'undefined';

  async setToken(token: string) {
    if (this.secureAvailable) {
      await SecureStoragePlugin.set({ key: TOKEN_KEY, value: token });
    } else {
      // Fallback web (no cifrado)
      await Preferences.set({ key: TOKEN_KEY, value: token });
    }
  }

  async getToken(): Promise<string | null> {
    try {
      if (this.secureAvailable) {
        const r = await SecureStoragePlugin.get({ key: TOKEN_KEY });
        return r?.value ?? null;
      } else {
        const r = await Preferences.get({ key: TOKEN_KEY });
        return r.value ?? null;
      }
    } catch {
      return null;
    }
  }

  async removeToken() {
    if (this.secureAvailable) {
      await SecureStoragePlugin.remove({ key: TOKEN_KEY });
    } else {
      await Preferences.remove({ key: TOKEN_KEY });
    }
  }
}
