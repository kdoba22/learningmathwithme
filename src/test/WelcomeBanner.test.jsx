import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import WelcomeBanner from '../components/WelcomeBanner';

describe('WelcomeBanner', () => {
  it('shows Welcome when done is not passed', () => {
    render(<WelcomeBanner name="Keith" />);
    expect(screen.getByText(/Welcome, Keith/i)).toBeInTheDocument();
  });

  it('shows Great job when done is true', () => {
    render(<WelcomeBanner name="Keith" done />);
    expect(screen.getByText(/Great job, Keith/i)).toBeInTheDocument();
  });

  it('shows Welcome without a name', () => {
    render(<WelcomeBanner />);
    expect(screen.getByText(/Welcome!/i)).toBeInTheDocument();
  });

  it('shows Great job without a name', () => {
    render(<WelcomeBanner done />);
    expect(screen.getByText(/Great job!/i)).toBeInTheDocument();
  });

  it('shows wave emoji when not done', () => {
    render(<WelcomeBanner name="Keith" />);
    expect(screen.getByText(/👋/)).toBeInTheDocument();
  });

  it('shows party emoji when done', () => {
    render(<WelcomeBanner name="Keith" done />);
    expect(screen.getByText(/🎉/)).toBeInTheDocument();
  });
});
