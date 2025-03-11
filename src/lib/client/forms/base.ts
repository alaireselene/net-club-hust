import type { z } from 'zod';

export type FormErrors<T> = Partial<Record<keyof T, string>>;

export interface FormState<T> {
	data: T;
	errors: FormErrors<T>;
	touched: Set<keyof T>;
	isSubmitting: boolean;
	isValid: boolean;
}

export type FormFieldElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

export interface FormContext<T> extends FormState<T> {
	updateField: (field: keyof T, value: any) => void;
	setTouched: (field: keyof T) => void;
	validate: () => boolean;
	reset: () => void;
	handleSubmit: (e: Event) => Promise<void>;
}

export interface UseFormOptions<T> {
	initialData: T;
	schema?: z.ZodSchema<T>;
	onSubmit?: (data: T) => Promise<void>;
}

export function isFormField(element: unknown): element is FormFieldElement {
	return (
		element instanceof HTMLInputElement ||
		element instanceof HTMLTextAreaElement ||
		element instanceof HTMLSelectElement
	);
}

export function getFormFieldValue(element: FormFieldElement): any {
	if (element instanceof HTMLInputElement) {
		if (element.type === 'checkbox') {
			return element.checked;
		}
		if (element.type === 'number') {
			return element.value === '' ? null : Number(element.value);
		}
		if (element.type === 'date' || element.type === 'datetime-local') {
			return element.value === '' ? null : new Date(element.value);
		}
	}
	return element.value;
}

export function setFormFieldValue(element: FormFieldElement, value: any): void {
	if (element instanceof HTMLInputElement) {
		if (element.type === 'checkbox') {
			element.checked = Boolean(value);
			return;
		}
		if (element.type === 'date' && value instanceof Date) {
			element.value = value.toISOString().split('T')[0];
			return;
		}
		if (element.type === 'datetime-local' && value instanceof Date) {
			element.value = value.toISOString().slice(0, 16);
			return;
		}
	}
	element.value = value?.toString() ?? '';
}

export function parseFormData<T extends Record<string, any>>(form: HTMLFormElement): Partial<T> {
	const formData = new FormData(form);
	const data: Record<string, any> = {};

	for (const [key, value] of formData.entries()) {
		const element = form.elements.namedItem(key);
		if (element instanceof RadioNodeList) {
			const selectedRadio = Array.from(element).find(
				(el): el is HTMLInputElement => el instanceof HTMLInputElement && el.checked
			);
			if (selectedRadio) {
				data[key] = getFormFieldValue(selectedRadio);
			}
		} else if (element && isFormField(element)) {
			data[key] = getFormFieldValue(element);
		}
	}

	return data as Partial<T>;
}

// Form validation helpers
export function getValidationMessage(error: z.ZodError): string {
	const { issues } = error;
	if (!issues.length) return 'Validation failed';
	return issues[0].message;
}

export function mapValidationErrors<T>(error: z.ZodError): FormErrors<T> {
	const errors: FormErrors<T> = {};
	for (const issue of error.issues) {
		const path = issue.path[0];
		if (typeof path === 'string' || typeof path === 'number') {
			errors[path as keyof T] = issue.message;
		}
	}
	return errors;
}

// Form field helper types
export interface FieldProps<T> {
	name: keyof T & string;
	label?: string;
	required?: boolean;
	error?: string;
}

export interface SelectFieldProps<T> extends FieldProps<T> {
	options: Array<{
		value: string;
		label: string;
	}>;
	placeholder?: string;
}
