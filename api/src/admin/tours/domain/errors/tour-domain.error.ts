export class TourDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class InvalidTourDetailsError extends TourDomainError {}

export class InvalidTourStateTransitionError extends TourDomainError {}
