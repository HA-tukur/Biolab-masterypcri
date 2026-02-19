export interface ProtocolAction {
  timestamp: number;
  stepIndex: number;
  stepName: string;
  action: 'add_reagent' | 'mix' | 'incubate' | 'spin' | 'dry_spin' | 'transfer' | 'grind' | 'prewarm_buffer' | 'vortex';
  reagentId?: string;
  volume?: number;
  temperature?: number;
  duration?: number;
  details?: any;
}

export interface SafetyEvent {
  timestamp: number;
  stepIndex: number;
  stepName: string;
  violation: 'no_gloves' | 'no_goggles_ln2' | 'unsafe_handling';
  details?: string;
}

export class ProtocolTracker {
  private protocolLog: ProtocolAction[] = [];
  private safetyLog: SafetyEvent[] = [];

  logAction(action: ProtocolAction) {
    this.protocolLog.push({
      ...action,
      timestamp: Date.now()
    });
  }

  logSafetyViolation(violation: SafetyEvent) {
    this.safetyLog.push({
      ...violation,
      timestamp: Date.now()
    });
  }

  getProtocolLog(): ProtocolAction[] {
    return [...this.protocolLog];
  }

  getSafetyLog(): SafetyEvent[] {
    return [...this.safetyLog];
  }

  reset() {
    this.protocolLog = [];
    this.safetyLog = [];
  }

  wasReagentAdded(reagentId: string): boolean {
    return this.protocolLog.some(
      entry => entry.action === 'add_reagent' && entry.reagentId === reagentId
    );
  }

  getReagentVolume(reagentId: string): number {
    return this.protocolLog
      .filter(entry => entry.action === 'add_reagent' && entry.reagentId === reagentId)
      .reduce((sum, entry) => sum + (entry.volume || 0), 0);
  }

  wasActionPerformed(action: ProtocolAction['action'], stepIndex?: number): boolean {
    if (stepIndex !== undefined) {
      return this.protocolLog.some(
        entry => entry.action === action && entry.stepIndex === stepIndex
      );
    }
    return this.protocolLog.some(entry => entry.action === action);
  }

  getWashCount(): number {
    return this.protocolLog.filter(
      entry => entry.action === 'add_reagent' && entry.reagentId === 'wash'
    ).length;
  }

  hasSafetyViolation(type: SafetyEvent['violation']): boolean {
    return this.safetyLog.some(entry => entry.violation === type);
  }

  exportSummary() {
    return {
      protocolActions: this.protocolLog.length,
      safetyViolations: this.safetyLog.length,
      timeline: this.protocolLog.map(p => ({
        step: p.stepName,
        action: p.action,
        time: new Date(p.timestamp).toISOString()
      }))
    };
  }
}
