import type { Readable, Writable } from 'svelte/store';
import { writable, derived, get } from 'svelte/store';
import { z } from 'zod';
import type { FormState, FormContext, UseFormOptions, FormErrors } from './base';
import { mapValidationErrors } from './base';

export interface FormStore<T> extends Readable<FormContext<T>> {
	updateField: (field: keyof T, value: any) => void;
	setTouched: (field: keyof T) => void;
	reset: () => void;
	submit: (e: Event) => Promise<void>;
	updateState: (updates: Partial<FormState<T>>) => void;
}

export type SubmissionError<T> = {
	formErrors?: string[];
	fieldErrors?: FormErrors<T>;
};

function createFormStore<T extends Record<string, any>>(options: UseFormOptions<T>): FormStore<T> {
	const { initialData, schema, onSubmit } = options;

	// Internal state
	const state = writable<FormState<T>>({
		data: { ...initialData },
		errors: {},
		touched: new Set(),
		isSubmitting: false,
		isValid: true
	});

	// Helper to update state
	function updateState(updates: Partial<FormState<T>>) {
		state.update((s) => ({ ...s, ...updates }));
	}

	// Validate data against schema
	function validate(data: T): FormErrors<T> {
		if (!schema) return {};
		try {
			schema.parse(data);
			return {};
		} catch (error) {
			if (error instanceof z.ZodError) {
				return mapValidationErrors<T>(error);
			}
			return {};
		}
	}

	// Update a field value
	function updateField(field: keyof T, value: any) {
		state.update((s) => {
			const newData = { ...s.data, [field]: value };
			const errors = validate(newData);
			return {
				...s,
				data: newData,
				errors,
				isValid: Object.keys(errors).length === 0
			};
		});
	}

	// Mark a field as touched
	function setTouched(field: keyof T) {
		state.update((s) => {
			const touched = new Set(s.touched);
			touched.add(field);
			return { ...s, touched };
		});
	}

	// Reset form to initial state
	function reset() {
		state.set({
			data: { ...initialData },
			errors: {},
			touched: new Set(),
			isSubmitting: false,
			isValid: true
		});
	}

	// Handle form submission
	async function submit(e: Event) {
		e.preventDefault();

		// Mark all fields as touched
		state.update((s) => ({
			...s,
			touched: new Set(Object.keys(s.data))
		}));

		// Get current state
		const currentState = get(state);

		// Validate form
		const errors = validate(currentState.data);
		updateState({ errors, isValid: Object.keys(errors).length === 0 });

		// If invalid, stop here
		if (Object.keys(errors).length > 0) {
			return;
		}

		// If no submit handler, stop here
		if (!onSubmit) {
			return;
		}

		try {
			updateState({ isSubmitting: true });
			await onSubmit(currentState.data);
		} catch (error) {
			console.error('Form submission error:', error);
			if (error instanceof z.ZodError) {
				updateState({ errors: mapValidationErrors<T>(error) });
			} else if (error && typeof error === 'object' && 'fieldErrors' in error) {
				const submissionError = error as SubmissionError<T>;
				updateState({
					errors: {
						...submissionError.fieldErrors,
						...(submissionError.formErrors?.length
							? { _form: submissionError.formErrors.join('. ') }
							: {})
					} as FormErrors<T>
				});
			} else {
				updateState({
					errors: {
						_form: error instanceof Error ? error.message : 'Form submission failed'
					} as FormErrors<T>
				});
			}
		} finally {
			updateState({ isSubmitting: false });
		}
	}

	// Create derived store with form context
	const formContext = derived<Writable<FormState<T>>, FormContext<T>>(state, ($state, set) => {
		set({
			...$state,
			updateField,
			setTouched,
			validate: () => {
				const errors = validate($state.data);
				updateState({ errors, isValid: Object.keys(errors).length === 0 });
				return Object.keys(errors).length === 0;
			},
			reset,
			handleSubmit: submit
		});
	});

	return {
		subscribe: formContext.subscribe,
		updateField,
		setTouched,
		reset,
		submit,
		updateState
	};
}

export { createFormStore };
