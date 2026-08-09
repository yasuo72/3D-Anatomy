export type OrganId =
  | "heart"
  | "brain"
  | "lungs"
  | "liver"
  | "kidneys"
  | "eyeball"
  | "intestine"
  | "pancreas"
  | "skin";

export type Hotspot = {
  id: string;
  label: string;
  detail: string;
  position: [number, number, number];
  color: string;
};

export type OrganPart = {
  id: string;
  name: string;
  function: string;
  clinicalNotes: string[];
  relatedConditions: string[];
};

export type QuizQuestion = {
  q: string;
  options: string[];
  correct: number;
  explanation: string;
};

export type Flashcard = {
  id: string;
  topic: string;
  front: string;
  back: string;
};

export type HistologyInfo = {
  tissueType: string;
  primaryCells: string[];
  layers: string[];
  stain: string;
  microscopicNote: string;
};

export type PhysiologicalFormula = {
  title: string;
  formula: string;
  normalValue: string;
  description: string;
};

export type ResearchDiscovery = {
  year: string;
  title: string;
  researcher: string;
  summary: string;
  impact: string;
};

export type PharmacologyTarget = {
  drugClass: string;
  mechanism: string;
  clinicalIndication: string;
};

export type PathologyGene = {
  gene: string;
  condition: string;
  mechanism: string;
};

export type LessonData = {
  overview: string;
  physiology: string;
  clinical: string;
  evolution: string;
  steps: { title: string; desc: string; hotspotId?: string }[];
};

export type Organ = {
  id: OrganId;
  name: string;
  scientificName: string;
  system: string;
  model: string;
  icon: string;
  accent: string;
  description: string;
  poetic: string;
  size: string;
  weight: string;
  location: string;
  function: string;
  dailyFact: string;
  medical: string;
  bloodSupply: string;
  funFact: string;
  tissue: string;
  comparison: string;
  conditions: string[];
  parts: OrganPart[];
  hotspots: Hotspot[];
  illustrated: boolean;
  quizQuestions: QuizQuestion[];
  flashcards: Flashcard[];
  histology: HistologyInfo;
  formulas: PhysiologicalFormula[];
  research: ResearchDiscovery[];
  pharmacology: PharmacologyTarget[];
  genetics: PathologyGene[];
  lesson: LessonData;
};

