# Mastery System Implementation

## Philosophy: Actions Have Consequences

In BioSimLab, the simulation **does not prevent mistakes**. Just like a real lab, you can skip steps, forget reagents, or make errors. The centrifuge will spin whatever you put in it; the pipette will dispense whatever volume you set. The difference is revealed in your final results.

This pedagogical approach teaches students that:
1. **Technical success** requires understanding WHY each step matters
2. **Safety compliance** is a professional standard, not optional
3. **True mastery** means achieving high-yield, high-purity DNA while maintaining perfect safety

## System Components

### 1. Protocol Tracking (`protocolTracker.ts`)
Tracks every action during the simulation:
- Reagent additions (type, volume)
- Mixing and vortexing
- Centrifugation events
- Incubation (temperature, duration)
- Equipment usage

### 2. Safety Tracking
Monitors compliance violations:
- No gloves when handling samples (DNase contamination)
- No goggles when using liquid nitrogen
- Unsafe handling practices

### 3. Results Analysis (`masteryAnalysis.ts`)
Analyzes the complete protocol execution and generates:
- **Technical Grade** (A-F) based on yield, purity, and technique
- **Safety Grade** (Pass/Warning/Fail) based on violations
- **Mastery Status** (achieved only with A + Pass + no deviations)

### 4. Diagnostic Feedback
Provides specific, actionable feedback:
- What went wrong
- Why it matters scientifically
- How to improve next time

## Key Features

### Permissive Flow Logic
The simulation **allows** you to:
- Skip washing steps → Results show contamination
- Forget ethanol → Zero yield (DNA never binds)
- Use wrong volumes → Poor purity ratios
- Skip dry spin → PCR inhibition warning
- Handle samples without gloves → Gel shows degradation

### Result Commentary Matrix
Instead of generic "Mission Failed," students receive:

**Zero Yield + No Ethanol:**
```
❌ ZERO YIELD: NanoDrop detected no DNA.
ROOT CAUSE: Ethanol was not added. Without ethanol, DNA cannot bind
to the silica membrane and was lost during the first spin.

💡 Recommendation: Review Step 3 (Binding Preparation). Ethanol is
the "molecular glue" that makes DNA stick to the column. This is the
most common beginner mistake.
```

**Good Yield + Low Purity:**
```
✅ EXCELLENT YIELD: DNA concentration is in the optimal range.
⚠️ PROTEIN CONTAMINATION: A₂₆₀/A₂₈₀ ratio is low.

ROOT CAUSE: Proteinase K was not added. Proteins remain bound to DNA.
Next time, ensure both Lysis Buffer AND Proteinase K are added in Step 1.
```

### Mastery Badge Criteria
To achieve mastery, students must demonstrate:
1. **Technical Excellence:** A grade (high yield + high purity + intact DNA)
2. **Safety Compliance:** Pass grade (no critical violations)
3. **Perfect Execution:** Zero protocol deviations

## Integration Points

### During Simulation
The app logs actions to `protocolTracker`:
```typescript
protocolTracker.logAction({
  stepIndex: protocolIndex,
  stepName: currentStep.title,
  action: 'add_reagent',
  reagentId: 'ethanol',
  volume: 200
});
```

### At Results Screen
After verification, the system:
1. Creates a `LabResult` object with all measurements
2. Calls `analyzeProtocolExecution()` with protocol log + safety log
3. Generates comprehensive `MasteryReport`
4. Displays detailed feedback via `MasteryResultsPanel`

## Educational Impact

This system teaches students to:
1. **Think critically** about each step's purpose
2. **Understand consequences** of protocol deviations
3. **Build confidence** through realistic practice
4. **Develop mastery** through iterative improvement

The simulation doesn't hold your hand—it lets you make mistakes and learn from the scientific reality of those choices. This is how professionals are built.

## Future Enhancements

Potential additions:
1. More granular safety tracking (pipetting technique, waste disposal)
2. Time-based penalties (leaving samples at room temp too long)
3. Equipment misuse detection (overloading centrifuge, wrong RPM)
4. Contamination cascades (using same pipette tip multiple times)
5. Advanced analytics (common error patterns, improvement tracking)
