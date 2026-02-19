export interface ProtocolDeviation {
  type: 'missing_reagent' | 'wrong_volume' | 'skipped_step' | 'wrong_order' | 'safety_violation' | 'insufficient_mixing' | 'insufficient_incubation';
  step: string;
  severity: 'critical' | 'major' | 'minor';
  description: string;
  scientificImpact: string;
  masteryAdvice: string;
}

export interface SafetyViolation {
  type: 'no_gloves' | 'no_goggles' | 'no_ln2_protection' | 'unsafe_handling';
  step: string;
  description: string;
  professionalImpact: string;
}

export interface LabResult {
  concentration: number;
  ratio260_280: number;
  ratio260_230: number;
  gelQuality: 'excellent' | 'good' | 'degraded' | 'none';
  yieldMicrograms: number;
}

export interface MasteryReport {
  technicalGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  safetyGrade: 'pass' | 'warning' | 'fail';
  masteryAchieved: boolean;
  resultSummary: string;
  deviations: ProtocolDeviation[];
  safetyViolations: SafetyViolation[];
  diagnosticFeedback: string[];
  recommendations: string[];
}

export function analyzeProtocolExecution(
  stepLog: any[],
  safetyLog: any[],
  finalResult: LabResult | null,
  missionId: string
): MasteryReport {
  const deviations: ProtocolDeviation[] = [];
  const safetyViolations: SafetyViolation[] = [];
  const diagnosticFeedback: string[] = [];
  const recommendations: string[] = [];

  let ethanolAdded = false;
  let proteinaseKAdded = false;
  let lysisBufferAdded = false;
  let bindingBufferAdded = false;
  let washCount = 0;
  let drySpinPerformed = false;
  let drySpinDuration = 0;
  let mixingPerformed = false;
  let incubationPerformed = false;
  let glovesWorn = true;
  let gogglesWorn = true;
  let ln2SafetyChecked = true;
  let bufferPreWarmed = false;

  for (const entry of stepLog) {
    if (entry.action === 'add_reagent') {
      if (entry.reagentId === 'ethanol') ethanolAdded = true;
      if (entry.reagentId === 'proteinase_k') proteinaseKAdded = true;
      if (entry.reagentId === 'lysis') lysisBufferAdded = true;
      if (entry.reagentId === 'binding') bindingBufferAdded = true;
      if (entry.reagentId === 'wash') washCount++;
    }
    if (entry.action === 'mix') mixingPerformed = true;
    if (entry.action === 'incubate') incubationPerformed = true;
    if (entry.action === 'dry_spin') {
      drySpinPerformed = true;
      drySpinDuration = entry.duration || 0;
    }
    if (entry.action === 'prewarm_buffer') bufferPreWarmed = true;
  }

  for (const entry of safetyLog) {
    if (entry.violation === 'no_gloves') {
      glovesWorn = false;
      safetyViolations.push({
        type: 'no_gloves',
        step: entry.step,
        description: 'Handled samples without gloves',
        professionalImpact: 'Human skin contains DNases that degrade DNA. This is a professional hygiene violation.'
      });
    }
    if (entry.violation === 'no_goggles_ln2') {
      gogglesWorn = false;
      safetyViolations.push({
        type: 'no_goggles',
        step: entry.step,
        description: 'Handled liquid nitrogen without safety goggles',
        professionalImpact: 'Cryogenic splashes can cause severe eye damage. In a professional setting, this is a critical safety violation.'
      });
    }
  }

  if (!ethanolAdded && bindingBufferAdded) {
    deviations.push({
      type: 'missing_reagent',
      step: 'Binding Preparation',
      severity: 'critical',
      description: 'Ethanol not added',
      scientificImpact: 'DNA cannot bind to silica membrane without ethanol. Sample was lost during centrifugation.',
      masteryAdvice: 'Ethanol is REQUIRED for DNA precipitation onto the membrane. This is the #1 reason for zero yield. Always check: Binding Buffer + Ethanol before loading column.'
    });
  }

  if (!proteinaseKAdded && missionId === 'A') {
    deviations.push({
      type: 'missing_reagent',
      step: 'Lysis & Protein Digestion',
      severity: 'major',
      description: 'Proteinase K not added',
      scientificImpact: 'Proteins remain bound to DNA, causing low purity (A₂₆₀/A₂₈₀ < 1.7).',
      masteryAdvice: 'Proteinase K digests histones and structural proteins. Without it, protein contamination reduces purity and interferes with downstream applications.'
    });
  }

  if (washCount < 2) {
    deviations.push({
      type: 'skipped_step',
      step: 'Wash & Dry',
      severity: 'major',
      description: `Only ${washCount} wash${washCount === 1 ? '' : 'es'} performed instead of 2`,
      scientificImpact: 'Residual salts and proteins remain, lowering purity (A₂₆₀/A₂₃₀ < 1.8).',
      masteryAdvice: 'Two washes ensure maximum purity. The first wash removes chaotropic salts; the second removes residual ethanol. Skipping washes compromises PCR performance.'
    });
  }

  const drySpinDurationMinutes = drySpinDuration / 60;
  const isDrySpinInsufficient = !drySpinPerformed || drySpinDurationMinutes < 2;

  if (isDrySpinInsufficient) {
    deviations.push({
      type: 'skipped_step',
      step: 'Wash & Dry',
      severity: 'critical',
      description: drySpinPerformed
        ? `Dry spin performed for only ${drySpinDurationMinutes.toFixed(1)} minutes (minimum 2 minutes required)`
        : 'Dry spin not performed',
      scientificImpact: 'Residual ethanol inhibits PCR by denaturing polymerase enzyme. A260/A230 ratio falls to 0.5.',
      masteryAdvice: drySpinPerformed
        ? 'The dry spin removes ALL ethanol from the column. A minimum of 2 minutes is required for complete ethanol evaporation. Even trace amounts (<1%) can completely inhibit PCR.'
        : 'The dry spin removes ALL ethanol from the column. Even trace amounts (<1%) can completely inhibit PCR. Never skip this step!'
    });
  }

  if (missionId === 'B' && !bufferPreWarmed) {
    deviations.push({
      type: 'skipped_step',
      step: 'Elution',
      severity: 'major',
      description: 'Elution buffer not pre-warmed',
      scientificImpact: 'Plant DNA is very long and binds tightly to silica. Yield reduced by 15-20%.',
      masteryAdvice: 'For plant extractions, pre-warming to 56°C is REQUIRED. The heat disrupts DNA-silica bonds, releasing more DNA. This can mean the difference between 200 ng/µL and 300+ ng/µL.'
    });
  }

  if (!glovesWorn) {
    diagnosticFeedback.push('⚠️ SAFETY ALERT: Sample handled without gloves. DNA shows signs of degradation (gel smearing). DNases from skin contaminated your sample.');
  }

  if (finalResult) {
    if (finalResult.concentration === 0 && !ethanolAdded) {
      diagnosticFeedback.push('❌ ZERO YIELD: NanoDrop detected no DNA. ROOT CAUSE: Ethanol was not added. Without ethanol, DNA cannot bind to the silica membrane and was lost during the first spin.');
      recommendations.push('Review Step 3 (Binding Preparation). Ethanol is the "molecular glue" that makes DNA stick to the column. This is the most common beginner mistake.');
    } else if (finalResult.concentration === 0) {
      diagnosticFeedback.push('❌ ZERO YIELD: NanoDrop detected no DNA. Possible causes: Incomplete lysis, insufficient starting material, or DNA lost in debris pellet.');
      recommendations.push('Review Steps 1-2. Was tissue fully lysed? Did you transfer supernatant (not pellet)?');
    } else if (finalResult.concentration < 50) {
      diagnosticFeedback.push('⚠️ LOW YIELD: DNA concentration is below optimal range. Yield could be improved.');
      if (!bufferPreWarmed && missionId === 'B') {
        recommendations.push('For plant DNA, pre-warm elution buffer to 56°C to increase yield by 15-20%.');
      }
      recommendations.push('Consider: More starting material, longer incubation, or check if pellet was accidentally transferred.');
    } else if (finalResult.concentration >= 200) {
      diagnosticFeedback.push('✅ EXCELLENT YIELD: DNA concentration is in the optimal range for downstream applications.');
    }

    if (finalResult.ratio260_280 < 1.7) {
      diagnosticFeedback.push('⚠️ PROTEIN CONTAMINATION: A₂₆₀/A₂₈₀ ratio is low, indicating protein contamination.');
      if (!proteinaseKAdded) {
        recommendations.push('ROOT CAUSE: Proteinase K was not added. Proteins remain bound to DNA. Next time, ensure both Lysis Buffer AND Proteinase K are added in Step 1.');
      } else if (!incubationPerformed) {
        recommendations.push('Insufficient incubation. Extend Proteinase K digestion to 2-3 hours at 56°C for complete protein removal.');
      } else {
        recommendations.push('Consider: Add a third wash step or increase incubation time.');
      }
    } else if (finalResult.ratio260_280 >= 1.8 && finalResult.ratio260_280 <= 2.0) {
      diagnosticFeedback.push('✅ EXCELLENT PURITY: A₂₆₀/A₂₈₀ ratio indicates pure DNA, free from protein contamination.');
    }

    if (finalResult.ratio260_230 < 1.8) {
      diagnosticFeedback.push('⚠️ SALT/SOLVENT CONTAMINATION: A₂₆₀/A₂₃₀ ratio is low, indicating residual salts or ethanol.');
      if (isDrySpinInsufficient) {
        if (!drySpinPerformed) {
          diagnosticFeedback.push('Low Purity Detected: Skipping the Dry Spin leaves residual ethanol on the membrane, which inhibits elution and "poisons" downstream applications like PCR.');
          recommendations.push('ROOT CAUSE: Dry spin was skipped. Ethanol residue remains in your sample. The dry spin is CRITICAL - it removes ALL ethanol.');
        } else {
          diagnosticFeedback.push(`Low Purity Detected: Skipping the Dry Spin leaves residual ethanol on the membrane, which inhibits elution and "poisons" downstream applications like PCR. Your ${drySpinDurationMinutes.toFixed(1)}-minute spin was insufficient.`);
          recommendations.push(`ROOT CAUSE: Dry spin duration was insufficient (${drySpinDurationMinutes.toFixed(1)} minutes). A minimum of 2 minutes is required to remove all ethanol residue.`);
        }
      } else if (washCount < 2) {
        recommendations.push('Insufficient washing. Two washes are required to remove chaotropic salts. You only performed ' + washCount + '.');
      } else {
        recommendations.push('Extend dry spin to 5 minutes at maximum speed to ensure complete ethanol removal.');
      }
    } else if (finalResult.ratio260_230 >= 2.0) {
      diagnosticFeedback.push('✅ EXCELLENT PURITY: A₂₆₀/A₂₃₀ ratio indicates DNA is free from salt and solvent contamination.');
    }

    if (finalResult.gelQuality === 'degraded') {
      diagnosticFeedback.push('⚠️ DNA DEGRADATION: Gel shows smearing instead of a tight band.');
      if (!glovesWorn) {
        recommendations.push('ROOT CAUSE: Samples were handled without gloves. DNases from skin degraded your DNA. Always wear gloves when handling biological samples.');
      } else {
        recommendations.push('Possible causes: Old/degraded starting material, excessive vortexing, or extended room temperature exposure.');
      }
    } else if (finalResult.gelQuality === 'excellent') {
      diagnosticFeedback.push('✅ EXCELLENT INTEGRITY: Gel shows a tight, high-molecular-weight band. DNA is intact and ready for PCR.');
    }
  }

  const technicalGrade = calculateTechnicalGrade(deviations, finalResult);
  const safetyGrade = calculateSafetyGrade(safetyViolations);
  const masteryAchieved = technicalGrade === 'A' && safetyGrade === 'pass' && deviations.length === 0;

  const resultSummary = generateResultSummary(finalResult, deviations, safetyViolations);

  return {
    technicalGrade,
    safetyGrade,
    masteryAchieved,
    resultSummary,
    deviations,
    safetyViolations,
    diagnosticFeedback,
    recommendations
  };
}

