import { getErrorMessage } from '@/utils/error-handler';
/**
 * Form Validation Utilities
 * Comprehensive form validation with error handling
 */

import { z } from 'zod';
import { logger } from '@/utils/logger';

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  data?: any;
}

export class FormValidator {
  private schema: z.ZodSchema;
  private customValidators: Map<string, (value: any) => string | null> = new Map();

  constructor(schema: z.ZodSchema) {
    this.schema = schema;
  }

  /**
   * Add custom validator for a specific field
   */
  addCustomValidator(field: string, validator: (value: any) => string | null): this {
    this.customValidators.set(field, validator);
    return this;
  }

  /**
   * Validate form data
   */
  validate(data: any): ValidationResult {
    try {
      // Zod validation
      const zodResult = this.schema.safeParse(data);

      if (!zodResult.success) {
        const errors: ValidationError[] = zodResult.error.issues.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));

        // Add custom validations
        const customErrors = this.runCustomValidators(data);
        errors.push(...customErrors);

        return {
          isValid: false,
          errors,
        };
      }

      // Run custom validators on valid data
      const customErrors = this.runCustomValidators(zodResult.data);

      if (customErrors.length > 0) {
        return {
          isValid: false,
          errors: customErrors,
        };
      }

      return {
        isValid: true,
        errors: [],
        data: zodResult.data,
      };
    } catch (error) {
      logger.error('Form validation error', { error: getErrorMessage(error), data });
      return {
        isValid: false,
        errors: [
          {
            field: 'general',
            message: 'Validation failed due to an unexpected error',
            code: 'VALIDATION_ERROR',
          },
        ],
      };
    }
  }

  private runCustomValidators(data: any): ValidationError[] {
    const errors: ValidationError[] = [];

    for (const [field, validator] of this.customValidators) {
      try {
        const fieldValue = this.getNestedValue(data, field);
        const errorMessage = validator(fieldValue);

        if (errorMessage) {
          errors.push({
            field,
            message: errorMessage,
            code: 'CUSTOM_VALIDATION',
          });
        }
      } catch (error) {
        logger.warn('Custom validator error', { field, error: getErrorMessage(error) });
      }
    }

    return errors;
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }
}

// Common validation schemas
export const commonSchemas = {
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),

  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),

  projectName: z
    .string()
    .min(1, 'Project name is required')
    .max(100, 'Project name must be less than 100 characters')
    .regex(
      /^[a-zA-Z0-9\s\-_]+$/,
      'Project name can only contain letters, numbers, spaces, hyphens, and underscores'
    ),

  fileName: z
    .string()
    .min(1, 'File name is required')
    .max(255, 'File name must be less than 255 characters')
    .regex(/^[^<>:"/\\|?*]+$/, 'File name contains invalid characters'),

  url: z.string().url('Invalid URL format'),

  phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number format'),

  date: z.string().refine((date: string) => !isNaN(Date.parse(date)), 'Invalid date format'),

  positiveNumber: z.number().positive('Must be a positive number'),

  nonEmptyString: z.string().min(1, 'This field is required'),
};

// Common custom validators
export const customValidators = {
  /**
   * Check if password confirmation matches password
   */
  passwordConfirmation: (password: string) => (confirmPassword: string) => {
    return password === confirmPassword ? null : 'Passwords do not match';
  },

  /**
   * Check if username is available (async)
   */
  usernameAvailable: async (username: string): Promise<string | null> => {
    try {
      // In a real implementation, this would check against a database
      const response = await fetch(
        `/api/users/check-username?username=${encodeURIComponent(username)}`
      );
      const result = await response.json();
      return result.available ? null : 'Username is already taken';
    } catch (error) {
      logger.error('Username availability check failed', {
        error: getErrorMessage(error),
        username,
      });
      return 'Unable to verify username availability';
    }
  },

  /**
   * Check if project name is unique
   */
  projectNameUnique: async (projectName: string): Promise<string | null> => {
    try {
      const response = await fetch(
        `/api/projects/check-name?name=${encodeURIComponent(projectName)}`
      );
      const result = await response.json();
      return result.unique ? null : 'Project name already exists';
    } catch (error) {
      logger.error('Project name uniqueness check failed', {
        error: getErrorMessage(error),
        projectName,
      });
      return 'Unable to verify project name uniqueness';
    }
  },

  /**
   * Check if file name is valid for the current directory
   */
  fileNameValid: async (fileName: string, directory: string = '.'): Promise<string | null> => {
    try {
      const response = await fetch('/api/files/check-name', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName, directory }),
      });
      const result = await response.json();
      return result.valid ? null : result.error || 'Invalid file name';
    } catch (error) {
      logger.error('File name validation failed', {
        error: getErrorMessage(error),
        fileName,
        directory,
      });
      return 'Unable to validate file name';
    }
  },

  /**
   * Check if email is available
   */
  emailAvailable: async (email: string): Promise<string | null> => {
    try {
      const response = await fetch(`/api/users/check-email?email=${encodeURIComponent(email)}`);
      const result = await response.json();
      return result.available ? null : 'Email is already registered';
    } catch (error) {
      logger.error('Email availability check failed', { error: getErrorMessage(error), email });
      return 'Unable to verify email availability';
    }
  },
};

// Form validation hooks for React
export function useFormValidation<T extends Record<string, any>>(
  schema: z.ZodSchema<T>,
  initialData: Partial<T> = {}
) {
  const [data, setData] = React.useState<Partial<T>>(initialData);
  const [errors, setErrors] = React.useState<ValidationError[]>([]);
  const [touched, setTouched] = React.useState<Set<string>>(new Set());
  const [isValidating, setIsValidating] = React.useState(false);

  const validator = React.useMemo(() => new FormValidator(schema), [schema]);

  const validate = React.useCallback(async (): Promise<ValidationResult> => {
    setIsValidating(true);
    try {
      const result = validator.validate(data);
      setErrors(result.errors);
      return result;
    } finally {
      setIsValidating(false);
    }
  }, [validator, data]);

  const validateField = React.useCallback(
    (field: string) => {
      const result = validator.validate(data);
      const fieldErrors = result.errors.filter(error => error.field === field);
      setErrors(prev => prev.filter(error => error.field !== field).concat(fieldErrors));
    },
    [validator, data]
  );

  const setFieldValue = React.useCallback(
    (field: string, value: any) => {
      setData(prev => ({ ...prev, [field]: value }));
      setTouched(prev => new Set(prev).add(field));

      // Validate field after a short delay
      setTimeout(() => validateField(field), 300);
    },
    [validateField]
  );

  const setFieldTouched = React.useCallback(
    (field: string) => {
      setTouched(prev => new Set(prev).add(field));
      validateField(field);
    },
    [validateField]
  );

  const reset = React.useCallback(() => {
    setData(initialData);
    setErrors([]);
    setTouched(new Set());
  }, [initialData]);

  const getFieldError = React.useCallback(
    (field: string): string | undefined => {
      return errors.find(error => error.field === field)?.message;
    },
    [errors]
  );

  const hasFieldError = React.useCallback(
    (field: string): boolean => {
      return errors.some(error => error.field === field);
    },
    [errors]
  );

  const isFieldTouched = React.useCallback(
    (field: string): boolean => {
      return touched.has(field);
    },
    [touched]
  );

  return {
    data,
    errors,
    touched,
    isValidating,
    validate,
    setFieldValue,
    setFieldTouched,
    reset,
    getFieldError,
    hasFieldError,
    isFieldTouched,
    isValid: errors.length === 0,
  };
}

// Import React for hooks
import React from 'react';
