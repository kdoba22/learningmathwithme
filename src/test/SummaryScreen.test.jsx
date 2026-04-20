import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SummaryScreen from '../components/SummaryScreen';

describe('SummaryScreen', () => {
  const defaultProps = {
    name: 'Keith',
    score: 8,
    total: 10,
    onPlayAgain: vi.fn(),
    onBack: vi.fn(),
  };

  it('shows score and total', () => {
    render(<SummaryScreen {...defaultProps} />);
    expect(screen.getByText(/8 \/ 10 correct/i)).toBeInTheDocument();
  });

  it('shows percentage', () => {
    render(<SummaryScreen {...defaultProps} />);
    expect(screen.getByText('80%')).toBeInTheDocument();
  });

  it('shows perfect score message at 100%', () => {
    render(<SummaryScreen {...defaultProps} score={10} total={10} />);
    expect(screen.getByText(/Perfect score/i)).toBeInTheDocument();
  });

  it('shows great work message at 80-99%', () => {
    render(<SummaryScreen {...defaultProps} score={9} total={10} />);
    expect(screen.getByText(/Really great work/i)).toBeInTheDocument();
  });

  it('shows good effort message at 60-79%', () => {
    render(<SummaryScreen {...defaultProps} score={7} total={10} />);
    expect(screen.getByText(/Good effort/i)).toBeInTheDocument();
  });

  it('shows keep practicing message below 60%', () => {
    render(<SummaryScreen {...defaultProps} score={5} total={10} />);
    expect(screen.getByText(/Keep practicing/i)).toBeInTheDocument();
  });

  it('shows title when provided', () => {
    render(<SummaryScreen {...defaultProps} title="7's Times Table" />);
    expect(screen.getByText("7's Times Table")).toBeInTheDocument();
  });

  it('calls onPlayAgain when Play Again is clicked', async () => {
    const onPlayAgain = vi.fn();
    render(<SummaryScreen {...defaultProps} onPlayAgain={onPlayAgain} />);
    await userEvent.click(screen.getByText(/Play Again/i));
    expect(onPlayAgain).toHaveBeenCalledTimes(1);
  });

  it('calls onBack when Change Settings is clicked', async () => {
    const onBack = vi.fn();
    render(<SummaryScreen {...defaultProps} onBack={onBack} />);
    await userEvent.click(screen.getByText(/Change Settings/i));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('renders extra actions when provided', () => {
    render(<SummaryScreen {...defaultProps} extraActions={<button>Try Another</button>} />);
    expect(screen.getByText(/Try Another/i)).toBeInTheDocument();
  });
});
