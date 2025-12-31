'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '@/styles/datepicker.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle, Calendar } from 'lucide-react';

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
}

// Form configuration interface
export interface CustomInlineFormConfig<T = any> {
  fields: FormField[];
  onSubmit: (data: T) => Promise<void> | void;
  defaultValues?: Partial<T>;
  className?: string;
  validationSchema?: z.ZodSchema<T>;
}

// Props interface
interface CustomInlineFormProps<T = any> {
  config: CustomInlineFormConfig<T>;
}

export function CustomInlineForm<T = any>({
  config,
}: CustomInlineFormProps<T>) {
  const {
    fields,
    onSubmit,
    defaultValues,
    className = '',
    validationSchema,
  } = config;

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
    });

    return z.object(schemaFields);
  };

  const schema = createValidationSchema();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    getValues,
  } = useForm({
    resolver: zodResolver(schema as any),
    defaultValues: defaultValues as any,
  });

  const watchedValues = watch();

  // Handle form submission
  const handleFormSubmit = async (data: any) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
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
    const fieldValue = watchedValues[conditionalField as keyof any];

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
    const fieldError = errors[field.name as string];
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
      className: `${baseClassName} ${errorClassName} bg-muted border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 rounded-lg px-4 py-3 backdrop-blur-sm`,
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
            className={`${commonProps.className} resize-none min-h-[120px]`}
          />
        );

      case FieldType.SELECT:
        return (
          <Select
            onValueChange={(value) => setValue(field.name as any, value)}
            defaultValue={getValues(field.name as any) || field.defaultValue}
            disabled={field.disabled || isSubmitting}
          >
            <SelectTrigger
              className={`${baseClassName} ${errorClassName} bg-gray-800/50 border-gray-600/50 text-white focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 rounded-lg px-4 py-3 backdrop-blur-sm hover:border-primary/50`}
            >
              <SelectValue
                placeholder={field.placeholder || `Select ${field.label}`}
                className="text-white"
              />
            </SelectTrigger>
            <SelectContent className="bg-card backdrop-blur-xl border border-border rounded-lg shadow-2xl">
              {field.options?.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className="text-foreground hover:bg-muted focus:bg-muted transition-colors duration-200"
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
              {field.label}
            </Label>
          </div>
        );

      case FieldType.SWITCH:
        return (
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg border border-border hover:border-primary/50 transition-all duration-300">
            <Label
              htmlFor={field.name}
              className="text-sm font-medium text-foreground cursor-pointer"
            >
              {field.label}
            </Label>
            <Switch
              id={field.name}
              checked={getValues(field.name as any) || false}
              onCheckedChange={(checked) =>
                setValue(field.name as any, checked as any)
              }
              disabled={field.disabled || isSubmitting}
              className="data-[state=checked]:bg-blue-500"
            />
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
        const dateValue = getValues(field.name as any);
        const formattedDate = dateValue
          ? new Date(dateValue).toLocaleDateString('en-GB')
          : '';
        return (
          <div className="relative z-20 date-field-container">
            <DatePicker
              selected={dateValue ? new Date(dateValue) : null}
              onChange={(date) => setValue(field.name as any, date)}
              dateFormat="dd/MM/yyyy"
              disabled={field.disabled || isSubmitting}
              wrapperClassName="w-full"
              calendarClassName="!bg-card !border-border !text-foreground"
              dayClassName={(date) =>
                '!text-foreground hover:!bg-primary/20 !rounded-lg'
              }
              monthClassName={(date) => '!text-foreground'}
              yearClassName={(date) => '!text-foreground'}
              showPopperArrow={false}
              popperClassName="!z-[9999] !fixed"
              portalId="datepicker-portal"
              withPortal
              customInput={
                <div className="relative w-full">
                  <Input
                    value={formattedDate}
                    placeholder={field.placeholder || 'dd/mm/yyyy'}
                    readOnly
                    disabled={field.disabled || isSubmitting}
                    className={`${baseClassName} ${errorClassName} bg-muted border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 rounded-lg px-4 py-3 backdrop-blur-sm pr-10 cursor-pointer hover:border-primary/50`}
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              }
            />
          </div>
        );

      case FieldType.DATETIME:
        const datetimeValue = getValues(field.name as any);
        const formattedDateTime = datetimeValue
          ? new Date(datetimeValue).toLocaleString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
          : '';
        return (
          <div className="relative z-20 date-field-container">
            <DatePicker
              selected={datetimeValue ? new Date(datetimeValue) : null}
              onChange={(date) => setValue(field.name as any, date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="dd/MM/yyyy HH:mm"
              disabled={field.disabled || isSubmitting}
              wrapperClassName="w-full"
              calendarClassName="!bg-card !border-border !text-foreground"
              dayClassName={() =>
                '!text-foreground hover:!bg-primary/20 !rounded-lg'
              }
              monthClassName={() => '!text-foreground'}
              yearClassName={() => '!text-foreground'}
              showPopperArrow={false}
              popperClassName="!z-[9999] !fixed"
              portalId="datepicker-portal"
              withPortal
              customInput={
                <div className="relative w-full">
                  <Input
                    value={formattedDateTime}
                    placeholder={field.placeholder || 'dd/mm/yyyy hh:mm'}
                    readOnly
                    disabled={field.disabled || isSubmitting}
                    className={`${baseClassName} ${errorClassName} bg-muted border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 rounded-lg px-4 py-3 backdrop-blur-sm pr-10 cursor-pointer hover:border-primary/50`}
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              }
            />
          </div>
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

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative mt-4">
        {fields.map((field) => {
          const fieldError = errors[field.name as string];
          const isVisible = isFieldVisible(field);

          if (!isVisible) return null;

          return (
            <motion.div
              key={field.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className={`group relative z-10 form-field-container ${
                field.gridCols === 1
                  ? 'md:col-span-1 xl:col-span-1'
                  : field.gridCols === 2
                  ? 'md:col-span-2 xl:col-span-2'
                  : field.gridCols === 3
                  ? 'md:col-span-2 xl:col-span-3'
                  : ''
              }`}
            >
              {/* Field container with modern styling */}
              <div className="relative">
                {/* Field label with modern typography */}
                <Label
                  htmlFor={field.name}
                  className="block text-xs font-semibold text-foreground mb-3 tracking-wide uppercase"
                >
                  <span className="text-foreground">{field.label}</span>
                  {field.required && (
                    <span className="text-destructive ml-2 text-lg">*</span>
                  )}
                </Label>

                {/* Field input with enhanced styling */}
                <div className="relative">
                  {renderField(field)}

                  {/* Focus ring effect */}
                  <div className="absolute inset-0 rounded-lg ring-2 ring-transparent group-focus-within:ring-primary/50 transition-all duration-300 pointer-events-none" />
                </div>

                {/* Field description with modern styling */}
                {field.description && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-2 text-xs text-muted-foreground leading-relaxed bg-muted rounded-lg p-2 border-l-2 border-primary/30"
                  >
                    {field.description}
                  </motion.p>
                )}

                {/* Error message with modern styling */}
                {fieldError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 flex items-center gap-2 text-destructive text-xs bg-destructive/10 border border-destructive/30 rounded-lg p-2"
                  >
                    <AlertCircle className="h-3 w-3 flex-shrink-0" />
                    <span className="font-medium">
                      {fieldError.message as string}
                    </span>
                  </motion.div>
                )}

                {/* Subtle glow effect on hover */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </form>
  );
}
