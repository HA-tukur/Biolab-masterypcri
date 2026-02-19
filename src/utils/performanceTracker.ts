export interface UserPerformance {
  hasCorrectProtK: boolean;
  hasUsedLN2: boolean;
  hasAddedEthanol: boolean;
  hasPerformedDrySpin: boolean;
  isSafetyCompliant: boolean;
  hasCorrectLysisVolume: boolean;
  hasCorrectBindingVolume: boolean;
  hasCorrectElutionVolume: boolean;
  hasWarmedElution: boolean;
  hasClarifiedLysate: boolean;
}

export interface ProtocolComparison {
  phase: string;
  idealProtocol: string;
  yourAction: string;
  impact: string;
  severity: 'good' | 'warning' | 'error';
}

export interface DiagnosticInsight {
  type: 'contamination' | 'ethanol' | 'yield' | 'safety' | 'general';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
}

export interface EnhancedResult {
  yield: number;
  concentration: number;
  a260_280: number;
  a260_230: number;
  status: 'mastery' | 'technical_success' | 'optimization_required' | 'critical_failure';
  comparisons: ProtocolComparison[];
  insights: DiagnosticInsight[];
  masteryBadge: {
    earned: boolean;
    technicalSuccess: boolean;
    protocolPrecision: boolean;
    safetyExcellence: boolean;
    blockReason?: string;
  };
}

