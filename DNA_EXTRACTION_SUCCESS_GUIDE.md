# DNA Extraction Success Guide

## How to Achieve Success in Missions A & B

This guide shows you **exactly** what the system checks to determine success. Follow these steps precisely to see the beautiful DNA curve in your NanoDrop results!

---

## 🎯 Success Criteria Overview

### **MASTERY** (Highest Achievement)
✅ Technical Success (Concentration ≥ 200 ng/µL AND A260/A280 ≥ 1.7)
✅ Protocol Precision (Correct volumes + mission-specific steps + dry spin)
✅ Safety Excellence (Goggles + Gloves + Lab Coat)

### **Technical Success**
✅ Technical Success (Concentration ≥ 200 ng/µL AND A260/A280 ≥ 1.7)
⚠️ Missing protocol precision OR safety compliance

### **Optimization Required**
⚠️ DNA recovered but below research-grade standards (concentration < 200 ng/µL OR purity issues)

### **Critical Failure**
❌ No DNA recovered (usually missing ethanol or other critical step)

---

## 📋 Mission A: Superbug Clinical Diagnostic (Biopsy)

### **CRITICAL STEPS - Skip ANY and you FAIL:**

#### 1. **Safety Equipment (FIRST!)**
- [ ] Put on **Goggles**
- [ ] Put on **Gloves**
- [ ] Put on **Lab Coat**

**WHY:** Without all three, you cannot achieve Mastery. The system checks: `hasSafetyEquipment.goggles && hasSafetyEquipment.gloves && hasSafetyEquipment.labCoat`

---

#### 2. **Lysis & Protein Digestion**
- [ ] Add **EXACTLY 20µL Proteinase K** (critical!)
- [ ] Add **200µL Lysis Buffer** (±50µL tolerance)
- [ ] Incubate at 56°C

**WHY:** Wrong Proteinase K = 80% yield loss. The system checks: `stepVolumes.protK === 20`

**⚠️ FAILURE MODE:** If you skip or use wrong volume of Proteinase K, DNA remains trapped in proteins. You'll get <20% yield.

---

#### 3. **Binding Preparation**
- [ ] Add **200µL Binding Buffer** (±50µL tolerance)
- [ ] Add **EXACTLY 200µL Ethanol** (±50µL tolerance, CRITICAL!)

**WHY:** No ethanol = NO DNA. Period. The system checks: `performance.hasAddedEthanol`

**❌ INSTANT FAILURE:** Skip ethanol and your yield = 0. NanoDrop shows flat red line.

---

#### 4. **Clarification (Critical for Purity!)**
- [ ] Centrifuge the lysate
- [ ] Transfer **ONLY the clear supernatant** to the column
- [ ] DO NOT disturb the pellet

**WHY:** The system checks: `hasClarifiedLysate`. Disturbing the pellet causes protein contamination (A260/A280 drops by 0.3).

---

#### 5. **Column Binding**
- [ ] Transfer mixture to spin column
- [ ] Centrifuge to bind DNA to silica membrane
- [ ] Discard flow-through

---

#### 6. **Wash Steps**
- [ ] Add Wash Buffer
- [ ] Centrifuge
- [ ] Discard flow-through

---

#### 7. **DRY SPIN (MANDATORY!)**
- [ ] Perform dry spin for **MINIMUM 2 minutes**
- [ ] Use empty column (no buffer)

**WHY:** The system checks: `(performance.drySpinDuration || 0) / 60 >= 2`

**⚠️ FAILURE MODE:** Skip this or spin <2 min = 40% yield loss + A260/A230 = 0.5 (ethanol contamination). Your sample becomes unusable for PCR.

---

#### 8. **Elution**
- [ ] Add **50µL Elution Buffer** (±10µL tolerance)
- [ ] Incubate 1 minute
- [ ] Centrifuge to collect purified DNA

**WHY:** Volume affects final concentration calculation: `concentration = (yield_ug * 1000) / stepVolumes.elution`

