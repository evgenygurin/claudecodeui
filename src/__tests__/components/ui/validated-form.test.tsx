/**
 * Validated Form Component Tests
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { z } from 'zod';
import {
  ValidatedForm,
  ValidatedInput,
  ValidatedTextarea,
  ValidatedSelect,
} from '@/components/ui/validated-form';
import { commonSchemas } from '@/utils/form-validation';

// Mock the logger
jest.mock('@/utils/logger', () => ({
  logger: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

describe('ValidatedForm', () => {
  const testSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: commonSchemas.email,
    age: z.number().min(18, 'Must be at least 18').optional(),
  });

  it('should render form with children', () => {
    render(
      <ValidatedForm schema={testSchema} onSubmit={jest.fn()}>
        <div>Test Form</div>
      </ValidatedForm>
    );

    expect(screen.getByText('Test Form')).toBeInTheDocument();
  });

  it('should validate form on submit', async () => {
    const onSubmit = jest.fn();

    render(
      <ValidatedForm schema={testSchema} onSubmit={onSubmit}>
        <ValidatedInput name="name" />
        <ValidatedInput name="email" />
        <button type="submit">Submit</button>
      </ValidatedForm>
    );

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  it('should call onSubmit with valid data', async () => {
    const onSubmit = jest.fn();

    render(
      <ValidatedForm schema={testSchema} onSubmit={onSubmit}>
        <ValidatedInput name="name" data-testid="name-input" />
        <ValidatedInput name="email" data-testid="email-input" />
        <button type="submit">Submit</button>
      </ValidatedForm>
    );

    const nameInput = screen.getByTestId('name-input');
    const emailInput = screen.getByTestId('email-input');
    const submitButton = screen.getByRole('button', { name: 'Submit' });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        age: undefined,
      });
    });
  });
});

describe('ValidatedInput', () => {
  const testSchema = z.object({
    testField: z.string().min(1, 'Field is required'),
  });

  it('should render input with label', () => {
    render(
      <ValidatedForm schema={testSchema} onSubmit={jest.fn()}>
        <ValidatedInput name="testField" label="Test Label" />
      </ValidatedForm>
    );

    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
  });

  it('should show validation error', async () => {
    const onSubmit = jest.fn();
    render(
      <ValidatedForm schema={testSchema} onSubmit={onSubmit}>
        <ValidatedInput name="testField" />
        <button type="submit">Submit</button>
      </ValidatedForm>
    );

    const input = screen.getByRole('textbox');
    const submitButton = screen.getByRole('button');
    
    // Try triggering validation by submitting the form
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // Check if validation error appears after form submission
    await waitFor(() => {
      expect(screen.getByText('Required')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('should show helper text when no error', () => {
    render(
      <ValidatedForm schema={testSchema} onSubmit={jest.fn()}>
        <ValidatedInput name="name" helperText="This is helper text" />
      </ValidatedForm>
    );

    expect(screen.getByText('This is helper text')).toBeInTheDocument();
  });

  it('should update value on change', () => {
    render(
      <ValidatedForm schema={testSchema} onSubmit={jest.fn()}>
        <ValidatedInput name="testField" />
      </ValidatedForm>
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test value' } });

    expect(input).toHaveValue('test value');
  });
});

describe('ValidatedTextarea', () => {
  const testSchema = z.object({
    description: z.string().min(10, 'Description must be at least 10 characters'),
  });

  it('should render textarea', () => {
    render(
      <ValidatedForm schema={testSchema} onSubmit={jest.fn()}>
        <ValidatedTextarea name="description" />
      </ValidatedForm>
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should show validation error for short text', async () => {
    render(
      <ValidatedForm schema={testSchema} onSubmit={jest.fn()}>
        <ValidatedTextarea name="description" />
      </ValidatedForm>
    );

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'short' } });
    fireEvent.blur(textarea);

    await waitFor(() => {
      expect(screen.getByText('Description must be at least 10 characters')).toBeInTheDocument();
    });
  });
});

describe('ValidatedSelect', () => {
  const testSchema = z.object({
    category: z.string().min(1, 'Please select a category'),
  });

  const options = [
    { value: 'tech', label: 'Technology' },
    { value: 'business', label: 'Business' },
    { value: 'design', label: 'Design' },
  ];

  it('should render select with options', () => {
    render(
      <ValidatedForm schema={testSchema} onSubmit={jest.fn()}>
        <ValidatedSelect name="category" options={options} />
      </ValidatedForm>
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Technology')).toBeInTheDocument();
    expect(screen.getByText('Business')).toBeInTheDocument();
    expect(screen.getByText('Design')).toBeInTheDocument();
  });

  it('should show validation error when no option selected', async () => {
    render(
      <ValidatedForm schema={testSchema} onSubmit={jest.fn()}>
        <ValidatedSelect name="category" options={options} />
      </ValidatedForm>
    );

    const select = screen.getByRole('combobox');
    fireEvent.blur(select);

    await waitFor(() => {
      expect(screen.getByText('Please select a category')).toBeInTheDocument();
    });
  });

  it('should update value on selection', () => {
    render(
      <ValidatedForm schema={testSchema} onSubmit={jest.fn()}>
        <ValidatedSelect name="category" options={options} />
      </ValidatedForm>
    );

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'tech' } });

    expect(select).toHaveValue('tech');
  });
});
