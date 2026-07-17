import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StackedProblem from '../components/StackedProblem';

describe('StackedProblem', () => {
  it('renders the top number', () => {
    render(<StackedProblem topNumber="10" bottomNumber="5" operator="+" />);
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('renders the bottom number', () => {
    render(<StackedProblem topNumber="10" bottomNumber="5" operator="+" />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders the operator', () => {
    render(<StackedProblem topNumber="10" bottomNumber="5" operator="+" />);
    expect(screen.getByText('+')).toBeInTheDocument();
  });

  it('renders a subtraction operator', () => {
    render(<StackedProblem topNumber="10" bottomNumber="5" operator="−" />);
    expect(screen.getByText('−')).toBeInTheDocument();
  });

  it('renders the answerInput slot', () => {
    render(
      <StackedProblem
        topNumber="10"
        bottomNumber="5"
        operator="+"
        answerInput={<input aria-label="Your answer" />}
      />
    );
    expect(screen.getByLabelText('Your answer')).toBeInTheDocument();
  });

  it('renders the feedback slot when provided', () => {
    render(
      <StackedProblem
        topNumber="10"
        bottomNumber="5"
        operator="+"
        feedback={<p>Great job!</p>}
      />
    );
    expect(screen.getByText('Great job!')).toBeInTheDocument();
  });

  it('does not render feedback slot when not provided', () => {
    const { container } = render(
      <StackedProblem topNumber="10" bottomNumber="5" operator="+" />
    );
    expect(container.querySelector('.stacked-feedback')).not.toBeInTheDocument();
  });

  it('renders decimal numbers correctly', () => {
    render(<StackedProblem topNumber="3.7" bottomNumber="1.2" operator="+" />);
    expect(screen.getByText('3.7')).toBeInTheDocument();
    expect(screen.getByText('1.2')).toBeInTheDocument();
  });
});
