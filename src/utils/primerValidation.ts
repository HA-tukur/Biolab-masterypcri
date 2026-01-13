export interface PrimerValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface PrimerPair {
  forward: string;
  reverse: string;
}

const calculateGCContent = (sequence: string): number => {
  const gcCount = (sequence.match(/[GC]/gi) || []).length;
  return (gcCount / sequence.length) * 100;
};

const calculateTm = (sequence: string): number => {
  const aCount = (sequence.match(/A/gi) || []).length;
  const tCount = (sequence.match(/T/gi) || []).length;
  const gCount = (sequence.match(/G/gi) || []).length;
  const cCount = (sequence.match(/C/gi) || []).length;

  if (sequence.length < 14) {
    return 2 * (aCount + tCount) + 4 * (gCount + cCount);
  }

  return 64.9 + 41 * (gCount + cCount - 16.4) / (aCount + tCount + gCount + cCount);
};

export const validatePrimerPair = (primers: PrimerPair): PrimerValidationResult => {
  const errors: string[] = [];
  const forward = primers.forward.toUpperCase();
  const reverse = primers.reverse.toUpperCase();

  if (!forward || !reverse) {
    errors.push("Both forward and reverse primers are required");
    return { isValid: false, errors };
  }

  const validCharsRegex = /^[ATCG]+$/;
  if (!validCharsRegex.test(forward)) {
    errors.push("Forward primer contains invalid characters. Only A, T, C, G are allowed");
  }
  if (!validCharsRegex.test(reverse)) {
    errors.push("Reverse primer contains invalid characters. Only A, T, C, G are allowed");
  }

  if (forward.length < 18 || forward.length > 30) {
    errors.push(`Forward primer length (${forward.length} bp) is outside the acceptable range (18-30 bp)`);
  }
  if (reverse.length < 18 || reverse.length > 30) {
    errors.push(`Reverse primer length (${reverse.length} bp) is outside the acceptable range (18-30 bp)`);
  }

  if (validCharsRegex.test(forward)) {
    const forwardGC = calculateGCContent(forward);
    if (forwardGC < 40 || forwardGC > 60) {
      errors.push(`Forward primer GC content (${forwardGC.toFixed(1)}%) is outside the acceptable range (40-60%)`);
    }
  }

  if (validCharsRegex.test(reverse)) {
    const reverseGC = calculateGCContent(reverse);
    if (reverseGC < 40 || reverseGC > 60) {
      errors.push(`Reverse primer GC content (${reverseGC.toFixed(1)}%) is outside the acceptable range (40-60%)`);
    }
  }

  if (validCharsRegex.test(forward) && validCharsRegex.test(reverse) && forward.length >= 18 && reverse.length >= 18) {
    const forwardTm = calculateTm(forward);
    const reverseTm = calculateTm(reverse);
    const tmDifference = Math.abs(forwardTm - reverseTm);

    if (tmDifference > 5) {
      errors.push(`Tm difference (${tmDifference.toFixed(1)}°C) exceeds 5°C. Forward Tm: ${forwardTm.toFixed(1)}°C, Reverse Tm: ${reverseTm.toFixed(1)}°C`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