function calculateTechnicalGrade(deviations: ProtocolDeviation[], result: LabResult | null): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (!result || result.concentration === 0) return 'F';

  const criticalCount = deviations.filter(d => d.severity === 'critical').length;
  const majorCount = deviations.filter(d => d.severity === 'major').length;

  if (criticalCount > 0) return 'F';
  if (majorCount >= 2) return 'D';
  if (majorCount === 1) return 'C';

  const goodConcentration = result.concentration >= 100 && result.concentration <= 500;
  const goodPurity = result.ratio260_280 >= 1.8 && result.ratio260_280 <= 2.0;
  const goodSaltRemoval = result.ratio260_230 >= 2.0 && result.ratio260_230 <= 2.2;
  const excellentGel = result.gelQuality === 'excellent';

  if (goodConcentration && goodPurity && goodSaltRemoval && excellentGel) return 'A';
  if (goodConcentration && goodPurity) return 'B';
  return 'C';
}

function calculateSafetyGrade(violations: SafetyViolation[]): 'pass' | 'warning' | 'fail' {
  if (violations.length === 0) return 'pass';
  if (violations.some(v => v.type === 'no_goggles')) return 'fail';
  return 'warning';
}

function generateResultSummary(result: LabResult | null, deviations: ProtocolDeviation[], safetyViolations: SafetyViolation[]): string {
  if (!result) return 'Experiment incomplete - no results available.';

  if (result.concentration === 0) {
    const ethanolMissing = deviations.some(d => d.type === 'missing_reagent' && d.description.includes('Ethanol'));
    if (ethanolMissing) {
      return 'Zero DNA recovered. The simulation allowed you to proceed without ethanol, and the consequences are clear: DNA did not bind to the column. This teaches the most important lesson in DNA extraction.';
    }
    return 'Zero DNA recovered. The simulation allowed your protocol to run, but biological reality resulted in no yield. Review your technique.';
  }

  if (result.concentration >= 200 && result.ratio260_280 >= 1.8 && result.ratio260_280 <= 2.0 && result.ratio260_230 >= 2.0) {
    if (safetyViolations.length === 0 && deviations.length === 0) {
      return 'MASTERY ACHIEVED: High-yield, high-purity DNA with perfect safety compliance. You demonstrate professional-level competence.';
    }
    return 'Excellent technical result, but protocol deviations or safety issues prevent full mastery. Review feedback to achieve perfection.';
  }

  return 'DNA recovered, but yield or purity could be improved. The simulation let you make these choices, and your results reflect them. This is how you build mastery.';
}
