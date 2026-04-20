import { describe, it, expect } from 'vitest';
import { getMaxNumber } from '../utils/mathUtils';

describe('getMaxNumber', () => {
  it('returns 9 for Beginner addition', () => {
    expect(getMaxNumber('Beginner', 'addition')).toBe(9);
  });

  it('returns 20 for Beginner non-addition', () => {
    expect(getMaxNumber('Beginner')).toBe(20);
  });

  it('returns 50 for Intermediate', () => {
    expect(getMaxNumber('Intermediate')).toBe(50);
  });

  it('returns 100 for Advanced', () => {
    expect(getMaxNumber('Advanced')).toBe(100);
  });

  it('returns 250 for Proficient', () => {
    expect(getMaxNumber('Proficient')).toBe(250);
  });

  it('returns 999 for Expert', () => {
    expect(getMaxNumber('Expert')).toBe(999);
  });
});
