export class DatabaseError extends Error {
	constructor(
		message: string,
		public cause?: unknown
	) {
		super(message);
		this.name = 'DatabaseError';
	}
}

export class NotFoundError extends DatabaseError {
	constructor(entity: string, identifier: string | number) {
		super(`${entity} not found with identifier: ${identifier}`);
		this.name = 'NotFoundError';
	}
}

export class ValidationError extends DatabaseError {
	constructor(message: string) {
		super(message);
		this.name = 'ValidationError';
	}
}

export class UniqueConstraintError extends DatabaseError {
	constructor(entity: string, field: string) {
		super(`${entity} with this ${field} already exists`);
		this.name = 'UniqueConstraintError';
	}
}
