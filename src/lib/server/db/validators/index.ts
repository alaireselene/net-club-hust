// Export base validation utilities
export * from './base';

// Export schema validators
export * as UserValidators from './user';
export * as ClubValidators from './club';
export * as EventValidators from './event';
export * as PostValidators from './post';
export * as ResearchValidators from './research';
export * as ResourceValidators from './resource';

// Export schema types
export type { UserLoginData } from './user';
export type { AddMemberData, UpdateMemberRoleData } from './club';
export type { AddSponsorData } from './event';
export type { PublishPostData } from './post';
export type { AddCoauthorData, CompleteResearchData } from './research';
export type { UpdateAccessLevelData } from './resource';

// Export common enums
export { userRoles } from './user';
export { eventTypes, eventStatuses } from './event';
export { postCategories, postStatuses } from './post';
export { researchStatuses } from './research';
export { resourceTypes, resourceCategories, accessLevels } from './resource';

// Export validation functions
export {
  validateData,
  validatePartialData,
  ValidationError,
  ValidationMessages
} from './base';

// Export validation utilities
export { canAccessResource } from './resource';

// Export schema type checking functions
export {
  isCreateUserInput,
  isUpdateUserInput
} from './user';

export {
  isCreateClubInput,
  isUpdateClubInput
} from './club';

export {
  isCreateEventInput,
  isUpdateEventInput
} from './event';

export {
  isCreatePostInput,
  isUpdatePostInput
} from './post';

export {
  isCreateResearchInput,
  isUpdateResearchInput
} from './research';

export {
  isCreateResourceInput,
  isUpdateResourceInput
} from './resource';