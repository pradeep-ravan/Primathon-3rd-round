'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Loader2, Save, X, RefreshCw } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

// Field types enum
export enum FieldType {
  TEXT = 'text',
  EMAIL = 'email',
  PASSWORD = 'password',
  NUMBER = 'number',
  TEXTAREA = 'textarea',
  SELECT = 'select',
  MULTISELECT = 'multiselect',
  CHECKBOX = 'checkbox',
  SWITCH = 'switch',
  RADIO = 'radio',
  DATE = 'date',
  DATETIME = 'datetime',
  TIME = 'time',
  URL = 'url',
  TEL = 'tel',
  FILE = 'file',
  ALIAS_WITH_DOMAIN = 'alias_with_domain',
  PASSWORD_WITH_GENERATE = 'password_with_generate',
}

// Field configuration interface
export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: Array<{ value: string; label: string; disabled?: boolean }>;
  validation?: {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: any) => string | boolean;
  };
  defaultValue?: any;
  description?: string;
  className?: string;
  gridCols?: number; // For responsive grid layout
  conditional?: {
    field: string;
    value: any;
    operator?: 'equals' | 'not_equals' | 'contains' | 'not_contains';
  };
  // Custom props for alias with domain
  domainOptions?: Array<{ value: string; label: string }>;
  domainFieldName?: string; // Field name for domain selection
  // Custom props for password with generate
  showPasswordConditions?: boolean;
  passwordConditions?: string[];
  // Custom checkbox label
  checkboxLabel?: string;
}

// Form configuration interface
export interface CustomAddFormConfig<T = any> {
  title: string;
  description?: string;
  fields: FormField[];
  submitText?: string;
  cancelText?: string;
  onSubmit: (data: T) => Promise<void> | void;
  onCancel: () => void;
  isLoading?: boolean;
  validationSchema?: z.ZodSchema<any>;
  defaultValues?: Partial<T>;
  className?: string;
  showHeader?: boolean;
  showActions?: boolean;
  submitButtonVariant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  submitButtonIcon?: React.ReactNode;
  cancelButtonVariant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
}

// Props interface
interface CustomAddFormProps<T = any> {
  config: CustomAddFormConfig<T>;
  item?: T; // For edit mode
}