---

### **Mission A Ideal Volumes:**
```
Proteinase K:    20µL (EXACT)
Lysis Buffer:    200µL (±50µL)
Binding Buffer:  200µL (±50µL)
Ethanol:         200µL (±50µL)
Elution Buffer:  50µL (±10µL)
Dry Spin:        ≥2 minutes (EXACT)
```

---

## 🌿 Mission B: Cassava Pathogen Sequencing (Plant)

### **CRITICAL STEPS - Skip ANY and you FAIL:**

#### 1. **Safety Equipment (FIRST!)**
- [ ] Put on **Goggles**
- [ ] Put on **Gloves**
- [ ] Put on **Lab Coat**

**WHY:** Without all three, you cannot achieve Mastery.

---

#### 2. **Sample Disruption (PLANT-SPECIFIC!)**
- [ ] Use **Liquid Nitrogen (LN₂)** to flash-freeze sample
- [ ] Grind with mortar & pestle while frozen

**WHY:** The system checks: `performance.hasUsedLN2`

**⚠️ FAILURE MODE:** Skip LN₂ = 70% yield loss. Plant cell walls stay intact, DNA remains trapped. The system applies: `yieldPenalty *= 0.3`

---

#### 3. **Lysis**
- [ ] Add **500µL Lysis Buffer** (±50µL tolerance)
- [ ] Vortex mix
- [ ] Incubate at 56°C

---

#### 4. **Binding Preparation**
- [ ] Add **500µL Binding Buffer** (±50µL tolerance)
- [ ] Add **EXACTLY 500µL Ethanol** (±50µL tolerance, CRITICAL!)

**WHY:** No ethanol = NO DNA. The system checks: `performance.hasAddedEthanol`

**❌ INSTANT FAILURE:** Skip ethanol and your yield = 0. NanoDrop shows flat red line.

---

#### 5. **Clarification (Critical for Purity!)**
- [ ] Centrifuge the lysate
- [ ] Transfer **ONLY the clear supernatant** to the column
- [ ] DO NOT disturb the pellet

**WHY:** Plant samples have lots of contaminants. The system checks: `hasClarifiedLysate`.

---

#### 6. **Column Binding**
- [ ] Transfer mixture to spin column
- [ ] Centrifuge to bind DNA to silica membrane
- [ ] Discard flow-through

---

#### 7. **Wash Steps**
- [ ] Add Wash Buffer
- [ ] Centrifuge
- [ ] Discard flow-through

---

#### 8. **DRY SPIN (MANDATORY!)**
- [ ] Perform dry spin for **MINIMUM 2 minutes**
- [ ] Use empty column (no buffer)

**WHY:** The system checks: `(performance.drySpinDuration || 0) / 60 >= 2`

**⚠️ FAILURE MODE:** Skip this or spin <2 min = 40% yield loss + A260/A230 = 0.5 (ethanol contamination).

---

#### 9. **Elution (PLANT-SPECIFIC!)**
- [ ] **WARM elution buffer to 56°C** (critical!)
- [ ] Add **20µL Elution Buffer** (±10µL tolerance)
- [ ] Incubate 1 minute
- [ ] Centrifuge to collect purified DNA

**WHY:** The system checks: `elutionWarmed`

**⚠️ PERFORMANCE MODE:** Skip warming = 15% yield loss. Plant polysaccharides require heat for optimal elution: `yieldPenalty *= 0.85`

---

### **Mission B Ideal Volumes:**
```
Lysis Buffer:    500µL (±50µL)
Binding Buffer:  500µL (±50µL)
Ethanol:         500µL (±50µL)
Elution Buffer:  20µL at 56°C (±10µL)
Dry Spin:        ≥2 minutes (EXACT)
Liquid Nitrogen: REQUIRED
```

---

## 🔬 How the System Calculates Your Results

### **Base Yield Formula:**
```javascript
// Mission A (biopsy): 0.4 µg per mg of tissue
// Mission B (plant):  0.18 µg per mg of tissue
yield_ug = sampleMass * yieldMultiplier * yieldPenalty
```

