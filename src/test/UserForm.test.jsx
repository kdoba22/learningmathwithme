import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import UserForm from '../components/UserForm';

function renderForm(props = {}) {
  const onStart = props.onStart ?? vi.fn();
  render(<UserForm onStart={onStart} {...props} />);
  return { onStart };
}

describe('UserForm — rendering', () => {
  it('renders the name input', () => {
    renderForm();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  });

  it('renders the experience level selector', () => {
    renderForm();
    expect(screen.getByLabelText(/experience level/i)).toBeInTheDocument();
  });

  it('renders the operation selector', () => {
    renderForm();
    expect(screen.getByLabelText(/operation/i)).toBeInTheDocument();
  });

  it('renders the GO button', () => {
    renderForm();
    expect(screen.getByRole('button', { name: /go/i })).toBeInTheDocument();
  });

  it('pre-populates fields from initialSettings', () => {
    renderForm({
      initialSettings: { name: 'Maya', experience: 'Advanced', operation: 'Division' },
    });
    expect(screen.getByLabelText(/name/i)).toHaveValue('Maya');
    expect(screen.getByLabelText(/experience level/i)).toHaveValue('Advanced');
    expect(screen.getByLabelText(/operation/i)).toHaveValue('Division');
  });
});

describe('UserForm — profanity filter', () => {
  it('shows an error when a bad word is typed', () => {
    renderForm();
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'shit' } });
    expect(screen.getByText(/inappropriate language/i)).toBeInTheDocument();
  });

  it('disables the GO button when a bad word is present', () => {
    renderForm();
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'shit' } });
    expect(screen.getByRole('button', { name: /go/i })).toBeDisabled();
  });

  it('clears the error when the name is changed to a clean value', () => {
    renderForm();
    const input = screen.getByLabelText(/name/i);
    fireEvent.change(input, { target: { value: 'shit' } });
    expect(screen.getByText(/inappropriate language/i)).toBeInTheDocument();
    fireEvent.change(input, { target: { value: 'Jordan' } });
    expect(screen.queryByText(/inappropriate language/i)).not.toBeInTheDocument();
  });

  it('clears the error when the name is cleared entirely', () => {
    renderForm();
    const input = screen.getByLabelText(/name/i);
    fireEvent.change(input, { target: { value: 'shit' } });
    fireEvent.change(input, { target: { value: '' } });
    expect(screen.queryByText(/inappropriate language/i)).not.toBeInTheDocument();
  });

  it('does not show an error for a normal name', () => {
    renderForm();
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Priya' } });
    expect(screen.queryByText(/inappropriate language/i)).not.toBeInTheDocument();
  });

  it('catches common letter substitutions like sh!t', () => {
    renderForm();
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'sh!t' } });
    expect(screen.getByText(/inappropriate language/i)).toBeInTheDocument();
  });
});

describe('UserForm — submission', () => {
  it('calls onStart with the selected settings when GO is clicked', () => {
    const { onStart } = renderForm();
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Maya' } });
    fireEvent.change(screen.getByLabelText(/experience level/i), { target: { value: 'Intermediate' } });
    fireEvent.change(screen.getByLabelText(/operation/i), { target: { value: 'Subtraction' } });
    fireEvent.click(screen.getByRole('button', { name: /go/i }));
    expect(onStart).toHaveBeenCalledWith({
      name: 'Maya',
      experience: 'Intermediate',
      operation: 'Subtraction',
    });
  });

  it('calls onStart with an empty name when name is left blank', () => {
    const { onStart } = renderForm();
    fireEvent.click(screen.getByRole('button', { name: /go/i }));
    expect(onStart).toHaveBeenCalledWith({
      name: '',
      experience: 'Beginner',
      operation: 'Addition',
    });
  });

  it('does not call onStart when a bad word is present', () => {
    const { onStart } = renderForm();
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'shit' } });
    fireEvent.click(screen.getByRole('button', { name: /go/i }));
    expect(onStart).not.toHaveBeenCalled();
  });
});
