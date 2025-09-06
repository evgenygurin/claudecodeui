'use client';

import { getErrorMessage } from '@/utils/error-handler';

import React, { createContext, useContext, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useFormValidation, ValidationError } from '@/utils/form-validation';
import { z } from 'zod';

interface FormContextType {
  getFieldError: (field: string) => string | undefined;
  hasFieldError: (field: string) => boolean;
  isFieldTouched: (field: string) => boolean;
  setFieldValue: (field: string, value: any) => void;
  setFieldTouched: (field: string) => void;
  isValidating: boolean;
  isValid: boolean;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export function useFormField() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormField must be used within a ValidatedForm');
  }
  return context;
}

interface ValidatedFormProps<T extends Record<string, any>> {
  schema: z.ZodSchema<T>;
  initialData?: Partial<T>;
  onSubmit: (data: T) => void | Promise<void>;
  children: React.ReactNode;
  className?: string;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export function ValidatedForm<T extends Record<string, any>>({
  schema,
  initialData = {},
  onSubmit,
  children,
  className,
  validateOnChange = true,
  validateOnBlur = true,
}: ValidatedFormProps<T>) {
  const {
    data,
    errors,
    touched,
    isValidating,
    validate,
    setFieldValue,
    setFieldTouched,
    getFieldError,
    hasFieldError,
    isFieldTouched,
    isValid,
  } = useFormValidation(schema, initialData);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await validate();
    if (result.isValid && result.data) {
      await onSubmit(result.data);
    }
  }, [validate, onSubmit]);

  const contextValue: FormContextType = {
    getFieldError,
    hasFieldError,
    isFieldTouched,
    setFieldValue,
    setFieldTouched,
    isValidating,
    isValid,
  };

  return (
    <FormContext.Provider value={contextValue}>
      <form onSubmit={handleSubmit} className={cn('space-y-4', className)}>
        {children}
      </form>
    </FormContext.Provider>
  );
}

interface ValidatedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onBlur'> {
  name: string;
  label?: string;
  helperText?: string;
  showError?: boolean;
}

export function ValidatedInput({
  name,
  label,
  helperText,
  showError = true,
  className,
  ...props
}: ValidatedInputProps) {
  const { getFieldError, hasFieldError, isFieldTouched, setFieldValue, setFieldTouched } = useFormField();
  
  const error = getFieldError(name);
  const hasError = hasFieldError(name);
  const isTouched = isFieldTouched(name);
  const showFieldError = showError && hasError && isTouched;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFieldValue(name, e.target.value);
  };

  const handleBlur = () => {
    setFieldTouched(name);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={name} className="text-sm font-medium">
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        onChange={handleChange}
        onBlur={handleBlur}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          hasError && isTouched && 'border-red-500 focus-visible:ring-red-500',
          className
        )}
        {...props}
      />
      {showFieldError && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      {helperText && !showFieldError && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}

interface ValidatedTextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'onBlur'> {
  name: string;
  label?: string;
  helperText?: string;
  showError?: boolean;
}

export function ValidatedTextarea({
  name,
  label,
  helperText,
  showError = true,
  className,
  ...props
}: ValidatedTextareaProps) {
  const { getFieldError, hasFieldError, isFieldTouched, setFieldValue, setFieldTouched } = useFormField();
  
  const error = getFieldError(name);
  const hasError = hasFieldError(name);
  const isTouched = isFieldTouched(name);
  const showFieldError = showError && hasError && isTouched;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFieldValue(name, e.target.value);
  };

  const handleBlur = () => {
    setFieldTouched(name);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={name} className="text-sm font-medium">
          {label}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        onChange={handleChange}
        onBlur={handleBlur}
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          hasError && isTouched && 'border-red-500 focus-visible:ring-red-500',
          className
        )}
        {...props}
      />
      {showFieldError && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      {helperText && !showFieldError && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}

interface ValidatedSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'onBlur'> {
  name: string;
  label?: string;
  helperText?: string;
  showError?: boolean;
  options: { value: string; label: string }[];
}

export function ValidatedSelect({
  name,
  label,
  helperText,
  showError = true,
  options,
  className,
  ...props
}: ValidatedSelectProps) {
  const { getFieldError, hasFieldError, isFieldTouched, setFieldValue, setFieldTouched } = useFormField();
  
  const error = getFieldError(name);
  const hasError = hasFieldError(name);
  const isTouched = isFieldTouched(name);
  const showFieldError = showError && hasError && isTouched;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFieldValue(name, e.target.value);
  };

  const handleBlur = () => {
    setFieldTouched(name);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={name} className="text-sm font-medium">
          {label}
        </label>
      )}
      <select
        id={name}
        name={name}
        onChange={handleChange}
        onBlur={handleBlur}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          hasError && isTouched && 'border-red-500 focus-visible:ring-red-500',
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {showFieldError && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      {helperText && !showFieldError && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}

interface FormErrorSummaryProps {
  errors: ValidationError[];
  className?: string;
}

export function FormErrorSummary({ errors, className }: FormErrorSummaryProps) {
  if (errors.length === 0) return null;

  return (
    <div className={cn('rounded-md bg-red-50 p-4', className)}>
      <div className="flex">
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            Please correct the following errors:
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <ul className="list-disc pl-5 space-y-1">
              {errors.map((error, index) => (
                <li key={index}>
                  <strong>{error.field}:</strong> {getErrorMessage(error)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
