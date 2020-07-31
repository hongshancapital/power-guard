export default class PowerGuardError extends Error {
  guardType: string;
  value: unknown;
  optional: boolean;
  details?: string;

  constructor(guardType: string, value: unknown, optional: boolean, details?: string) {
    super(
      `Error guarding ${optional ? 'optional ' : ''}${guardType}, received ${value}.${
        details ? `\n  Info: ${details}` : ''
      }`,
    );

    this.name = 'PowerGuardError';
    this.guardType = guardType;
    this.value = value;
    this.optional = optional;
    this.details = details;
  }
}
