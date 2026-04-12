type SignalType = '401' | '403' | '500';

class SignalManager {
  private listeners: Set<(type: SignalType, message?: string) => void> = new Set();

  subscribe(listener: (type: SignalType, message?: string) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  emit(type: SignalType, message?: string) {
    this.listeners.forEach(listener => listener(type, message));
  }
}

export const signals = new SignalManager();
