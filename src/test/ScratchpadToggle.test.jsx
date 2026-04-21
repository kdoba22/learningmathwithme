import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ScratchpadToggle from '../components/ScratchpadToggle';

describe('ScratchpadToggle', () => {
  it('shows Hide Scratchpad when hidden is false', () => {
    render(<ScratchpadToggle hidden={false} onChange={vi.fn()} />);
    expect(screen.getByText(/Hide Scratchpad/i)).toBeInTheDocument();
  });

  it('shows Show Scratchpad when hidden is true', () => {
    render(<ScratchpadToggle hidden={true} onChange={vi.fn()} />);
    expect(screen.getByText(/Show Scratchpad/i)).toBeInTheDocument();
  });

  it('checkbox is unchecked when hidden is false', () => {
    render(<ScratchpadToggle hidden={false} onChange={vi.fn()} />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('checkbox is checked when hidden is true', () => {
    render(<ScratchpadToggle hidden={true} onChange={vi.fn()} />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('calls onChange with true when checkbox is clicked while unchecked', async () => {
    const onChange = vi.fn();
    render(<ScratchpadToggle hidden={false} onChange={onChange} />);
    await userEvent.click(screen.getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('calls onChange with false when checkbox is clicked while checked', async () => {
    const onChange = vi.fn();
    render(<ScratchpadToggle hidden={true} onChange={onChange} />);
    await userEvent.click(screen.getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledWith(false);
  });
});
