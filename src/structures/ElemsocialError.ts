export class ElemsocialError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ElemsocialError';
  }
}