export function CustomAddForm<T = any>({
  config,
  item,
}: CustomAddFormProps<T>) {
  const {
    title,
    description,
    fields,
    submitText = 'Save',
    cancelText = 'Cancel',
    onSubmit,
    onCancel,
    isLoading = false,
    validationSchema,
    defaultValues,
    className = '',
    showHeader = true,
    showActions = true,
    submitButtonVariant = 'default',
    submitButtonIcon = <Save className="h-4 w-4" />,
    cancelButtonVariant = 'outline',
  } = config;

  // Track which password fields have been generated (to show them as text instead of masked)
  const generatedPasswordFields = React.useRef<Set<string>>(new Set());

  // Create dynamic validation schema if not provided
  const createValidationSchema = () => {
    if (validationSchema) return validationSchema;

    const schemaFields: Record<string, any> = {};

    fields.forEach((field) => {
      let fieldSchema: any = z.any();

      switch (field.type) {
        case FieldType.EMAIL:
          fieldSchema = z.string().email('Invalid email address');
          break;
        case FieldType.PASSWORD:
        case FieldType.PASSWORD_WITH_GENERATE:
          fieldSchema = z.string();
          break;
        case FieldType.NUMBER:
          fieldSchema = z.number();
          break;
        case FieldType.URL:
          fieldSchema = z.string().url('Invalid URL');
          break;
        case FieldType.TEL:
          fieldSchema = z
            .string()
            .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number');
          break;
        case FieldType.CHECKBOX:
          fieldSchema = z.boolean();
          break;
        default:
          fieldSchema = z.string();
      }

      if (field.required) {
        fieldSchema = fieldSchema.min(1, `${field.label} is required`);
      }

      if (field.validation?.minLength) {
        fieldSchema = fieldSchema.min(
          field.validation.minLength,
          `Minimum ${field.validation.minLength} characters`
        );
      }

      if (field.validation?.maxLength) {
        fieldSchema = fieldSchema.max(
          field.validation.maxLength,
          `Maximum ${field.validation.maxLength} characters`
        );
      }

      if (field.validation?.min) {
        fieldSchema = fieldSchema.min(
          field.validation.min,
          `Minimum value is ${field.validation.min}`
        );
      }

      if (field.validation?.max) {
        fieldSchema = fieldSchema.max(
          field.validation.max,
          `Maximum value is ${field.validation.max}`
        );
      }

      if (field.validation?.pattern) {
        fieldSchema = fieldSchema.regex(
          field.validation.pattern,
          'Invalid format'
        );
      }

      if (!field.required) {
        fieldSchema = fieldSchema.optional();
      }

      schemaFields[field.name] = fieldSchema;

      // Add domain field to schema if it's an alias_with_domain field
      if (field.type === FieldType.ALIAS_WITH_DOMAIN && field.domainFieldName) {
        schemaFields[field.domainFieldName] = z.string().optional();
      }
    });

    return z.object(schemaFields);
  };

  const schema = createValidationSchema();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
    getValues,
  } = useForm({
    resolver: zodResolver(schema as any),
    defaultValues: {
      ...defaultValues,
      ...item,
    } as any,
  });


  const watchedValues = watch();

  // Handle form submission
  const handleFormSubmit = async (data: T) => {
    try {
      await onSubmit(data);
    } catch (error) {
      // Extract meaningful error message
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === 'object' && error !== null && 'message' in error
          ? (error as any).message
          : String(error);

      toast.error(`Failed to submit form: ${errorMessage}`, {
        duration: 4000,
      });
    }
  };

  // Check if field should be visible based on conditional logic
  const isFieldVisible = (field: FormField): boolean => {
    if (!field.conditional) return true;

    const {
      field: conditionalField,
      value: conditionalValue,
      operator = 'equals',
    } = field.conditional;
    const fieldValue = watchedValues[conditionalField as keyof T];

    switch (operator) {
      case 'equals':
        return fieldValue === conditionalValue;
      case 'not_equals':
        return fieldValue !== conditionalValue;
      case 'contains':
        return String(fieldValue).includes(String(conditionalValue));
      case 'not_contains':
        return !String(fieldValue).includes(String(conditionalValue));
      default:
        return true;
    }
  };

  // Render field based on type
  const renderField = (field: FormField) => {
    const fieldError = errors[field.name as keyof T];
    const isVisible = isFieldVisible(field);

    if (!isVisible) return null;

    const baseClassName = `w-full ${field.className || ''}`;
    const errorClassName = fieldError
      ? 'border-destructive focus:border-destructive'
      : '';

    const commonProps = {
      id: field.name,
      placeholder: field.placeholder,
      disabled: field.disabled || isSubmitting,
      className: `${baseClassName} ${errorClassName}`,
    };

    switch (field.type) {
      case FieldType.TEXT:
      case FieldType.EMAIL:
      case FieldType.PASSWORD:
      case FieldType.URL:
      case FieldType.TEL:
        return (
          <Input
            {...commonProps}
            type={field.type}
            {...register(field.name as any)}
          />
        );

      case FieldType.NUMBER:
        return (
          <Input
            {...commonProps}
            type="number"
            {...register(field.name as any, { valueAsNumber: true })}
            min={field.validation?.min}
            max={field.validation?.max}
          />
        );

      case FieldType.TEXTAREA:
        return (
          <Textarea
            {...commonProps}
            rows={4}
            {...register(field.name as any)}
          />
        );

      case FieldType.SELECT:
        return (
          <Select
            onValueChange={(value) => setValue(field.name as any, value as any)}
            defaultValue={getValues(field.name as any) || field.defaultValue}
            disabled={field.disabled || isSubmitting}
          >
            <SelectTrigger className={`${baseClassName} ${errorClassName}`}>
              <SelectValue
                placeholder={field.placeholder || `Select ${field.label}`}
              />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case FieldType.CHECKBOX:
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.name}
              checked={getValues(field.name as any) || false}
              onCheckedChange={(checked) =>
                setValue(field.name as any, checked as any)
              }
              disabled={field.disabled || isSubmitting}
            />
            <Label htmlFor={field.name} className="text-sm font-medium">
              {field.checkboxLabel || field.label}
            </Label>
          </div>
        );

      case FieldType.ALIAS_WITH_DOMAIN:
        const domainFieldName = field.domainFieldName || `${field.name}_domain`;
        const domainValue = getValues(domainFieldName as any) || field.domainOptions?.[0]?.value || '';
        
        return (
          <div className="flex gap-2">
            <Input
              {...commonProps}
              type="text"
              {...register(field.name as any)}
              className={`${baseClassName} ${errorClassName} flex-1`}
            />
            <div className="flex items-center gap-2 px-3 bg-muted border border-border rounded-md">
              <span className="text-sm text-muted-foreground">@</span>
              {field.domainOptions && field.domainOptions.length > 0 ? (
                <Select
                  value={domainValue || field.domainOptions[0]?.value || ''}
                  onValueChange={(value) => {
                    setValue(domainFieldName as any, value as any, { shouldValidate: true });
                  }}
                  disabled={field.disabled || isSubmitting}
                >
                  <SelectTrigger className="w-[200px] h-10 bg-transparent border-0 shadow-none focus:ring-0 focus:ring-offset-0 data-[state=open]:ring-0">
                    <SelectValue placeholder="Select domain" />
                  </SelectTrigger>
                  <SelectContent className="z-[9999]">
                    {field.domainOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="w-[200px] h-10 bg-muted border-0 rounded-md flex items-center px-3 text-sm text-muted-foreground">
                  Loading domains...
                </div>
              )}
            </div>
          </div>
        );

      case FieldType.PASSWORD_WITH_GENERATE:
        // Password generation function
        const generatePassword = (): string => {
          const length = 12;
          const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
          let password = "";
          password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
          password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
          password += "0123456789"[Math.floor(Math.random() * 10)];
          for (let i = password.length; i < length; i++) {
            password += charset[Math.floor(Math.random() * charset.length)];
          }
          return password.split("").sort(() => Math.random() - 0.5).join("");
        };

        const isPasswordGenerated = generatedPasswordFields.current.has(field.name);

        const handleGeneratePassword = () => {
          const generatedPassword = generatePassword();
          setValue(field.name as any, generatedPassword);
          generatedPasswordFields.current.add(field.name);
        };

        return (
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                {...commonProps}
                type="text"
                {...register(field.name as any)}
                onChange={(e) => {
                  // If user clears the field, remove from generated set
                  if (!e.target.value) {
                    generatedPasswordFields.current.delete(field.name);
                  }
                  // Call the register onChange to maintain form state
                  register(field.name as any).onChange(e);
                }}
                className={`${baseClassName} ${errorClassName} flex-1`}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleGeneratePassword}
                disabled={field.disabled || isSubmitting}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate
              </Button>
            </div>
            {field.showPasswordConditions && field.passwordConditions && (
              <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                {field.passwordConditions.map((condition, index) => (
                  <p key={index}>{condition}</p>
                ))}
              </div>
            )}
          </div>
        );

      case FieldType.SWITCH:
        return (
          <div className="flex items-center space-x-2">
            <Switch
              id={field.name}
              checked={getValues(field.name as any) || false}
              onCheckedChange={(checked) =>
                setValue(field.name as any, checked as any)
              }
              disabled={field.disabled || isSubmitting}
            />
            <Label htmlFor={field.name} className="text-sm font-medium">
              {field.label}
            </Label>
          </div>
        );

      case FieldType.RADIO:
        return (
          <RadioGroup
            value={getValues(field.name as any) || field.defaultValue}
            onValueChange={(value) => setValue(field.name as any, value as any)}
            disabled={field.disabled || isSubmitting}
            className="flex flex-col space-y-2"
          >
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option.value}
                  id={`${field.name}-${option.value}`}
                  disabled={option.disabled}
                />
                <Label
                  htmlFor={`${field.name}-${option.value}`}
                  className="text-sm"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case FieldType.DATE:
        return (
          <Input
            {...commonProps}
            type="date"
            {...register(field.name as any)}
          />
        );

      case FieldType.DATETIME:
        return (
          <Input
            {...commonProps}
            type="datetime-local"
            {...register(field.name as any)}
          />
        );

      case FieldType.TIME:
        return (
          <Input
            {...commonProps}
            type="time"
            {...register(field.name as any)}
          />
        );

      case FieldType.FILE:
        return (
          <Input
            {...commonProps}
            type="file"
            {...register(field.name as any)}
            accept={field.validation?.pattern?.source}
          />
        );

      default:
        return (
          <Input
            {...commonProps}
            type="text"
            {...register(field.name as any)}
          />
        );
    }
  };

  // Portal state for client-side rendering
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  const modalContent = (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]"
        onClick={onCancel}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Card
            className={`w-full max-w-2xl bg-card/95 backdrop-blur-xl border border-border ${className}`}
          >
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              {/* Header */}
              {showHeader && (
                <div className="p-6 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">
                        {title}
                      </h2>
                      {description && (
                        <p className="text-muted-foreground mt-1">
                          {description}
                        </p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={onCancel}
                      disabled={isSubmitting}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Form Fields */}
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {fields.map((field) => {
                    const fieldError = errors[field.name as keyof T];
                    const isVisible = isFieldVisible(field);

                    if (!isVisible) return null;

                    return (
                      <div
                        key={field.name}
                        className={`space-y-2 ${
                          field.gridCols === 1
                            ? 'md:col-span-1'
                            : field.gridCols === 2
                            ? 'md:col-span-2'
                            : ''
                        }`}
                      >
                        <Label
                          htmlFor={field.name}
                          className="text-sm font-medium text-foreground"
                        >
                          {field.label}
                          {field.required && (
                            <span className="text-destructive ml-1">*</span>
                          )}
                        </Label>

                        {renderField(field)}

                        {field.description && field.type !== FieldType.PASSWORD_WITH_GENERATE && (
                          <p className="text-xs text-muted-foreground">
                            {field.description}
                          </p>
                        )}

                        {fieldError && (
                          <div className="flex items-center gap-2 text-destructive text-sm">
                            <AlertCircle className="h-4 w-4" />
                            <span>{fieldError.message as string}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              {showActions && (
                <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
                  <Button
                    type="button"
                    variant={cancelButtonVariant}
                    onClick={onCancel}
                    disabled={isSubmitting}
                  >
                    {cancelText}
                  </Button>
                  <Button
                    type="submit"
                    variant={submitButtonVariant}
                    disabled={isSubmitting}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        {submitButtonIcon}
                        <span className="ml-2">{submitText}</span>
                      </>
                    )}
                  </Button>
                </div>
              )}
            </form>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
