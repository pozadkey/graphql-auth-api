export class AuthenticationError extends Error {
    statusCode: number;
    constructor(message: string) {
      super(message);
      this.name = 'AuthenticationError';
      this.statusCode = 401; 
    }
  }
  
  export class ValidationError extends Error {
    statusCode: number;
    constructor(message: string) {
      super(message);
      this.name = 'ValidationError';
      this.statusCode = 400; 
    }
  }

  
  