export function calculateEnhancedResults(
  performance: UserPerformance,
  stepVolumes: {
    protK: number;
    lysis: number;
    binding: number;
    ethanol: number;
    wash: number;
    elution: number;
  },
  missionId: string,
  sampleMass: number,
  elutionWarmed: boolean,
  hasSafetyEquipment: { goggles: boolean; gloves: boolean; labCoat: boolean },
  hasClarifiedLysate: boolean
): EnhancedResult {
  let yield_ug = 0;
  let concentration = 0;
  let a260_280 = 1.88;
  let a260_230 = 2.2;
  const comparisons: ProtocolComparison[] = [];
  const insights: DiagnosticInsight[] = [];

  const isMissionA = missionId === 'A';
  const idealVolumes = isMissionA
    ? { protK: 20, lysis: 200, binding: 200, ethanol: 200, elution: 50 }
    : { lysis: 500, binding: 500, ethanol: 500, elution: 20 };

  const isSafetyCompliant = hasSafetyEquipment.goggles && hasSafetyEquipment.gloves && hasSafetyEquipment.labCoat;

  if (!performance.hasAddedEthanol) {
    yield_ug = 0;
    concentration = 0;
    a260_280 = 0;
    a260_230 = 0;

    insights.push({
      type: 'ethanol',
      title: 'Zero Yield Detected',
      message: 'Ethanol is the "glue" for silica binding. Without it, your DNA was lost in the flow-through. Ethanol creates the ionic conditions necessary for DNA to bind to the silica membrane.',
      severity: 'error'
    });

    comparisons.push({
      phase: 'Binding Preparation',
      idealProtocol: `Add ${idealVolumes.ethanol}µL ethanol`,
      yourAction: 'Ethanol not added',
      impact: 'DNA lost - Cannot bind to column',
      severity: 'error'
    });

    return {
      yield: 0,
      concentration: 0,
      a260_280: 0,
      a260_230: 0,
      status: 'critical_failure',
      comparisons,
      insights,
      masteryBadge: {
        earned: false,
        technicalSuccess: false,
        protocolPrecision: false,
        safetyExcellence: isSafetyCompliant
      }
    };
  }

  const yieldMultiplier = isMissionA ? 0.4 : 0.18;
  let yieldPenalty = 1.0;

  if (isMissionA && !performance.hasCorrectProtK) {
    yieldPenalty *= 0.2;
    insights.push({
      type: 'yield',
      title: 'Low Yield - Incomplete Digestion',
      message: 'Proteinase K at 20µL is required to fully digest protein-DNA complexes in tissue samples. Insufficient enzyme means DNA remains trapped in undigested proteins, dramatically reducing yield.',
      severity: 'warning'
    });

    comparisons.push({
      phase: 'Lysis & Protein Digestion',
      idealProtocol: `Add ${idealVolumes.protK}µL Proteinase K`,
      yourAction: stepVolumes.protK > 0 ? `Added ${stepVolumes.protK}µL Proteinase K` : 'Proteinase K not added',
      impact: 'DNA trapped in proteins (80% yield loss)',
      severity: 'error'
    });
  }

  if (missionId === 'B' && !performance.hasUsedLN2) {
    yieldPenalty *= 0.3;
    insights.push({
      type: 'yield',
      title: 'Plant Tissue Disruption Incomplete',
      message: 'Liquid nitrogen flash-freezing is essential for plant tissue. It makes tough cellulose walls brittle and prevents phenolic oxidation that degrades DNA. Without LN₂, cell walls remain intact.',
      severity: 'warning'
    });

    comparisons.push({
      phase: 'Sample Disruption',
      idealProtocol: 'Grind with liquid nitrogen',
      yourAction: 'Manual grinding without LN₂',
      impact: 'Incomplete cell lysis (70% yield loss)',
      severity: 'error'
    });
  }

  if (!performance.hasPerformedDrySpin) {
    yieldPenalty *= 0.6;
    a260_230 = 0.5;

    insights.push({
      type: 'ethanol',
      title: 'Ethanol Contamination Detected',
      message: 'A260/A230 is very low. This is a classic sign of residual ethanol. The 2-minute dry spin is not optional - it removes ethanol that would otherwise contaminate your sample and inhibit downstream reactions.',
      severity: 'error'
    });

    comparisons.push({
      phase: 'Wash & Dry',
      idealProtocol: '2-minute dry spin (empty column)',
      yourAction: 'Dry spin skipped',
      impact: 'Ethanol contamination (40% yield loss, A260/A230 = 0.5)',
      severity: 'error'
    });
  }

  if (!hasClarifiedLysate) {
    a260_280 -= 0.3;
    insights.push({
      type: 'contamination',
      title: 'Protein Contamination Present',
      message: 'A260/A280 is below 1.7. This suggests protein carryover. Ensure you clarify the lysate and transfer only the clear liquid (supernatant) to the column. The pellet contains cell debris and proteins.',
      severity: 'warning'
    });

    comparisons.push({
      phase: 'Clarification',
      idealProtocol: 'Transfer clear supernatant only',
      yourAction: 'Pellet may have been disturbed',
      impact: 'Protein contamination (A260/A280 reduced)',
      severity: 'warning'
    });
  }

  if (missionId === 'B' && !elutionWarmed) {
    yieldPenalty *= 0.85;
    insights.push({
      type: 'yield',
      title: 'Elution Efficiency Reduced',
      message: 'Warming elution buffer to 56°C increases DNA release from the silica membrane by ~15%. For plant samples with complex polysaccharides, this step significantly improves yield.',
      severity: 'info'
    });

    comparisons.push({
      phase: 'Elution',
      idealProtocol: 'Warm elution buffer to 56°C',
      yourAction: 'Elution at room temperature',
      impact: 'Reduced elution efficiency (15% yield loss)',
      severity: 'warning'
    });
  }

  yield_ug = sampleMass * yieldMultiplier * yieldPenalty;
  concentration = (yield_ug * 1000) / stepVolumes.elution;

  const volumeAccuracy = Math.abs(stepVolumes.lysis - idealVolumes.lysis) <= 50 &&
                          Math.abs(stepVolumes.binding - idealVolumes.binding) <= 50 &&
                          Math.abs(stepVolumes.ethanol - idealVolumes.ethanol) <= 50;

  if (isMissionA) {
    comparisons.push({
      phase: 'Lysis & Protein Digestion',
      idealProtocol: `${idealVolumes.protK}µL Proteinase K + ${idealVolumes.lysis}µL Lysis Buffer`,
      yourAction: `${stepVolumes.protK}µL Proteinase K + ${stepVolumes.lysis}µL Lysis Buffer`,
      impact: stepVolumes.protK === idealVolumes.protK && Math.abs(stepVolumes.lysis - idealVolumes.lysis) <= 50 ? 'Optimal protocol' : 'Suboptimal volumes',
      severity: stepVolumes.protK === idealVolumes.protK && Math.abs(stepVolumes.lysis - idealVolumes.lysis) <= 50 ? 'good' : 'warning'
    });
  }

  comparisons.push({
    phase: 'Binding Preparation',
    idealProtocol: `${idealVolumes.binding}µL Binding Buffer + ${idealVolumes.ethanol}µL Ethanol`,
    yourAction: `${stepVolumes.binding}µL Binding Buffer + ${stepVolumes.ethanol}µL Ethanol`,
    impact: Math.abs(stepVolumes.binding - idealVolumes.binding) <= 50 && Math.abs(stepVolumes.ethanol - idealVolumes.ethanol) <= 50 ? 'Optimal protocol' : 'Volume deviation',
    severity: Math.abs(stepVolumes.binding - idealVolumes.binding) <= 50 && Math.abs(stepVolumes.ethanol - idealVolumes.ethanol) <= 50 ? 'good' : 'warning'
  });

  comparisons.push({
    phase: 'Elution',
    idealProtocol: `${idealVolumes.elution}µL${missionId === 'B' ? ' at 56°C' : ''}`,
    yourAction: `${stepVolumes.elution}µL${missionId === 'B' ? (elutionWarmed ? ' at 56°C' : ' at room temp') : ''}`,
    impact: Math.abs(stepVolumes.elution - idealVolumes.elution) <= 10 && (missionId === 'A' || elutionWarmed) ? 'Optimal protocol' : 'Suboptimal conditions',
    severity: Math.abs(stepVolumes.elution - idealVolumes.elution) <= 10 && (missionId === 'A' || elutionWarmed) ? 'good' : 'warning'
  });

  const technicalSuccess = concentration >= 200 && a260_280 >= 1.7;
  const protocolPrecision = volumeAccuracy &&
                            (isMissionA ? performance.hasCorrectProtK : performance.hasUsedLN2) &&
                            performance.hasPerformedDrySpin;
  const safetyExcellence = isSafetyCompliant;

  let status: 'mastery' | 'technical_success' | 'optimization_required' | 'critical_failure' = 'optimization_required';
  let masteryEarned = false;
  let blockReason: string | undefined;

  if (technicalSuccess && protocolPrecision && safetyExcellence) {
    status = 'mastery';
    masteryEarned = true;
  } else if (technicalSuccess && protocolPrecision && !safetyExcellence) {
    status = 'technical_success';
    blockReason = 'Safety protocol violated (Goggles/Gloves/Lab Coat missing). Mastery requires both precision and protection.';
    insights.push({
      type: 'safety',
      title: 'Technical Success, but Safety Breach',
      message: 'You successfully extracted DNA, but safety protocol was violated. In a real laboratory, working without proper PPE would result in immediate dismissal from the bench. Mastery requires both technical precision and safety compliance.',
      severity: 'warning'
    });
  } else if (technicalSuccess) {
    status = 'technical_success';
    blockReason = 'Protocol deviations detected. Review the timeline analysis for optimization opportunities.';
  } else if (concentration > 0) {
    status = 'optimization_required';
    insights.push({
      type: 'general',
      title: 'Researcher Insight',
      message: 'DNA was recovered, but yield or purity is below research-grade standards. Review the timeline analysis to identify where protocol precision can be improved. Every step matters.',
      severity: 'info'
    });
  } else {
    status = 'critical_failure';
  }

  return {
    yield: yield_ug,
    concentration,
    a260_280,
    a260_230,
    status,
    comparisons,
    insights,
    masteryBadge: {
      earned: masteryEarned,
      technicalSuccess,
      protocolPrecision,
      safetyExcellence,
      blockReason
    }
  };
}