export const organs: Organ[] = [
  {
    id: "heart",
    name: "Heart",
    scientificName: "Cor",
    system: "Cardiovascular",
    model: "/models/heart.glb",
    icon: "♥",
    accent: "#ee7c6a",
    description: "A muscular organ that pumps blood throughout the body, delivering oxygen and nutrients to every cell.",
    poetic: "The festival of pumps",
    size: "12 × 8.5 × 6 cm (Adult fist size)",
    weight: "250–350 g (Male: ~300g, Female: ~250g)",
    location: "Middle mediastinum behind sternum (T5–T8 vertebrae)",
    function: "Circulates oxygenated & nutrient-rich blood",
    dailyFact: "Pumps roughly 7,500 L (2,000 gal) of blood daily",
    medical: "Generates intrinsic cardiac action potentials at the Sinoatrial (SA) node.",
    bloodSupply: "Left & Right Coronary Arteries (Ascending Aorta branches)",
    funFact: "Beats ~2.5 billion times in a 70-year lifespan without a single moment of rest.",
    tissue: "Striated Cardiac Muscle (Myocardium)",
    comparison: "Heart vs. brain",
    conditions: [
      "Coronary Artery Disease (CAD)",
      "Myocardial Infarction",
      "Arrhythmia & Atrial Fibrillation",
      "Heart Failure (HFrEF/HFpEF)",
      "Dilated Cardiomyopathy",
      "Infective Endocarditis",
      "Mitral Valve Prolapse",
      "Congenital Ventricular Septal Defect"
    ],
    parts: [
      { id: "aorta", name: "Aorta", function: "Main systemic artery conducting oxygenated blood to body.", clinicalNotes: ["Aortic dissection", "Aortic aneurysm"], relatedConditions: ["Aortic Coarctation", "Aortic Stenosis"] },
      { id: "left-ventricle", name: "Left Ventricle", function: "High-pressure muscular chamber pumping blood systemically.", clinicalNotes: ["Left ventricular hypertrophy"], relatedConditions: ["HFrEF", "Dilated Cardiomyopathy"] },
      { id: "right-ventricle", name: "Right Ventricle", function: "Pumps deoxygenated blood to pulmonary lungs.", clinicalNotes: ["Right heart strain in PE"], relatedConditions: ["Pulmonary Hypertension", "Cor Pulmonale"] },
      { id: "mitral", name: "Mitral Valve", function: "Prevents left ventricular regurgitation during systole.", clinicalNotes: ["Mitral valve prolapse murmur"], relatedConditions: ["Mitral Stenosis", "Mitral Regurgitation"] },
      { id: "apex", name: "Cardiac Apex", function: "Inferolateral tip at 5th intercostal space.", clinicalNotes: ["Point of maximal impulse (PMI)"], relatedConditions: ["Cardiomegaly"] }
    ],
    illustrated: true,
    hotspots: [
      { id: "aorta", label: "Aorta", detail: "Main systemic trunk carrying high-pressure oxygenated blood", position: [-0.35, 1.65, 0.55], color: "#ee7c6a" },
      { id: "left-atrium", label: "Left Atrium", detail: "Receives pulmonary venous inflow (4 pulmonary veins)", position: [0.82, 0.65, 0.5], color: "#f2a33b" },
      { id: "right-atrium", label: "Right Atrium", detail: "Receives systemic venous return via Superior/Inferior Vena Cava", position: [-0.9, 0.35, 0.55], color: "#6393d8" },
      { id: "left-ventricle", label: "Left Ventricle", detail: "Thickest muscular chamber producing 120 mmHg systolic pressure", position: [0.7, -0.75, 0.65], color: "#f2a33b" },
      { id: "right-ventricle", label: "Right Ventricle", detail: "Pumps deoxygenated blood into low-resistance pulmonary circuit", position: [-0.65, -0.68, 0.66], color: "#ee7c6a" },
      { id: "mitral", label: "Mitral (Bicuspid) Valve", detail: "Atrioventricular valve preventing left ventricular regurgitation", position: [0.18, -1.35, 0.48], color: "#d89bc4" },
      { id: "apex", label: "Cardiac Apex", detail: "Inferolateral tip formed by left ventricle at 5th intercostal space", position: [0.95, -1.65, 0.72], color: "#7fa88a" }
    ],
    histology: {
      tissueType: "Involuntary Striated Cardiac Muscle",
      primaryCells: ["Cardiomyocytes", "Purkinje Conduction Fibers", "Sinus Nodal Pacemaker Cells", "Endothelial Cells"],
      layers: ["Epicardium (Visceral Pericardium)", "Myocardium (Muscular Layer)", "Endocardium (Inner Endothelium)"],
      stain: "Hematoxylin & Eosin (H&E) with Masson's Trichrome for fibrosis",
      microscopicNote: "Intercalated discs contain desmosomes for mechanical adhesion and gap junctions (connexins) for rapid electrical syncytium conduction."
    },
    formulas: [
      { title: "Cardiac Output (CO)", formula: "CO = HR × SV", normalValue: "4.8 – 6.5 L/min", description: "Total volume of blood ejected by the left ventricle into the aorta per minute." },
      { title: "Stroke Volume (SV)", formula: "SV = EDV - ESV", normalValue: "70 mL/beat", description: "Volume of blood pumped out of the left ventricle with each contraction." },
      { title: "Mean Arterial Pressure (MAP)", formula: "MAP = DBP + 1/3(SBP - DBP)", normalValue: "70 – 105 mmHg", description: "Average perfusion pressure in systemic arteries during a complete cardiac cycle." }
    ],
    research: [
      { year: "1967", title: "First Human Heart Transplant", researcher: "Dr. Christiaan Barnard", summary: "Performed the world's first successful human-to-human orthotopic heart transplantation in Cape Town.", impact: "Pioneered modern transplant surgery and immunosuppressive therapy." },
      { year: "2022", title: "Genetically Modified Porcine Xenotransplant", researcher: "University of Maryland Medical Center", summary: "Transplanted a 10-gene-edited pig heart into a human patient with end-stage heart disease.", impact: "Opened a new era for bioengineered xenotransplantation to resolve donor shortages." }
    ],
    flashcards: [
      { id: "h1", topic: "Physiology", front: "What creates the 'lub' (S1) heart sound?", back: "Closure of the mitral and tricuspid (AV) valves at the beginning of ventricular systole." },
      { id: "h2", topic: "Anatomy", front: "Which coronary artery supplies the anterior 2/3 of the interventricular septum?", back: "Left Anterior Descending (LAD) artery, often termed the 'widowmaker'." },
      { id: "h3", topic: "Histology", front: "What structural junction allows cardiac muscle cells to contract synchronously as a syncytium?", back: "Gap junctions (Connexin 43) located within intercalated discs." },
      { id: "h4", topic: "Electrophysiology", front: "What is the intrinsic pacing rate of the Sinoatrial (SA) node?", back: "60 to 100 action potentials per minute at rest." }
    ],
    quizQuestions: [
      { q: "Which heart chamber generates the highest wall tension to overcome systemic vascular resistance?", options: ["Right Atrium", "Left Ventricle", "Right Ventricle", "Left Atrium"], correct: 1, explanation: "The Left Ventricle has a wall 3x thicker than the right to generate ~120 mmHg against systemic resistance." },
      { q: "Closure of which valves produces the second heart sound (S2, 'dub')?", options: ["Mitral & Tricuspid", "Aortic & Pulmonary Semilunar", "Eustachian & Thebesian", "Foramen Ovale"], correct: 1, explanation: "S2 is caused by the sudden closure of the aortic and pulmonary semilunar valves at end-systole." },
      { q: "Which artery is commonly called the 'widowmaker' due to high mortality when occluded?", options: ["Right Coronary Artery", "Left Anterior Descending (LAD)", "Circumflex Artery", "Marginal Branch"], correct: 1, explanation: "Occlusion of the LAD blocks blood flow to the anterior wall of the left ventricle and interventricular septum." },
      { q: "What is the primary action of parasympathetic vagus nerve stimulation on the heart?", options: ["Increases Force of Contraction", "Decreases Heart Rate (Negative Chronotropy)", "Causes Ventricular Fibrillation", "Increases SA Node Rate"], correct: 1, explanation: "Acetylcholine released by the Vagus nerve binds M2 muscarinic receptors on SA/AV nodes to slow depolarization." },
      { q: "What formula defines Cardiac Output (CO)?", options: ["CO = Blood Pressure / Resistance", "CO = Heart Rate × Stroke Volume", "CO = End Diastolic Volume - End Systolic Volume", "CO = Tidal Volume × Respiratory Rate"], correct: 1, explanation: "Cardiac Output equals Heart Rate multiplied by Stroke Volume (CO = HR × SV)." }
    ],
    pharmacology: [
      { drugClass: "Beta-Blockers (e.g. Metoprolol, Bisoprolol)", mechanism: "Competitive antagonist at β1-adrenergic receptors, reducing intracellular cAMP and SA node automaticity.", clinicalIndication: "Hypertension, Angina, Heart Failure, Atrial Fibrillation" },
      { drugClass: "ACE Inhibitors (e.g. Lisinopril, Enalapril)", mechanism: "Inhibits Angiotensin-Converting Enzyme, preventing conversion of Angiotensin I to II.", clinicalIndication: "Heart Failure, Post-MI remodeling prevention, Hypertension" },
      { drugClass: "Statins (e.g. Atorvastatin, Rosuvastatin)", mechanism: "Competitive inhibitor of HMG-CoA reductase, upregulating hepatic LDL receptors.", clinicalIndication: "Hyperlipidemia, Atherosclerotic Cardiovascular Disease (ASCVD) primary & secondary prevention" }
    ],
    genetics: [
      { gene: "MYH7 / MYBPC3", condition: "Hypertrophic Cardiomyopathy (HCM)", mechanism: "Autosomal dominant sarcomeric gene mutation causing ventricular septal hypertrophy and risk of sudden cardiac death." },
      { gene: "SCN5A", condition: "Brugada Syndrome & Long QT 3", mechanism: "Loss of function mutation in cardiac NaV1.5 sodium channel causing ventricular arrhythmia." }
    ],
    lesson: {
      overview: "The human heart is a hollow 4-chambered muscular pump located in the middle mediastinum. It circulates approximately 5 liters of blood per minute at rest.",
      physiology: "Deoxygenated blood enters Right Atrium → Right Ventricle → Pulmonary Arteries → Lungs. Oxygenated blood returns via Pulmonary Veins → Left Atrium → Left Ventricle → Aorta → Systemic Circulation.",
      clinical: "Coronary Artery Disease (CAD) occurs when atheromatous plaques narrow the coronary arteries, restricting oxygen delivery to the myocardium and causing angina or myocardial infarction.",
      evolution: "Mammals and birds evolved complete 4-chambered hearts with separate systemic and pulmonary circuits, permitting high metabolic rates and homeothermy unlike 3-chambered amphibian hearts.",
      steps: [
        { title: "Atrial Filling & Contraction", desc: "Venous blood collects in atria and passes through AV valves into ventricles.", hotspotId: "right-atrium" },
        { title: "Ventricular Systole & Ejection", desc: "Ventricles contract forcefully, snapping AV valves shut and ejecting blood into aorta and pulmonary trunk.", hotspotId: "left-ventricle" },
        { title: "Aortic Arch Delivery", desc: "High-pressure oxygenated blood enters systemic arterial tree via the aortic arch.", hotspotId: "aorta" }
      ]
    }
  },

  {
    id: "brain",
    name: "Brain",
    scientificName: "Encephalon",
    system: "Nervous System",
    model: "/models/brain.glb",
    icon: "◉",
    accent: "#c58696",
    description: "The body’s command center, integrating sensation, memory, emotion, and precise movement.",
    poetic: "The universe within",
    size: "15 × 14 × 11 cm",
    weight: "1.3–1.4 kg (2.9–3.1 lbs)",
    location: "Cranium cavity (anterior, middle, & posterior cranial fossae)",
    function: "Processes neural signals, cognition, emotion & motor output",
    dailyFact: "Consumes 20% of glucose & oxygen while accounting for only 2% of body mass",
    medical: "Contains ~86 billion neurons communicating via electrical action potentials and chemical neurotransmitters.",
    bloodSupply: "Internal Carotid Arteries & Vertebral Arteries (Circle of Willis)",
    funFact: "Has no pain receptors of its own — brain surgery can be performed on conscious patients.",
    tissue: "Gray Matter (Neuron Cell Bodies) & White Matter (Myelinated Axons)",
    comparison: "Brain vs. eye",
    conditions: [
      "Ischemic & Hemorrhagic Stroke",
      "Alzheimer's Disease & Dementia",
      "Parkinson's Disease",
      "Epilepsy & Seizure Disorders",
      "Multiple Sclerosis (MS)",
      "Glioblastoma Multiforme",
      "Traumatic Brain Injury (TBI)",
      "Cerebral Aneurysm"
    ],
    parts: [
      { id: "frontal", name: "Frontal Lobe", function: "Executive function, decision making & motor output.", clinicalNotes: ["Broca's expressive aphasia"], relatedConditions: ["Frontotemporal Dementia", "TBI"] },
      { id: "parietal", name: "Parietal Lobe", function: "Somatosensory processing and spatial orientation.", clinicalNotes: ["Gerstmann syndrome"], relatedConditions: ["Spatial Neglect"] },
      { id: "temporal", name: "Temporal Lobe", function: "Auditory processing, memory consolidation & speech comprehension.", clinicalNotes: ["Wernicke's receptive aphasia"], relatedConditions: ["Temporal Lobe Epilepsy", "Alzheimer's"] },
      { id: "cerebellum", name: "Cerebellum", function: "Motor coordination, posture, and motor learning.", clinicalNotes: ["Ataxia and intention tremor"], relatedConditions: ["Cerebellar Atrophy"] }
    ],
    illustrated: true,
    hotspots: [
      { id: "frontal", label: "Frontal Lobe", detail: "Prefrontal executive cortex, motor cortex & Broca's speech area", position: [-0.7, 0.65, 0.8], color: "#ee7c6a" },
      { id: "parietal", label: "Parietal Lobe", detail: "Primary somatosensory cortex and spatial awareness integration", position: [0.15, 1.1, 0.65], color: "#f2a33b" },
      { id: "temporal", label: "Temporal Lobe", detail: "Auditory processing, hippocampus memory consolidation & Wernicke's area", position: [0.75, -0.1, 0.82], color: "#6393d8" },
      { id: "cerebellum", label: "Cerebellum", detail: "Fine motor control, motor learning, posture & equilibrium", position: [0.72, -0.9, 0.55], color: "#d89bc4" },
      { id: "occipital", label: "Occipital Lobe", detail: "Primary visual cortex (Brodmann area 17) processing retinotopic inputs", position: [0.85, 0.35, -0.85], color: "#7fa88a" }
    ],
    histology: {
      tissueType: "Central Nervous System Parenchyma",
      primaryCells: ["Pyramidal Neurons", "Astrocytes (Blood-Brain Barrier)", "Oligodendrocytes (Myelination)", "Microglia (Immune Scavengers)"],
      layers: ["Cortex Layer I (Molecular)", "Layer II (Ext. Granular)", "Layer III (Ext. Pyramidal)", "Layer IV (Int. Granular)", "Layer V (Int. Pyramidal)", "Layer VI (Multiform)"],
      stain: "Nissl Stain for neuronal cell bodies & Luxol Fast Blue for myelin",
      microscopicNote: "Astrocytic end-feet wrap capillary basement membranes to form tight junction Blood-Brain Barrier (BBB)."
    },
    formulas: [
      { title: "Cerebral Perfusion Pressure (CPP)", formula: "CPP = MAP - ICP", normalValue: "60 – 80 mmHg", description: "Pressure gradient driving blood perfusion through cerebral tissue." },
      { title: "Cerebral Blood Flow (CBF)", formula: "CBF = CPP / CVR", normalValue: "50 mL/100g/min", description: "Rate of blood delivery across gray and white matter." }
    ],
    research: [
      { year: "1906", title: "Discovery of Neuron Doctrine", researcher: "Santiago Ramón y Cajal", summary: "Proved that the nervous system consists of discrete individual cells rather than a continuous net.", impact: "Established modern neurobiology." },
      { year: "2012", title: "Discovery of Glymphatic System", researcher: "Maiken Nedergaard", summary: "Discovered a macroscopic waste clearance pathway using astroglial channels to purge amyloid during sleep.", impact: "Revolutionized neurodegenerative disease research." }
    ],
    flashcards: [
      { id: "b1", topic: "Anatomy", front: "Which cortical lobe contains Wernicke's language comprehension area?", back: "The Superior Temporal Gyrus of the Temporal Lobe (typically left hemisphere)." },
      { id: "b2", topic: "Histology", front: "Which glial cell forms myelin sheaths around axons in the Central Nervous System?", back: "Oligodendrocytes (Schwann cells perform this in the PNS)." },
      { id: "b3", topic: "Physiology", front: "What is the consequence of Cerebral Perfusion Pressure (CPP) dropping below 50 mmHg?", back: "Ischemia, hypoxia, and irreversible neuronal injury." },
      { id: "b4", topic: "Neuroanatomy", front: "What vascular ring connects internal carotid and vertebrobasilar supplies at the brain base?", back: "The Circle of Willis." }
    ],
    quizQuestions: [
      { q: "Which area of the brain is primarily damaged in Parkinson's Disease?", options: ["Hippocampus", "Substantia Nigra Pars Compacta", "Cerebellum", "Occipital Lobe"], correct: 1, explanation: "Parkinson's involves loss of dopaminergic neurons in the Substantia Nigra, causing resting tremor and bradykinesia." },
      { q: "What structure consolidates short-term memory into long-term cortical storage?", options: ["Amygdala", "Hippocampus", "Thalamus", "Medulla Oblongata"], correct: 1, explanation: "The Hippocampus in the medial temporal lobe is essential for declarative memory consolidation." },
      { q: "Which lobe houses the primary motor cortex (Brodmann area 4)?", options: ["Frontal Lobe", "Parietal Lobe", "Temporal Lobe", "Occipital Lobe"], correct: 0, explanation: "The precentral gyrus of the Frontal Lobe initiates voluntary motor output." },
      { q: "What glial cell type maintains the Blood-Brain Barrier (BBB)?", options: ["Microglia", "Astrocytes", "Ependymal Cells", "Schwann Cells"], correct: 1, explanation: "Astrocytic podocytes wrap cerebral capillary endothelial cells, enforcing tight junction selectivity." },
      { q: "What is normal Cerebral Perfusion Pressure (CPP)?", options: ["10 – 20 mmHg", "60 – 80 mmHg", "120 – 140 mmHg", "200 – 240 mmHg"], correct: 1, explanation: "Normal CPP is maintained between 60 and 80 mmHg (CPP = MAP - ICP)." }
    ],
    pharmacology: [
      { drugClass: "SSRIs (e.g. Sertraline, Escitalopram)", mechanism: "Selective inhibition of presynaptic Serotonin Reuptake Transporter (SERT), elevating synaptic 5-HT levels.", clinicalIndication: "Major Depressive Disorder, Generalized Anxiety Disorder, OCD" },
      { drugClass: "Levodopa / Carbidopa", mechanism: "Dopamine precursor that crosses blood-brain barrier; carbidopa prevents peripheral aromatic L-amino acid decarboxylase degradation.", clinicalIndication: "Parkinson's Disease bradykinesia and rigidity" }
    ],
    genetics: [
      { gene: "APOE-ε4 allele", condition: "Late-Onset Alzheimer's Disease", mechanism: "Apolipoprotein E variant impairing brain beta-amyloid clearance and predisposing to senile plaque aggregation." },
      { gene: "HTT (CAG expansion)", condition: "Huntington's Disease", mechanism: "Autosomal dominant CAG trinucleotide repeat expansion causing toxic huntingtin aggregation and caudate degeneration." }
    ],
    lesson: {
      overview: "The human brain contains ~86 billion neurons interconnected by trillions of synapses. It is divided into cerebrum, cerebellum, and brainstem.",
      physiology: "Information travels via electrical action potentials down axons and chemical neurotransmitters across synaptic clefts to control behavior and physiology.",
      clinical: "Ischemic strokes occur when arterial thrombosis blocks blood flow to brain tissue, resulting in rapid neuronal hypoxia and neurological deficits.",
      evolution: "Encephalization expanded the neocortex dramatically in hominids, yielding high surface area via sulci and gyri folding.",
      steps: [
        { title: "Executive Decision", desc: "Prefrontal neural networks evaluate inputs and initiate motor plans.", hotspotId: "frontal" },
        { title: "Sensory Integration", desc: "Parietal networks map somatosensory data into spatial representations.", hotspotId: "parietal" },
        { title: "Motor Fine-Tuning", desc: "Cerebellum compares intended movement with actual position.", hotspotId: "cerebellum" }
      ]
    }
  },

  {
    id: "lungs",
    name: "Lungs",
    scientificName: "Pulmones",
    system: "Respiratory System",
    model: "/models/lungs.glb",
    icon: "◍",
    accent: "#dd8f8b",
    description: "Paired organs that draw in air and trade oxygen for carbon dioxide across a vast, delicate surface.",
    poetic: "The breath of life",
    size: "Right: 24 cm tall, Left: 22 cm tall",
    weight: "1.0–1.1 kg for the pair (Right ~600g, Left ~500g)",
    location: "Pleural cavities in thoracic cage flanking the mediastinum",
    function: "Gas exchange (O₂ uptake & CO₂ excretion) & Acid-base pH balance",
    dailyFact: "Exchanges ~11,000 L of air across 300+ million alveoli daily",
    medical: "Alveolar type II pneumocytes synthesize pulmonary surfactant to prevent end-expiratory atelectasis.",
    bloodSupply: "Pulmonary Arteries (deoxygenated) & Bronchial Arteries (nutritive)",
    funFact: "The total surface area of all alveoli combined equals the size of a regulation tennis court (~70–100 m²).",
    tissue: "Simple Squamous Alveolar Epithelium & Elastic Stroma",
    comparison: "Lungs vs. heart",
    conditions: [
      "Bronchial Asthma",
      "Chronic Obstructive Pulmonary Disease (COPD)",
      "Bacterial & Viral Pneumonia",
      "Pulmonary Embolism",
      "Idiopathic Pulmonary Fibrosis",
      "Acute Respiratory Distress Syndrome (ARDS)",
      "Cystic Fibrosis",
      "Bronchogenic Carcinoma"
    ],
    parts: [
      { id: "trachea", name: "Trachea", function: "Conducts inhaled air into primary bronchial tree.", clinicalNotes: ["Tracheomalacia"], relatedConditions: ["Tracheitis", "Foreign body aspiration"] },
      { id: "right-lung", name: "Right Lung", function: "Three-lobed lung performing gas exchange.", clinicalNotes: ["Aspiration pneumonia favored in right lower lobe"], relatedConditions: ["COPD", "Pneumonia"] },
      { id: "left-lung", name: "Left Lung", function: "Two-lobed lung with cardiac notch.", clinicalNotes: ["Pleural effusion"], relatedConditions: ["Atelectasis", "Pneumothorax"] },
      { id: "bronchus", name: "Main Bronchus", function: "Conductive airway bifurcating at carina.", clinicalNotes: ["Bronchospasm"], relatedConditions: ["Asthma", "Chronic Bronchitis"] }
    ],
    illustrated: true,
    hotspots: [
      { id: "trachea", label: "Trachea", detail: "Cartilaginous tube conducting air from larynx to primary bronchi", position: [0, 1.6, 0.2], color: "#6393d8" },
      { id: "right-lung", label: "Right Lung", detail: "Three lobes (Superior, Middle, Inferior) divided by horizontal & oblique fissures", position: [-1.2, 0.1, 0.7], color: "#ee7c6a" },
      { id: "left-lung", label: "Left Lung", detail: "Two lobes with cardiac notch accommodating the heart apex", position: [1.2, 0.1, 0.7], color: "#f2a33b" },
      { id: "bronchus", label: "Main Bronchus", detail: "Primary airway bifurcating at carina (T4 level)", position: [-0.03, 0.3, 0.35], color: "#d89bc4" },
      { id: "base", label: "Diaphragmatic Base", detail: "Concave inferior border resting on dome of diaphragm", position: [-1.14, -1.2, 1], color: "#7fa88a" }
    ],
    histology: {
      tissueType: "Respiratory Epithelium & Alveolar Parenchyma",
      primaryCells: ["Type I Pneumocytes (95% area)", "Type II Pneumocytes (Surfactant)", "Alveolar Macrophages (Dust cells)", "Goblet Cells"],
      layers: ["Visceral Pleura", "Subpleural Stroma", "Interalveolar Septa", "Blood-Air Barrier (0.5 µm thick)"],
      stain: "H&E with Verhoeff's stain for elastic fibers",
      microscopicNote: "The blood-air barrier consists of Type I pneumocyte cytoplasm, fused basement membranes, and capillary endothelial cell cytoplasm."
    },
    formulas: [
      { title: "Minute Ventilation (VE)", formula: "VE = TV × RR", normalValue: "6.0 L/min", description: "Total volume of gas inhaled or exhaled from lungs per minute." },
      { title: "Alveolar Gas Equation (PAO2)", formula: "PAO2 = FiO2(PB - PH2O) - PaCO2/R", normalValue: "100 mmHg", description: "Calculates partial pressure of oxygen inside pulmonary alveoli." }
    ],
    research: [
      { year: "1929", title: "Discovery of Pulmonary Surfactant", researcher: "Kurt von Neergaard", summary: "Demonstrated that surface tension at liquid-air interfaces in alveoli requires lipid lowering agent to prevent collapse.", impact: "Led to synthetic surfactant therapy saving millions of premature infants." }
    ],
    flashcards: [
      { id: "l1", topic: "Physiology", front: "Which alveolar cell type produces pulmonary surfactant?", back: "Type II Pneumocytes." },
      { id: "l2", topic: "Histology", front: "What is the thickness of the blood-air diffusion barrier?", back: "Approximately 0.2 to 0.5 micrometers." },
      { id: "l3", topic: "Anatomy", front: "Why does the right lung have 3 lobes while the left has 2?", back: "The left lung contains the cardiac notch to accommodate the heart." },
      { id: "l4", topic: "Pathology", front: "What genetic deficiency causes panacinar emphysema in non-smokers?", back: "Alpha-1 Antitrypsin Deficiency." }
    ],
    quizQuestions: [
      { q: "Which cell type secretes dipalmitoylphosphatidylcholine (surfactant)?", options: ["Type I Pneumocyte", "Type II Pneumocyte", "Clara Cell", "Alveolar Macrophage"], correct: 1, explanation: "Type II pneumocytes synthesize surfactant to reduce surface tension and increase pulmonary compliance." },
      { q: "What is normal Minute Ventilation (VE) at rest?", options: ["1.5 L/min", "6.0 L/min", "18.0 L/min", "45.0 L/min"], correct: 1, explanation: "VE = Tidal Volume (0.5 L) × Respiratory Rate (12 breaths/min) = 6.0 L/min." },
      { q: "Where does the trachea bifurcate into right and left main bronchi?", options: ["Laryngeal Prominence", "Carina at T4/T5 Sternel Angle", "Xiphoid Process", "Hyoid Bone"], correct: 1, explanation: "The Carina at the level of T4/T5 (sternal angle) marks tracheal bifurcation." },
      { q: "What enzyme balances elastic recoil in lung tissue against neutrophil elastase?", options: ["Alpha-1 Antitrypsin", "Pepsin", "Amylase", "Renin"], correct: 0, explanation: "Alpha-1 antitrypsin inhibits neutrophil elastase, preserving elastin in alveolar walls." },
      { q: "What volume of air remains in lungs after maximal forced exhalation?", options: ["Tidal Volume", "Residual Volume (RV)", "Vital Capacity", "Inspiratory Reserve Volume"], correct: 1, explanation: "Residual Volume (~1.2 L) cannot be exhaled and keeps alveoli patent." }
    ],
    pharmacology: [
      { drugClass: "Short-Acting Beta2 Agonists (e.g. Albuterol)", mechanism: "Stimulates bronchial smooth muscle β2-adrenergic receptors, triggering Gs-cAMP-PKA bronchodilation.", clinicalIndication: "Acute Asthma exacerbations and COPD bronchospasm relief" },
      { drugClass: "Inhaled Corticosteroids (e.g. Fluticasone, Budesonide)", mechanism: "Inhibits NF-κB transcription factor, reducing inflammatory cytokine gene expression in airway mucosa.", clinicalIndication: "Chronic Asthma maintenance & severe COPD" }
    ],
    genetics: [
      { gene: "CFTR (ΔF508 deletion)", condition: "Cystic Fibrosis", mechanism: "Misfolding of ATP-gated chloride channel causing hyperviscous mucus obstruction in airways and bronchiectasis." },
      { gene: "SERPINA1", condition: "Alpha-1 Antitrypsin Deficiency", mechanism: "Deficiency of AAT protease inhibitor causing uninhibited neutrophil elastase destruction of alveolar septa (panacinar emphysema)." }
    ],
    lesson: {
      overview: "The respiratory system conducts atmospheric air into 300 million alveoli, providing a massive 70-100 m² diffusion barrier for blood gas homeostasis.",
      physiology: "Inspiration occurs as thoracic volume increases and intrapulmonary pressure drops below atmospheric. Passive recoil of elastic pulmonary tissue drives expiration.",
      clinical: "Pneumonia causes inflammatory exudate to accumulate within alveoli, impairing oxygen diffusion across the blood-air barrier and causing hypoxemia.",
      evolution: "Lungs evolved from swim bladders in ancestral bony fish, progressively folding internal surfaces to support terrestrial endothermy.",
      steps: [
        { title: "Airway Conduction", desc: "Air enters via trachea and branches through primary bronchi into bronchiole networks.", hotspotId: "trachea" },
        { title: "Pulmonary Expansion", desc: "Lobes expand within thoracic cavity, drawing air deep into alveolar sacs.", hotspotId: "right-lung" },
        { title: "Diaphragmatic Recoil", desc: "Diaphragm relaxes upward, gently compressing lung base and expelling CO2.", hotspotId: "base" }
      ]
    }
  },

  {
    id: "liver",
    name: "Liver",
    scientificName: "Hepar",
    system: "Digestive System",
    model: "/models/liver.glb",
    icon: "≈",
    accent: "#b86858",
    description: "A remarkable metabolic organ that filters blood, processes nutrients, and produces bile.",
    poetic: "The quiet alchemist",
    size: "21 × 15 × 13 cm",
    weight: "1.4–1.6 kg (3.1–3.5 lbs)",
    location: "Right upper quadrant & epigastrium under diaphragm",
    function: "Metabolism, glycogen storage, detoxification, plasma protein synthesis & bile production",
    dailyFact: "Performs over 500 vital biochemical metabolic functions simultaneously",
    medical: "Hepatocytes possess unmatched regenerative capacity, capable of repopulating full organ volume from a 25% remnant.",
    bloodSupply: "Hepatic Artery (25%) & Portal Vein (75% nutrient-rich)",
    funFact: "It is the only internal human organ capable of complete natural tissue regeneration.",
    tissue: "Hepatic Lobules with Central Veins & Portal Triads",
    comparison: "Liver vs. intestine",
    conditions: [
      "Metabolic Dysfunction-Associated Steatotic Liver Disease (MASLD)",
      "Viral Hepatitis (A, B, C, D, E)",
      "Alcoholic & Non-Alcoholic Cirrhosis",
      "Cholelithiasis & Choledocholithiasis",
      "Hereditary Hemochromatosis",
      "Hepatocellular Carcinoma (HCC)",
      "Portal Hypertension",
      "Wilson's Disease (Copper overload)"
    ],
    parts: [
      { id: "right-lobe", name: "Right Hepatic Lobe", function: "Dominant 5/6 liver volume performing detoxification.", clinicalNotes: ["Hepatic hemangioma"], relatedConditions: ["Steatotic Liver Disease", "HCC"] },
      { id: "left-lobe", name: "Left Hepatic Lobe", function: "Left segment extending to stomach hilum.", clinicalNotes: ["Subphrenic abscess"], relatedConditions: ["Cirrhosis"] },
      { id: "portal", name: "Hepatic Portal Vein", function: "Delivers 75% nutrient blood from gut.", clinicalNotes: ["Portal hypertension and esophageal varices"], relatedConditions: ["Portal Vein Thrombosis"] }
    ],
    illustrated: true,
    hotspots: [
      { id: "right-lobe", label: "Right Lobe", detail: "Dominant hepatic lobe accounting for 5/6 of liver volume", position: [-0.75, 0.35, 0.75], color: "#ee7c6a" },
      { id: "left-lobe", label: "Left Lobe", detail: "Smaller flattened left lobe extending across midline to stomach", position: [0.85, 0.25, 0.75], color: "#f2a33b" },
      { id: "portal", label: "Hepatic Portal Vein", detail: "Carries absorbed digestive nutrients directly from gut to liver sinusoids", position: [0.1, -0.3, 0.82], color: "#6393d8" }
    ],
    histology: {
      tissueType: "Glandular Epithelial Parenchyma",
      primaryCells: ["Hepatocytes (80% volume)", "Kupffer Cells (Resident Macrophages)", "Stellate Cells (Vitamin A storage)", "Sinusoidal Endothelium"],
      layers: ["Glisson's Fibrous Capsule", "Classic Hexagonal Lobules", "Portal Triads", "Space of Disse"],
      stain: "H&E with Reticulin stain for lobular architecture",
      microscopicNote: "Sinusoidal capillaries are fenestrated without continuous basement membrane, allowing direct plasma contact with hepatocyte microvilli."
    },
    formulas: [
      { title: "Hepatic Clearance (CLh)", formula: "CLh = Qh × E", normalValue: "1.35 L/min blood flow", description: "Rate at which hepatocytes remove drugs/toxins from portal blood." }
    ],
    research: [
      { year: "1963", title: "First Human Liver Transplant", researcher: "Dr. Thomas Starzl", summary: "Performed the first human liver transplant at the University of Colorado.", impact: "Pioneered organ preservation and immunosuppression for hepatobiliary medicine." }
    ],
    flashcards: [
      { id: "li1", topic: "Histology", front: "Which resident macrophage line lines hepatic sinusoids to phagocytose bacteria?", back: "Kupffer Cells." },
      { id: "li2", topic: "Pathology", front: "Which liver cell type transforms into myofibroblasts and secretes collagen in cirrhosis?", back: "Hepatic Stellate Cells (Ito cells)." },
      { id: "li3", topic: "Anatomy", front: "What three structures constitute a Portal Triad?", back: "Branch of Portal Vein, Branch of Hepatic Artery, and Bile Ductule." },
      { id: "li4", topic: "Physiology", front: "Which major plasma protein synthesized by hepatocytes maintains oncotic pressure?", back: "Albumin." }
    ],
    quizQuestions: [
      { q: "Which vessel delivers 75% of total blood inflow to the liver, rich in gastrointestinal nutrients?", options: ["Hepatic Artery", "Hepatic Portal Vein", "Inferior Vena Cava", "Splenic Vein"], correct: 1, explanation: "The Hepatic Portal Vein drains stomach, intestine, and spleen blood into hepatic sinusoids." },
      { q: "Which cells store Vitamin A in normal liver tissue and secrete collagen during fibrosis?", options: ["Kupffer Cells", "Stellate (Ito) Cells", "Hepatocytes", "Cholangiocytes"], correct: 1, explanation: "Quiescent Stellate cells store Vitamin A; upon liver injury, they activate and lay down collagen matrix." },
      { q: "What end-product of heme catabolism is conjugated with glucuronic acid by hepatocytes?", options: ["Urea", "Bilirubin", "Cholesterol", "Creatinine"], correct: 1, explanation: "Unconjugated bilirubin is bound to albumin, transported to hepatocytes, and conjugated for bile excretion." },
      { q: "What metabolic pathway converts toxic ammonia into water-soluble excretory compound?", options: ["Glycolysis", "Urea Cycle (Krebs-Henseleit)", "Citric Acid Cycle", "Beta Oxidation"], correct: 1, explanation: "Hepatocytes convert metabolic ammonia into urea via the Urea Cycle." },
      { q: "Which plasma protein synthesized by the liver is essential for blood coagulation (Factor I)?", options: ["Albumin", "Fibrinogen", "Transferrin", "Ceruloplasmin"], correct: 1, explanation: "Fibrinogen is synthesized by hepatocytes and cleaved by thrombin during clot formation." }
    ],
    pharmacology: [
      { drugClass: "Non-Selective Beta-Blockers (e.g. Propranolol, Nadolol)", mechanism: "Blocks β1 (reducing cardiac output) & β2 receptors (causing unopposed α1 splanchnic vasoconstriction), lowering portal vein pressure.", clinicalIndication: "Esophageal Variceal Bleeding Prophylaxis in Cirrhosis" },
      { drugClass: "Lactulose", mechanism: "Colonic bacterial degradation yields lactic/acetic acids, acidifying lumen to convert ammonia (NH3) to non-absorbable ammonium (NH4+).", clinicalIndication: "Hepatic Encephalopathy in End-Stage Liver Disease" }
    ],
    genetics: [
      { gene: "ATP7B", condition: "Wilson's Disease", mechanism: "Mutation in copper-transporting P-type ATPase causing failure of biliary copper excretion and hepatic/basal ganglia toxicity." },
      { gene: "HFE (C282Y)", condition: "Hereditary Hemochromatosis", mechanism: "Low hepcidin expression causing excessive duodenal iron absorption, bronze diabetes, and cirrhosis." }
    ],
    lesson: {
      overview: "The liver is the largest internal gland, divided into hexagonal lobules. It acts as a metabolic gateway between digestive tract and systemic circulation.",
      physiology: "Nutrient-rich venous blood passes through hepatic sinusoids where hepatocytes store glycogen, detoxify metabolic wastes, and synthesize bile.",
      clinical: "Chronic liver damage leads to Cirrhosis—irreversible fibrous scarring that disrupts portal flow, causing portal hypertension and ascites.",
      evolution: "Hepatic tissue evolved early in craniates as a centralized digestive gland uniting carbohydrate regulation with bile detoxification.",
      steps: [
        { title: "Portal Blood Entry", desc: "Nutrients absorbed from gut enter via portal vein.", hotspotId: "portal" },
        { title: "Sinusoidal Processing", desc: "Hepatocytes convert ammonia to urea and store glycogen.", hotspotId: "right-lobe" },
        { title: "Bile Excretion", desc: "Bile drains via canaliculi to hepatic ducts and gallbladder.", hotspotId: "left-lobe" }
      ]
    }
  },

  {
    id: "kidneys",
    name: "Kidneys",
    scientificName: "Renes",
    system: "Urinary System",
    model: "/models/kidneys.glb",
    icon: "∞",
    accent: "#c96963",
    description: "Paired filtration organs that balance fluids, electrolytes, blood pressure, and waste removal.",
    poetic: "The master filters",
    size: "11 × 6 × 3 cm each",
    weight: "120–170 g each (Total ~300g)",
    location: "Retroperitoneal space on posterior abdominal wall (T12–L3 level)",
    function: "Plasma ultrafiltration, electrolyte homeostasis, RAAS blood pressure control & Erythropoietin synthesis",
    dailyFact: "Filters 180 L (48 gal) of blood plasma daily, reclaiming 99% as clean water",
    medical: "Houses ~1 million nephrons per kidney consisting of glomeruli, proximal tubules, loops of Henle, & collecting ducts.",
    bloodSupply: "Renal Arteries receiving 20-25% of cardiac output",
    funFact: "Only 1.5 L of fluid leaves the body as urine daily from the 180 L filtered.",
    tissue: "Renal Cortical Nephrons & Medullary Pyramids",
    comparison: "Kidneys vs. liver",
    conditions: [
      "Nephrolithiasis (Kidney Stones)",
      "Chronic Kidney Disease (CKD Stage 1-5)",
      "Acute Kidney Injury (AKI)",
      "Glomerulonephritis & IgA Nephropathy",
      "Autosomal Dominant Polycystic Kidney Disease (ADPKD)",
      "Renovascular Hypertension",
      "Nephrotic Syndrome",
      "Renal Cell Carcinoma"
    ],
    parts: [
      { id: "cortex", name: "Renal Cortex", function: "Houses Bowman's capsules & glomeruli for ultrafiltration.", clinicalNotes: ["Glomerulonephritis pathology"], relatedConditions: ["Nephrotic Syndrome", "CKD"] },
      { id: "medulla", name: "Renal Medulla", function: "Countercurrent multiplication in loops of Henle.", clinicalNotes: ["Renal papillary necrosis"], relatedConditions: ["Pyelonephritis"] },
      { id: "ureter", name: "Ureter", function: "Smooth muscle tube conducting urine to bladder.", clinicalNotes: ["Ureteral colic stone obstruction"], relatedConditions: ["Nephrolithiasis"] }
    ],
    illustrated: true,
    hotspots: [
      { id: "cortex", label: "Renal Cortex", detail: "Outer reddish layer housing renal corpuscles (Bowman's capsules & glomeruli)", position: [-0.9, 0.55, 0.7], color: "#ee7c6a" },
      { id: "medulla", label: "Renal Medulla", detail: "Inner pyramids housing loops of Henle & collecting duct countercurrent multipliers", position: [0.85, 0.2, 0.7], color: "#f2a33b" },
      { id: "ureter", label: "Ureter", detail: "Peristaltic smooth muscle tube carrying urine to urinary bladder", position: [0.4, -1.1, 0.5], color: "#6393d8" }
    ],
    histology: {
      tissueType: "Renal Tubular Epithelium & Vascular Glomeruli",
      primaryCells: ["Podocytes (Visceral Glomerular Layer)", "Fenestrated Endothelial Cells", "Mesangial Cells", "Juxtaglomerular Cells"],
      layers: ["Fibrous Capsule", "Renal Cortex", "Medullary Pyramids", "Renal Pelvis"],
      stain: "PAS (Periodic Acid-Schiff) stain for glomerular basement membranes",
      microscopicNote: "Podocyte interdigitating foot processes form 30 nm filtration slits covered by nephrin slit diaphragms."
    },
    formulas: [
      { title: "Glomerular Filtration Rate (GFR)", formula: "eGFR = 141 × min(Cr/κ,1)^α × max(Cr/κ,1)^-1.209", normalValue: "90 – 120 mL/min/1.73m²", description: "Gold standard measurement of functional nephron mass filtering capacity." },
      { title: "Creatinine Clearance (CrCl)", formula: "CrCl = (Urine Cr × Vol) / (Plasma Cr × Time)", normalValue: "95 – 140 mL/min", description: "Estimates GFR using 24-hour urinary collection." }
    ],
    research: [
      { year: "1954", title: "First Successful Kidney Transplant", researcher: "Dr. Joseph Murray", summary: "Transplanted a kidney between identical twins at Peter Bent Brigham Hospital in Boston.", impact: "Earned 1990 Nobel Prize in Medicine and launched organ transplantation." }
    ],
    flashcards: [
      { id: "k1", topic: "Histology", front: "Which cells wrap glomerular capillaries and form filtration slits with nephrin?", back: "Podocytes." },
      { id: "k2", topic: "Physiology", front: "What hormone secreted by kidney interstitial cells stimulates red blood cell production?", back: "Erythropoietin (EPO)." },
      { id: "k3", topic: "Endocrinology", front: "What enzyme secreted by Juxtaglomerular (JG) cells cleaves Angiotensinogen?", back: "Renin." },
      { id: "k4", topic: "Anatomy", front: "What structural region of the nephron establishes the medullary osmotic gradient?", back: "The Loop of Henle." }
    ],
    quizQuestions: [
      { q: "What is the functional filtering unit of the kidney?", options: ["Nephron", "Hepatocyte", "Alveolus", "Oligodendrocyte"], correct: 0, explanation: "Each kidney contains ~1 million nephrons responsible for filtration, reabsorption, and secretion." },
      { q: "Which hormone produced by the kidney stimulates bone marrow erythrocyte production?", options: ["Renin", "Erythropoietin (EPO)", "Aldosterone", "Calcitonin"], correct: 1, explanation: "Renal interstitial peritubular cells release EPO in response to tissue hypoxia." },
      { q: "Which specialized cells monitor sodium chloride delivery in the distal convoluted tubule?", options: ["Podocytes", "Macula Densa Cells", "Juxtaglomerular Cells", "Mesangial Cells"], correct: 1, explanation: "Macula Densa cells detect luminal NaCl concentration and regulate tubuloglomerular feedback." },
      { q: "Where does ~65% of all filtered water, sodium, and glucose reabsorption occur?", options: ["Glomerulus", "Proximal Convoluted Tubule (PCT)", "Loop of Henle", "Collecting Duct"], correct: 1, explanation: "The PCT reabsorbs ~65% of filtered water and 100% of filtered glucose under normal conditions." }
    ],
    pharmacology: [
      { drugClass: "Loop Diuretics (e.g. Furosemide, Torsemide)", mechanism: "Inhibits luminal Na+/K+/2Cl- cotransporter (NKCC2) in thick ascending loop of Henle, disrupting medullary gradient.", clinicalIndication: "Acute Pulmonary Edema, Heart Failure, Hypercalcemia, Fluid Overload" },
      { drugClass: "SGLT2 Inhibitors (e.g. Empagliflozin, Dapagliflozin)", mechanism: "Inhibits Sodium-Glucose Cotransporter 2 in proximal convoluted tubule, increasing glucosuria & natriuresis.", clinicalIndication: "CKD progression delay, Type 2 Diabetes, Heart Failure with Reduced Ejection Fraction" }
    ],
    genetics: [
      { gene: "PKD1 & PKD2", condition: "Autosomal Dominant Polycystic Kidney Disease (ADPKD)", mechanism: "Mutations in polycystin-1 & 2 causing progressive renal cyst formation, flank pain, hypertension, and ESRD." },
      { gene: "COL4A3 / COL4A4 / COL4A5", condition: "Alport Syndrome", mechanism: "Type IV collagen mutation causing hereditary nephritis, sensorineural hearing loss, and ocular anterior lenticonus." }
    ],
    lesson: {
      overview: "The kidneys maintain extracellular fluid volume, osmolality, and acid-base balance while eliminating metabolic end-products like urea and creatinine.",
      physiology: "Glomerular filtration produces 180 L/day of filtrate. Reabsorption in proximal tubules and loops of Henle reclaims essential ions and water.",
      clinical: "Chronic Kidney Disease (CKD) results in progressive loss of nephron function, requiring hemodialysis or renal transplantation.",
      evolution: "Metanephric kidneys evolved in amniotes to conserve water through concentrated urine, enabling arid land survival.",
      steps: [
        { title: "Ultrafiltration", desc: "Capillary pressure forces solutes into Bowman's space.", hotspotId: "cortex" },
        { title: "Medullary Concentration", desc: "Loops of Henle establish hyperosmolar gradient.", hotspotId: "medulla" },
        { title: "Ureteral Excretion", desc: "Urine drains into renal pelvis and ureter.", hotspotId: "ureter" }
      ]
    }
  },

  {
    id: "eyeball",
    name: "Eye",
    scientificName: "Oculus",
    system: "Sensory System",
    model: "/models/eyeball.glb",
    icon: "⊙",
    accent: "#7294b9",
    description: "A precision sensory organ that converts focused light into neural signals interpreted as vision.",
    poetic: "A window made of light",
    size: "24 mm anteroposterior diameter",
    weight: "7.5 g (0.26 oz)",
    location: "Bony orbital cavity of skull protected by adipose tissue",
    function: "Refracts photons onto retina & transduces phototransduction visual signals",
    dailyFact: "Executes >100,000 saccadic movements daily to build visual perception",
    medical: "Retina contains 120 million rods (scotopic low-light) and 6 million cones (photopic color vision).",
    bloodSupply: "Ophthalmic Artery (Central Retinal Artery branch)",
    funFact: "The cornea is completely avascular, receiving oxygen directly from atmospheric air.",
    tissue: "Stratified Squamous Cornea & Neurosensory Retina",
    comparison: "Eye vs. brain",
    conditions: [
      "Myopia & Hyperopia",
      "Senile Cataracts",
      "Open-Angle & Angle-Closure Glaucoma",
      "Age-Related Macular Degeneration (AMD)",
      "Rhegmatogenous Retinal Detachment",
      "Diabetic Retinopathy",
      "Dry Eye Disease",
      "Corneal Dystrophy"
    ],
    parts: [
      { id: "cornea", name: "Cornea", function: "Transparent dome refracting +43D focusing power.", clinicalNotes: ["Corneal ulceration"], relatedConditions: ["Keratoconus", "Fuchs Dystrophy"] },
      { id: "iris", name: "Iris", function: "Pigmented sphincter controlling pupil size.", clinicalNotes: ["Iridocyclitis"], relatedConditions: ["Aniridia", "Glaucoma"] },
      { id: "optic", name: "Optic Nerve", function: "Conducts 1.2 million ganglion axons to brain.", clinicalNotes: ["Papilledema in raised ICP"], relatedConditions: ["Optic Neuritis", "Glaucoma"] }
    ],
    illustrated: true,
    hotspots: [
      { id: "cornea", label: "Cornea", detail: "Transparent avascular dome providing 2/3 (+43D) of optical focusing power", position: [-0.94, 0.05, 1.47], color: "#6393d8" },
      { id: "iris", label: "Iris", detail: "Pigmented muscular diaphragm regulating pupil diameter & light entry", position: [-1.22, -0.53, 1.15], color: "#f2a33b" },
      { id: "optic", label: "Optic Nerve (CN II)", detail: "Cranial nerve II conducting ~1.2 million axon fibers to lateral geniculate nucleus", position: [1.61, -0.18, 0.54], color: "#d89bc4" }
    ],
    histology: {
      tissueType: "Specialized Neurosensory Epithelium",
      primaryCells: ["Photoreceptor Rods & Cones", "Bipolar Cells", "Ganglion Cells", "Müller Glia", "Retinal Pigment Epithelium (RPE)"],
      layers: ["10 Retinal Layers from RPE to Internal Limiting Membrane"],
      stain: "H&E with Rhodopsin immunohistochemistry",
      microscopicNote: "Retinal Pigment Epithelium (RPE) phagocytoses shed photoreceptor outer segments and regenerates 11-cis-retinal."
    },
    formulas: [
      { title: "Refractive Power (Diopters)", formula: "P = 1 / f (meters)", normalValue: "+60 Diopters total (+43D Cornea, +17D Lens)", description: "Measures light bending capability of corneal and lens optical media." }
    ],
    research: [
      { year: "1967", title: "Nobel Prize for Visual Phototransduction", researcher: "George Wald, Ragnar Granit, Haldan Hartline", summary: "Discovered the primary chemical and physiological visual processes in the eye.", impact: "Elucidated rhodopsin bleaching and vitamin A visual cycles." }
    ],
    flashcards: [
      { id: "e1", topic: "Anatomy", front: "Which region of the retina contains the highest density of cone cells for high-acuity vision?", back: "The Fovea Centralis within the macula." },
      { id: "e2", topic: "Physiology", front: "What chemical chromophore derived from Vitamin A binds opsin in photoreceptors?", back: "11-cis-retinal." },
      { id: "e3", topic: "Pathology", front: "What causes elevated Intraocular Pressure (IOP) in Glaucoma?", back: "Impaired drainage of aqueous humor through the Trabecular Meshwork." }
    ],
    quizQuestions: [
      { q: "Which optical component contributes ~43 diopters (two-thirds) of the eye's refractive power?", options: ["Crystalline Lens", "Cornea", "Vitreous Humor", "Retina"], correct: 1, explanation: "The steep curvature and air-cornea interface account for ~43D of focusing power." },
      { q: "Which photoreceptors mediate high-acuity color vision in daylight?", options: ["Rods", "Cones", "Ganglion Cells", "Amacrine Cells"], correct: 1, explanation: "Cones (L, M, S types) operate in bright light to convey detailed color vision." },
      { q: "What condition results from clouding of the crystalline lens proteins?", options: ["Glaucoma", "Cataracts", "Myopia", "Presbyopia"], correct: 1, explanation: "Cataracts involve cross-linking and opacification of lens crystallin proteins." },
      { q: "What cranial nerve conducts visual impulses from retinal ganglion cells to the brain?", options: ["CN I (Olfactory)", "CN II (Optic)", "CN V (Trigeminal)", "CN VIII (Vestibulocochlear)"], correct: 1, explanation: "CN II (Optic Nerve) conducts visual impulses from ganglion cell axons." }
    ],
    pharmacology: [
      { drugClass: "Prostaglandin Analogs (e.g. Latanoprost, Bimatoprost)", mechanism: "Increases uveoscleral outflow of aqueous humor via FP receptor activation.", clinicalIndication: "Primary Open-Angle Glaucoma & Ocular Hypertension" },
      { drugClass: "Anti-VEGF Agents (e.g. Ranibizumab, Aflibercept)", mechanism: "Binds & neutralizes Vascular Endothelial Growth Factor-A, preventing neovascular leakage.", clinicalIndication: "Wet Age-Related Macular Degeneration & Diabetic Retinopathy" }
    ],
    genetics: [
      { gene: "ABCA4", condition: "Stargardt Disease", mechanism: "Autosomal recessive mutation in retinal RIM protein causing lipofuscin accumulation in RPE." }
    ],
    lesson: {
      overview: "The eye is a precision optical instrument that focuses photons onto a delicate layer of neural photoreceptors.",
      physiology: "Light passes through cornea → pupil → crystalline lens → vitreous body to hit rods and cones, initiating phototransduction cascade.",
      clinical: "Cataracts involve clouding of crystalline lens proteins due to aging or UV damage, impairing visual clarity.",
      evolution: "Camera eyes evolved independently in vertebrates and cephalopods, demonstrating convergent evolutionary engineering.",
      steps: [
        { title: "Refraction", desc: "Cornea refracts light rays inward through aqueous chamber.", hotspotId: "cornea" },
        { title: "Aperture Control", desc: "Pupil adjusts diameter via iris muscle contraction.", hotspotId: "iris" },
        { title: "Phototransduction", desc: "Optic nerve carries visual signals to occipital lobe.", hotspotId: "optic" }
      ]
    }
  },

  {
    id: "intestine",
    name: "Intestine",
    scientificName: "Intestinum",
    system: "Digestive System",
    model: "/models/intestine.glb",
    icon: "§",
    accent: "#d78b77",
    description: "A folded digestive passage where nutrients are absorbed and the microbiome supports whole-body health.",
    poetic: "The inner garden",
    size: "Small: 6 m (20 ft), Large: 1.5 m (5 ft)",
    weight: "1.2–1.5 kg (empty)",
    location: "Abdominal & pelvic cavities below stomach and liver",
    function: "Enzymatic digestion, nutrient absorption, water reclamation & microbiome habitat",
    dailyFact: "Hosts ~100 trillion microbial symbionts forming the gut microbiome",
    medical: "Intestinal villi and microvilli expand mucosal surface area to roughly 32 m² for nutrient uptake.",
    bloodSupply: "Superior & Inferior Mesenteric Arteries",
    funFact: "The gut lining renews its entire epithelium every 3 to 5 days — the fastest turnover in the body.",
    tissue: "Simple Columnar Mucosa with Microvilli Brush Border",
    comparison: "Intestine vs. liver",
    conditions: [
      "Irritable Bowel Syndrome (IBS)",
      "Crohn's Disease & Ulcerative Colitis (IBD)",
      "Celiac Disease (Gluten Enteropathy)",
      "Diverticulitis & Diverticulosis",
      "Colorectal Adenomatous Polyps",
      "Intestinal Bowel Obstruction",
      "Ischemic Colitis",
      "Short Bowel Syndrome"
    ],
    parts: [
      { id: "duodenum", name: "Duodenum", function: "C-shaped loop receiving pancreatic juice and bile.", clinicalNotes: ["Duodenal ulceration"], relatedConditions: ["Peptic Ulcer Disease"] },
      { id: "jejunum", name: "Jejunum", function: "Primary nutrient absorption segment.", clinicalNotes: ["Tropical sprue"], relatedConditions: ["Celiac Disease"] },
      { id: "colon", name: "Colon", function: "Reclaims water and electrolytes forming feces.", clinicalNotes: ["Diverticular bleeding"], relatedConditions: ["Ulcerative Colitis", "Colorectal Cancer"] }
    ],
    illustrated: true,
    hotspots: [
      { id: "duodenum", label: "Duodenum", detail: "C-shaped 25 cm initial segment receiving pancreatic enzymes & bile", position: [0.6, 0.8, 0.75], color: "#f2a33b" },
      { id: "jejunum", label: "Jejunum", detail: "Primary 2.5 m nutrient absorption site with prominent plicae circulares", position: [-0.45, 0.1, 0.82], color: "#ee7c6a" },
      { id: "colon", label: "Colon (Large Intestine)", detail: "1.5 m segment reabsorbing water, sodium & consolidating feces", position: [0.75, -0.55, 0.72], color: "#6393d8" }
    ],
    histology: {
      tissueType: "Absorptive Simple Columnar Epithelium",
      primaryCells: ["Enterocytes (Microvilli Brush Border)", "Goblet Cells (Mucin)", "Paneth Cells (Antimicrobial Defensins)", "Enteroendocrine Cells"],
      layers: ["Mucosa", "Submucosa (Meissner Plexus)", "Muscularis Externa (Auerbach Myenteric Plexus)", "Serosa/Adventitia"],
      stain: "H&E with Alcian Blue for goblet cell mucins",
      microscopicNote: "Crypts of Lieberkühn house stem cells at base giving rise to enterocytes migrating up villi."
    },
    formulas: [
      { title: "Intestinal Transit Time", formula: "T_total = T_stomach + T_small + T_colon", normalValue: "24 – 72 hours total", description: "Time taken for food bolus to pass from mouth through large intestine." }
    ],
    research: [
      { year: "2007", title: "Human Microbiome Project", researcher: "NIH Consortium", summary: "Sequenced gut microbial genomes establishing the gut microbiome's role in immunity and metabolism.", impact: "Transformed gastroenterology and gut-brain axis research." }
    ],
    flashcards: [
      { id: "i1", topic: "Histology", front: "Which cells in small intestinal crypts secrete lysozyme and defensins?", back: "Paneth Cells." },
      { id: "i2", topic: "Physiology", front: "What intestinal motor pattern propels chyme forward using longitudinal smooth muscle?", back: "Peristalsis." },
      { id: "i3", topic: "Pathology", front: "Which autoimmune enteropathy is characterized by blunting of intestinal villi upon gluten exposure?", back: "Celiac Disease." }
    ],
    quizQuestions: [
      { q: "Where does the majority of nutrient absorption take place in the gastrointestinal tract?", options: ["Stomach", "Jejunum", "Colon", "Esophagus"], correct: 1, explanation: "The Jejunum features tall plicae circulares and dense villi optimized for nutrient absorption." },
      { q: "What microscopic projections on enterocytes form the 'brush border'?", options: ["Cilia", "Microvilli", "Flagella", "Haustra"], correct: 1, explanation: "Microvilli expand enterocyte membrane surface area 20-fold." },
      { q: "Which neuroplexus between circular and longitudinal muscle layers controls intestinal motility?", options: ["Meissner Submucosal Plexus", "Auerbach Myenteric Plexus", "Celiac Plexus", "Brachial Plexus"], correct: 1, explanation: "Auerbach's Myenteric Plexus governs intestinal peristalsis." },
      { q: "Which intestinal segment reabsorbs bile salts and Vitamin B12?", options: ["Duodenum", "Jejunum", "Terminal Ileum", "Descending Colon"], correct: 2, explanation: "The Terminal Ileum expresses specialized Na+-bile acid cotransporters and cubam complexes for B12." }
    ],
    pharmacology: [
      { drugClass: "Proton Pump Inhibitors (e.g. Omeprazole, Pantoprazole)", mechanism: "Irreversibly inhibits parietal cell H+/K+-ATPase proton pump, blocking acid secretion.", clinicalIndication: "GERD, Peptic Ulcer Disease, H. pylori eradication" },
      { drugClass: "Anti-TNF Biologics (e.g. Infliximab, Adalimumab)", mechanism: "Monoclonal antibody neutralizing soluble & membrane TNF-α cytokines.", clinicalIndication: "Moderate-Severe Crohn's Disease & Ulcerative Colitis" }
    ],
    genetics: [
      { gene: "NOD2 / CARD15", condition: "Crohn's Disease", mechanism: "Pattern recognition receptor mutation causing impaired intracellular bacterial clearance and ileal inflammation." },
      { gene: "APC gene", condition: "Familial Adenomatous Polyposis (FAP)", mechanism: "Loss of APC tumor suppressor causing uncontrolled β-catenin signaling, 1000s of adenomatous polyps, and 100% colon cancer risk." }
    ],
    lesson: {
      overview: "The intestinal tract spans the small intestine (duodenum, jejunum, ileum) for absorption and large intestine for water reclamation.",
      physiology: "Peristaltic smooth muscle contractions push chyme forward while brush border enzymes break down peptides and disaccharides.",
      clinical: "Inflammatory Bowel Disease (Crohn's / Ulcerative Colitis) causes chronic mucosal ulceration and systemic malabsorption.",
      evolution: "Elongated intestine length evolved in herbivores to allow microbial fermentation of complex plant cell wall cellulose.",
      steps: [
        { title: "Neutralization", desc: "Duodenum receives acidic chyme and mixes it with bile & pancreatic juice.", hotspotId: "duodenum" },
        { title: "Nutrient Absorption", desc: "Jejunum enterocytes absorb monosaccharides and amino acids.", hotspotId: "jejunum" },
        { title: "Water Reclamation", desc: "Colon reabsorbs water and electrolytes, forming feces.", hotspotId: "colon" }
      ]
    }
  },

  {
    id: "pancreas",
    name: "Pancreas",
    scientificName: "Pancreas",
    system: "Endocrine System",
    model: "/models/pancreas.glb",
    icon: "◈",
    accent: "#c69a5e",
    description: "A dual-purpose gland that releases digestive enzymes into the gut and the hormones that steady blood sugar.",
    poetic: "The quiet regulator",
    size: "15 × 3 × 2 cm",
    weight: "70–100 g",
    location: "Retroperitoneal space across C-loop of duodenum behind stomach",
    function: "Exocrine digestive enzyme secretion & Endocrine blood glucose regulation",
    dailyFact: "Secretes ~1.5 L of enzyme-rich alkaline pancreatic juice daily",
    medical: "Islets of Langerhans contain Alpha (Glucagon), Beta (Insulin), Delta (Somatostatin), & PP cells.",
    bloodSupply: "Splenic Artery & Pancreaticoduodenal Arteries",
    funFact: "Endocrine tissue (Islets of Langerhans) accounts for only 1-2% of total pancreatic mass.",
    tissue: "Exocrine Serous Acini & Endocrine Islets of Langerhans",
    comparison: "Pancreas vs. liver",
    conditions: [
      "Acute & Chronic Pancreatitis",
      "Type 1 Diabetes Mellitus (Autoimmune Beta-cell destruction)",
      "Type 2 Diabetes Mellitus (Insulin Resistance)",
      "Pancreatic Ductal Adenocarcinoma (PDAC)",
      "Exocrine Pancreatic Insufficiency (EPI)",
      "Pancreatic Pseudocysts",
      "Gallstone Pancreatitis",
      "Insulinoma & Glucagonoma"
    ],
    parts: [
      { id: "head", name: "Pancreatic Head", function: "Anchored in duodenal C-loop.", clinicalNotes: ["Head adenocarcinoma causes painless jaundice"], relatedConditions: ["PDAC"] },
      { id: "body", name: "Pancreatic Body", function: "Crosses L2 vertebra.", clinicalNotes: ["Pseudocyst formation"], relatedConditions: ["Pancreatitis"] },
      { id: "tail", name: "Pancreatic Tail", function: "Reaches splenic hilum, rich in islets.", clinicalNotes: ["Islet cell tumor"], relatedConditions: ["Insulinoma"] }
    ],
    illustrated: true,
    hotspots: [
      { id: "head", label: "Pancreatic Head", detail: "Expanded right segment nestled in C-curve of duodenum", position: [-1.32, -0.36, 0.55], color: "#ee7c6a" },
      { id: "body", label: "Pancreatic Body", detail: "Central horizontal segment crossing aorta and L2 vertebra", position: [0.05, 0.25, 0.45], color: "#f2a33b" },
      { id: "tail", label: "Pancreatic Tail", detail: "Left narrow tip reaching splenic hilum", position: [1.55, 0.3, 0.35], color: "#6393d8" },
      { id: "duct", label: "Main Pancreatic Duct", detail: "Duct of Wirsung conducting zymogens to ampulla of Vater", position: [-0.61, 0.39, 0.5], color: "#d89bc4" }
    ],
    histology: {
      tissueType: "Mixed Exocrine Acinar & Endocrine Islet Gland",
      primaryCells: ["Acinar Cells (Zymogen granules)", "Ductal Cells (HCO3- secretion)", "Beta Cells (Insulin 65%)", "Alpha Cells (Glucagon 20%)"],
      layers: ["Thin Connective Tissue Capsule", "Acinar Lobules", "Islets of Langerhans"],
      stain: "H&E with Aldehyde Fuchsin for beta-cell insulin granules",
      microscopicNote: "Centroacinar cells in acini initiate bicarbonate secretion to neutralize duodenal gastric acid."
    },
    formulas: [
      { title: "HOMA-IR (Insulin Resistance)", formula: "HOMA-IR = (Fasting Glucose × Fasting Insulin) / 405", normalValue: "< 1.0", description: "Assesses peripheral tissue insulin resistance." }
    ],
    research: [
      { year: "1921", title: "Discovery of Insulin", researcher: "Frederick Banting & Charles Best", summary: "Extracted insulin from pancreatic islets at the University of Toronto.", impact: "Transformed Type 1 Diabetes from a fatal illness to a manageable condition; earned 1923 Nobel Prize." }
    ],
    flashcards: [
      { id: "p1", topic: "Endocrinology", front: "Which pancreatic cell type secretes Glucagon to elevate blood glucose?", back: "Alpha Cells." },
      { id: "p2", topic: "Physiology", front: "What hormone released by duodenal S-cells stimulates pancreatic bicarbonate secretion?", back: "Secretin." },
      { id: "p3", topic: "Pathology", front: "What causes autodigestion of pancreatic parenchyma in Acute Pancreatitis?", back: "Premature activation of trypsinogen into trypsin inside acinar cells." }
    ],
    quizQuestions: [
      { q: "Which cell type in the Islets of Langerhans secretes Insulin?", options: ["Alpha Cells", "Beta Cells", "Delta Cells", "F Cells"], correct: 1, explanation: "Beta cells comprise 65-80% of islet cells and synthesize insulin." },
      { q: "What intestinal hormone stimulates pancreatic acinar cells to release digestive zymogens?", options: ["Secretin", "Cholecystokinin (CCK)", "Gastrin", "Ghrelin"], correct: 1, explanation: "CCK released by I-cells in response to fatty acids stimulates acinar enzyme secretion." },
      { q: "What inactive zymogen is activated by enteropeptidase on duodenal brush border?", options: ["Trypsinogen", "Pepsinogen", "Procarboxypeptidase", "Proelastase"], correct: 0, explanation: "Enteropeptidase cleaves trypsinogen to active trypsin, which then activates all other pancreatic zymogens." },
      { q: "What percentage of pancreatic tissue mass is dedicated to exocrine digestive secretion?", options: ["2%", "25%", "50%", "98%"], correct: 3, explanation: "98% of the pancreas consists of exocrine serous acini and duct systems." }
    ],
    pharmacology: [
      { drugClass: "Insulins (e.g. Lispro, Aspart, Glargine)", mechanism: "Binds transmembrane insulin receptor tyrosine kinase, stimulating GLUT4 translocation in muscle/adipose tissue.", clinicalIndication: "Type 1 Diabetes Mellitus, Advanced Type 2 Diabetes, Diabetic Ketoacidosis (DKA)" },
      { drugClass: "GLP-1 Receptor Agonists (e.g. Semaglutide, Tirzepatide)", mechanism: "Potentiates glucose-dependent insulin secretion, suppresses glucagon, and delays gastric emptying.", clinicalIndication: "Type 2 Diabetes, Obesity, ASCVD risk reduction" }
    ],
    genetics: [
      { gene: "PRSS1", condition: "Hereditary Pancreatitis", mechanism: "Mutation in cationic trypsinogen gene preventing auto-inactivation of trypsin and predisposing to chronic pancreatitis." },
      { gene: "KCNJ11", condition: "Neonatal Diabetes Mellitus", mechanism: "Gain-of-function mutation in ATP-sensitive K+ channel (Kir6.2) blocking insulin secretion." }
    ],
    lesson: {
      overview: "The pancreas is a heterocrine gland: 98% exocrine acinar tissue for digestive enzymes and 2% endocrine islets for hormone regulation.",
      physiology: "Acinar cells secrete trypsinogen, lipase, and amylase. Beta cells release insulin when blood glucose rises above 5 mmol/L.",
      clinical: "Type 1 Diabetes is caused by autoimmune T-cell destruction of pancreatic beta cells, resulting in absolute insulin deficiency.",
      evolution: "Pancreatic islet cells coalesced into discrete organ parenchyma in early gnathostomes to optimize blood glucose regulation.",
      steps: [
        { title: "Duodenal Anchorage", desc: "Pancreatic head fits tightly into C-loop of duodenum.", hotspotId: "head" },
        { title: "Zymogen Synthesis", desc: "Acinar cells produce digestive zymogens in inactive state.", hotspotId: "body" },
        { title: "Bicarbonate Secretion", desc: "Main pancreatic duct conducts alkaline juice to duodenal papilla.", hotspotId: "duct" }
      ]
    }
  },

  {
    id: "skin",
    name: "Skin",
    scientificName: "Integumentum",
    system: "Integumentary System",
    model: "/models/skin.glb",
    icon: "▦",
    accent: "#c99277",
    description: "The body’s largest organ — a living barrier that senses touch, holds in water, and regulates temperature.",
    poetic: "The living boundary",
    size: "1.5–2.0 m² (16–22 sq ft) surface area",
    weight: "3.5–5.0 kg (15% of total body weight)",
    location: "External integumentary envelope covering whole body",
    function: "Barrier defense, thermoregulation, tactile sensation, water retention & Vitamin D3 photobiosynthesis",
    dailyFact: "Sheds ~30,000 to 40,000 dead epidermal keratinocytes every minute",
    medical: "Comprises Epidermis (avascular stratum corneum barrier), Dermis (collagen/elastin vasculo-nerve matrix), & Hypodermis.",
    bloodSupply: "Subcutaneous Plexus & Deep/Superficial Dermal Vascular Networks",
    funFact: "Houses over 1,000 species of commensal bacteria forming the skin microbiome defense barrier.",
    tissue: "Keratinized Stratified Squamous Epithelium & Dense Irregular Dermis",
    comparison: "Skin vs. intestine",
    conditions: [
      "Atopic Dermatitis (Eczema)",
      "Psoriasis Vulgaris",
      "Malignant Melanoma",
      "Basal & Squamous Cell Carcinomas",
      "Acne Vulgaris",
      "Cellulitis & Bacterial Pyoderma",
      "Contact Dermatitis",
      "Vitiligo"
    ],
    parts: [
      { id: "epidermis", name: "Epidermis", function: "Avascular keratinized barrier layer.", clinicalNotes: ["Staphylococcal Scalded Skin Syndrome"], relatedConditions: ["Psoriasis", "Basal Cell Carcinoma"] },
      { id: "dermis", name: "Dermis", function: "Dense connective layer housing mechanoreceptors and blood vessels.", clinicalNotes: ["Ehlers-Danlos collagen defect"], relatedConditions: ["Cellulitis", "Dermatofibroma"] },
      { id: "hypodermis", name: "Hypodermis", function: "Subcutaneous adipose insulation and shock absorption.", clinicalNotes: ["Panniculitis"], relatedConditions: ["Lipoma"] }
    ],
    illustrated: true,
    hotspots: [
      { id: "epidermis", label: "Epidermis", detail: "Avascular outer epithelial barrier (stratum basale to stratum corneum)", position: [-0.05, 0.88, 1.4], color: "#ee7c6a" },
      { id: "dermis", label: "Dermis", detail: "Vascular connective layer housing Meissner/Pacinian corpuscles & collagen", position: [0.29, 0.05, 1.4], color: "#f2a33b" },
      { id: "hypodermis", label: "Hypodermis", detail: "Subcutaneous panniculus adiposus providing thermal insulation & cushioning", position: [-0.39, -1.15, 1.4], color: "#6393d8" },
      { id: "follicle", label: "Hair Follicle & Sebaceous Gland", detail: "Pilosebaceous unit anchoring hair shaft and secreting sebum", position: [0.89, -0.44, 1.4], color: "#d89bc4" }
    ],
    histology: {
      tissueType: "Keratinized Stratified Squamous Epithelium",
      primaryCells: ["Keratinocytes (90%)", "Melanocytes (Pigment)", "Langerhans Cells (Dendritic Antigen-Presenting)", "Merkel Cells (Mechanoreceptor)"],
      layers: ["Stratum Basale", "Stratum Spinosum", "Stratum Granulosum", "Stratum Lucidum (thick skin)", "Stratum Corneum"],
      stain: "H&E with Fontana-Masson stain for melanin",
      microscopicNote: "Desmosomes (desmoglein 1 & 3) tightly bind keratinocytes in stratum spinosum to resist shearing stress."
    },
    formulas: [
      { title: "Body Surface Area (BSA - Mosteller)", formula: "BSA = sqrt((Height_cm × Weight_kg) / 3600)", normalValue: "1.73 m²", description: "Standard clinical calculation for drug dosing and burn assessment (Wallace Rule of Nines)." }
    ],
    research: [
      { year: "2011", title: "Discovery of Ipilimumab Melanoma Immunotherapy", researcher: "James P. Allison", summary: "Pioneered immune checkpoint blockage targeting CTLA-4 to treat advanced melanoma.", impact: "Earned 2018 Nobel Prize in Medicine and launched cancer immunotherapy." }
    ],
    flashcards: [
      { id: "s1", topic: "Histology", front: "Which epidermal cell layer contains mitotic stem cells attached to basement membrane?", back: "Stratum Basale." },
      { id: "s2", topic: "Physiology", front: "What radiation type photolyzes 7-dehydrocholesterol into provitamin D3 in skin?", back: "Ultraviolet B (UVB) light." },
      { id: "s3", topic: "Immunology", front: "What bone-marrow derived dendritic cells present antigens in the epidermis?", back: "Langerhans Cells." }
    ],
    quizQuestions: [
      { q: "Which pigment produced by melanocytes protects keratinocyte DNA from UV radiation?", options: ["Keratin", "Melanin", "Carotene", "Hemoglobin"], correct: 1, explanation: "Melanin caps supranuclear DNA in keratinocytes, absorbing UV radiation." },
      { q: "Which layer contains sensory corpuscles, capillary networks, and hair follicles?", options: ["Epidermis", "Dermis", "Hypodermis", "Stratum Corneum"], correct: 1, explanation: "The Dermis is a dense collagenous layer housing sensory receptors and microvasculature." },
      { q: "What mechanoreceptor in the dermal papillae detects light touch and low-frequency vibration?", options: ["Pacinian Corpuscle", "Meissner Corpuscle", "Ruffini Ending", "Free Nerve Ending"], correct: 1, explanation: "Meissner corpuscles in dermal papillae respond to rapid light tactile stimulation." },
      { q: "What vitamin is synthesized in skin upon exposure to solar UVB radiation?", options: ["Vitamin A", "Vitamin C", "Vitamin D3", "Vitamin K"], correct: 2, explanation: "Solar UVB photolyzes 7-dehydrocholesterol in stratum basale into previtamin D3." }
    ],
    pharmacology: [
      { drugClass: "Topical Retinoids (e.g. Tretinoin, Adapalene)", mechanism: "Binds nuclear retinoic acid receptors (RARs), normalizing follicular epithelial differentiation & desquamation.", clinicalIndication: "Acne Vulgaris, Photoaging, Plaque Psoriasis" },
      { drugClass: "BRAF Inhibitors (e.g. Vemurafenib, Dabrafenib)", mechanism: "Competitive inhibitor of mutated BRAF V600E kinase, blocking downstream MAPK/ERK cell proliferation.", clinicalIndication: "Unresectable or Metastatic Melanoma with BRAF V600E mutation" }
    ],
    genetics: [
      { gene: "FLG (Filaggrin)", condition: "Atopic Dermatitis & Ichthyosis Vulgaris", mechanism: "Loss-of-function mutation causing defective epidermal barrier function, elevated transepidermal water loss, and allergen sensitization." },
      { gene: "BRAF V600E", condition: "Cutaneous Malignant Melanoma", mechanism: "Somatic missense mutation (valine to glutamate at codon 600) causing constitutive MAPK pathway signaling." }
    ],
    lesson: {
      overview: "Skin comprises three distinct structural layers: Epidermis (barrier), Dermis (structural support & sensation), and Hypodermis (adipose cushion).",
      physiology: "Thermoregulation operates via dermal vasodilation/vasoconstriction and sweat evaporation. Keratinocytes produce waterproof lipid barriers.",
      clinical: "Malignant Melanoma is an aggressive skin cancer originating in melanocytes, triggered by intermittent intense UV exposure.",
      evolution: "Skin keratinization evolved in early tetrapods to prevent desiccation during the Devonian terrestrial transition.",
      steps: [
        { title: "Epidermal Barrier", desc: "Keratinocytes migrate upward, producing tough keratin.", hotspotId: "epidermis" },
        { title: "Dermal Sensation", desc: "Meissner and Pacinian corpuscles detect tactile stimuli.", hotspotId: "dermis" },
        { title: "Subcutaneous Insulation", desc: "Subcutaneous fat in hypodermis insulates against heat loss.", hotspotId: "hypodermis" }
      ]
    }
  }
];

export const organById = Object.fromEntries(organs.map((organ) => [organ.id, organ])) as Record<OrganId, Organ>;
