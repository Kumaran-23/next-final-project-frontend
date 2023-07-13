import { writable } from 'svelte/store';

export const alertStore = writable({ text: '', type: ''});

export function showAlert(text, type) {
  alertStore.set({ text, type });

  setTimeout(() => {
    clearAlert();
  }, 2500);
};
  
export function clearAlert() {
  alertStore.set({ text: '', type: '' });
};