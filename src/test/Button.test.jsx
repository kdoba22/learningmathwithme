import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../components/Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('applies primary variant class by default', () => {
    render(<Button>Test</Button>);
    expect(screen.getByText('Test')).toHaveClass('btn-primary');
  });

  it('applies secondary variant class', () => {
    render(<Button variant="secondary">Test</Button>);
    expect(screen.getByText('Test')).toHaveClass('btn-secondary');
  });

  it('applies danger variant class', () => {
    render(<Button variant="danger">Test</Button>);
    expect(screen.getByText('Test')).toHaveClass('btn-danger');
  });

  it('applies outline variant class', () => {
    render(<Button variant="outline">Test</Button>);
    expect(screen.getByText('Test')).toHaveClass('btn-outline');
  });

  it('applies ghost variant class', () => {
    render(<Button variant="ghost">Test</Button>);
    expect(screen.getByText('Test')).toHaveClass('btn-ghost');
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    await userEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is passed', () => {
    render(<Button disabled>Test</Button>);
    expect(screen.getByText('Test')).toBeDisabled();
  });

  it('does not call onClick when disabled', async () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Test</Button>);
    await userEvent.click(screen.getByText('Test'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
