import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ComingSoon from '../components/ComingSoon';

describe('ComingSoon', () => {
  it('displays the operation name in the title', () => {
    render(<ComingSoon operation="Decimals" onBack={vi.fn()} />);
    expect(screen.getAllByText('Decimals').length).toBeGreaterThan(0);
  });

  it('displays the operation name in the message body', () => {
    render(<ComingSoon operation="Fractions" onBack={vi.fn()} />);
    expect(screen.getAllByText(/Fractions/i).length).toBeGreaterThan(0);
  });

  it('renders the construction emoji', () => {
    render(<ComingSoon operation="Money" onBack={vi.fn()} />);
    expect(screen.getByText('🚧')).toBeInTheDocument();
  });

  it('renders the Back to Menu button', () => {
    render(<ComingSoon operation="Decimals" onBack={vi.fn()} />);
    expect(screen.getByRole('button', { name: /back to menu/i })).toBeInTheDocument();
  });

  it('calls onBack when the Back to Menu button is clicked', () => {
    const onBack = vi.fn();
    render(<ComingSoon operation="Decimals" onBack={onBack} />);
    fireEvent.click(screen.getByRole('button', { name: /back to menu/i }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('renders a "coming soon" message', () => {
    render(<ComingSoon operation="Decimals" onBack={vi.fn()} />);
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument();
  });
});