### **Concentration Formula:**
```javascript
concentration = (yield_ug * 1000) / stepVolumes.elution
```

### **Target Values:**
- **Concentration:** ≥ 200 ng/µL (for technical success)
- **A260/A280:** ≥ 1.7 (for technical success)
- **A260/A230:** Should be > 2.0 (dry spin ensures this)

---

## 🎨 NanoDrop Graph Logic

### **Protocol Followed Successfully (`hasDNA = true`):**
- Shows beautiful **teal curve** with characteristic 260nm peak
- Uses authentic wavelength calculation (220-350nm)
- Curve shape reflects DNA, protein, salt, and scattering components
- **Line weight:** 1.5px for professional instrument look

### **Protocol Violated (`hasDNA = false`):**
- Shows **flat red line** with slight noise
- Indicates failed extraction
- Triggers when: `finalConc <= 0`

**The key trigger:**
```javascript
hasDNA={finalConc > 0}
```

If your final concentration is 0 (usually from missing ethanol), you get the flat line.

---

## 🚨 Common Failure Modes

### **1. Flat Red Line (Zero Yield)**
**Cause:** Missing ethanol
**Fix:** Always add ethanol in Binding Preparation step

### **2. Very Low Yield (<40 ng/µL)**
**Causes:**
- Mission A: Missing/wrong Proteinase K volume
- Mission B: Not using Liquid Nitrogen
- Any mission: Skipping or insufficient dry spin (<2 min)

### **3. Low A260/A280 (<1.7)**
**Cause:** Protein contamination from disturbing the pellet
**Fix:** Only transfer clear supernatant during clarification

### **4. Low A260/A230 (<2.0)**
**Cause:** Residual ethanol from insufficient dry spin
**Fix:** Perform full 2-minute dry spin

### **5. Technical Success but No Mastery**
**Cause:** Missing safety equipment (goggles, gloves, or lab coat)
**Fix:** Put on ALL safety equipment before starting

---

## ✅ Quick Checklist for MASTERY

### Before You Start:
- [ ] Goggles ON
- [ ] Gloves ON
- [ ] Lab Coat ON

### Mission A Critical Steps:
- [ ] 20µL Proteinase K (exact)
- [ ] 200µL Ethanol (±50µL)
- [ ] Transfer clear supernatant only
- [ ] 2-minute dry spin (minimum)

### Mission B Critical Steps:
- [ ] Use Liquid Nitrogen
- [ ] 500µL Ethanol (±50µL)
- [ ] Transfer clear supernatant only
- [ ] 2-minute dry spin (minimum)
- [ ] Warm elution buffer to 56°C

### All volumes within tolerance:
- [ ] Lysis: ±50µL of ideal
- [ ] Binding: ±50µL of ideal
- [ ] Ethanol: ±50µL of ideal
- [ ] Elution: ±10µL of ideal

---

## 🎯 Expected Results for Perfect Protocol

### Mission A (Biopsy):
- **Yield:** 8-16 µg (for 20-40mg tissue)
- **Concentration:** 320-640 ng/µL (with 50µL elution)
- **A260/A280:** 1.88
- **A260/A230:** 2.2
- **Status:** MASTERY

### Mission B (Plant):
- **Yield:** 4.5-9 µg (for 25-50mg tissue)
- **Concentration:** 225-450 ng/µL (with 20µL elution)
- **A260/A280:** 1.88
- **A260/A230:** 2.2
- **Status:** MASTERY

---

## 🔑 Key Takeaway

The system is checking for **real laboratory best practices**:
1. Safety first (PPE)
2. Correct reagent volumes
3. Mission-specific critical steps (Proteinase K / LN₂)
4. Proper technique (clarification, dry spin)
5. Temperature control (elution warming for plants)

Follow these exactly, and you'll see that beautiful DNA curve on your NanoDrop! 🧬
