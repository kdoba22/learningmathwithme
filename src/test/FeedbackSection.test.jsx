import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FeedbackSection from '../components/FeedbackSection';

const problem = { a: 5, b: 3, answer: 8 };
const formatProblem = (p) => `${p.a} + ${p.b}`;
const formatAnswer = (p) => `${p.answer}`;

describe('FeedbackSection', () => {
  it('renders nothing when feedback is null', () => {
    const { container } = render(
      <FeedbackSection feedback={null} problem={problem}
        formatProblem={formatProblem} formatAnswer={formatAnswer}
        onNext={vi.fn()} onTryAgain={vi.fn()} onPeek={vi.fn()} isLast={false} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('shows correct feedback with answer', () => {
    render(
      <FeedbackSection feedback="correct" problem={problem}
        formatProblem={formatProblem} formatAnswer={formatAnswer}
        onNext={vi.fn()} onTryAgain={vi.fn()} onPeek={vi.fn()} isLast={false} />
    );
    expect(screen.getByText(/Correct/i)).toBeInTheDocument();
    expect(screen.getByText(/5 \+ 3/)).toBeInTheDocument();
    expect(screen.getByText(/Next/i)).toBeInTheDocument();
  });

  it('shows See Results on last problem when correct', () => {
    render(
      <FeedbackSection feedback="correct" problem={problem}
        formatProblem={formatProblem} formatAnswer={formatAnswer}
        onNext={vi.fn()} onTryAgain={vi.fn()} onPeek={vi.fn()} isLast={true} />
    );
    expect(screen.getByText(/See Results/i)).toBeInTheDocument();
  });

  it('shows wrong feedback with Try Again and Peek buttons', () => {
    render(
      <FeedbackSection feedback="wrong" problem={problem}
        formatProblem={formatProblem} formatAnswer={formatAnswer}
        onNext={vi.fn()} onTryAgain={vi.fn()} onPeek={vi.fn()} isLast={false} />
    );
    expect(screen.getByText(/Not quite/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Peek at Answer/i })).toBeInTheDocument();
  });

  it('shows peeked feedback with answer', () => {
    render(
      <FeedbackSection feedback="peeked" problem={problem}
        formatProblem={formatProblem} formatAnswer={formatAnswer}
        onNext={vi.fn()} onTryAgain={vi.fn()} onPeek={vi.fn()} isLast={false} />
    );
    expect(screen.getByText(/The answer is/i)).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText(/Marked as incorrect/i)).toBeInTheDocument();
  });

  it('calls onTryAgain when Try Again is clicked', async () => {
    const onTryAgain = vi.fn();
    render(
      <FeedbackSection feedback="wrong" problem={problem}
        formatProblem={formatProblem} formatAnswer={formatAnswer}
        onNext={vi.fn()} onTryAgain={onTryAgain} onPeek={vi.fn()} isLast={false} />
    );
    await userEvent.click(screen.getByRole('button', { name: /Try Again/i }));
    expect(onTryAgain).toHaveBeenCalledTimes(1);
  });

  it('calls onPeek when Peek at Answer is clicked', async () => {
    const onPeek = vi.fn();
    render(
      <FeedbackSection feedback="wrong" problem={problem}
        formatProblem={formatProblem} formatAnswer={formatAnswer}
        onNext={vi.fn()} onTryAgain={vi.fn()} onPeek={onPeek} isLast={false} />
    );
    await userEvent.click(screen.getByText(/Peek at Answer/i));
    expect(onPeek).toHaveBeenCalledTimes(1);
  });
});
