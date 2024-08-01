export class UnauthorizedError extends Error {
    constructor(message: string = 'Unauthorized access') {
      super(message);
      this.name = 'UnauthorizedError';
}
}

export class PhotographerDoesNotExist extends Error {
    constructor(message: string = 'Photographer does not exist') {
      super(message);
      this.name = 'PhotographerDoesNotExist';
    }
}