/**
 * Build a seed drug catalog based on WHO Essential Medicines List (23rd edition, 2023)
 * and common Nigerian pharmacy stock.
 *
 * Run AFTER fetch-lagos-pharmacies.js:
 *   node scripts/seed-drug-catalog.js
 *
 * Output: scripts/data/drug_seed.sql
 *
 * Inserts:
 *   - drugs table (generic name, category, dosage form, is_common)
 *   - pharmacy_stock junction (random subset assigned to each pharmacy from lagos_pharmacies_osm.csv)
 *
 * All seed records flagged is_seed_data = 1 so launch-day cleanup is:
 *   DELETE FROM pharmacy_stock WHERE is_seed_data = 1;
 *   DELETE FROM drugs WHERE is_seed_data = 1;
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CSV_IN  = path.join(__dirname, 'data', 'lagos_pharmacies_osm.csv')
const SQL_OUT = path.join(__dirname, 'data', 'drug_seed.sql')

/* WHO EML 23rd edition (2023) — core medicines relevant to Nigerian retail pharmacy */
const DRUGS = [
  // Analgesics & NSAIDs
  { drug_name: 'Paracetamol 500mg',           category: 'Analgesic',         dosage_form: 'tablet',    price_range: '₦150–₦300'  },
  { drug_name: 'Ibuprofen 400mg',              category: 'NSAID',             dosage_form: 'tablet',    price_range: '₦250–₦500'  },
  { drug_name: 'Diclofenac 50mg',              category: 'NSAID',             dosage_form: 'tablet',    price_range: '₦300–₦600'  },
  { drug_name: 'Aspirin 75mg',                 category: 'Antiplatelet',      dosage_form: 'tablet',    price_range: '₦200–₦400'  },
  { drug_name: 'Tramadol 50mg',                category: 'Opioid Analgesic',  dosage_form: 'capsule',   price_range: '₦500–₦900'  },
  { drug_name: 'Codeine Phosphate 30mg',       category: 'Opioid Analgesic',  dosage_form: 'tablet',    price_range: '₦600–₦1200' },

  // Antibiotics
  { drug_name: 'Amoxicillin 500mg',            category: 'Antibiotic',        dosage_form: 'capsule',   price_range: '₦600–₦1000' },
  { drug_name: 'Augmentin 625mg',              category: 'Antibiotic',        dosage_form: 'tablet',    price_range: '₦1800–₦2800' },
  { drug_name: 'Ciprofloxacin 500mg',          category: 'Antibiotic',        dosage_form: 'tablet',    price_range: '₦1200–₦2000' },
  { drug_name: 'Metronidazole 200mg',          category: 'Antibiotic',        dosage_form: 'tablet',    price_range: '₦150–₦400'  },
  { drug_name: 'Azithromycin 500mg',           category: 'Antibiotic',        dosage_form: 'tablet',    price_range: '₦800–₦1500' },
  { drug_name: 'Doxycycline 100mg',            category: 'Antibiotic',        dosage_form: 'capsule',   price_range: '₦300–₦700'  },
  { drug_name: 'Ceftriaxone 1g Injection',     category: 'Antibiotic',        dosage_form: 'injection', price_range: '₦1500–₦3000' },
  { drug_name: 'Flucloxacillin 500mg',         category: 'Antibiotic',        dosage_form: 'capsule',   price_range: '₦400–₦800'  },
  { drug_name: 'Erythromycin 500mg',           category: 'Antibiotic',        dosage_form: 'tablet',    price_range: '₦400–₦900'  },

  // Antimalarials
  { drug_name: 'Artemether-Lumefantrine 80/480mg', category: 'Antimalarial', dosage_form: 'tablet',    price_range: '₦800–₦1800' },
  { drug_name: 'Chloroquine Phosphate 250mg',  category: 'Antimalarial',     dosage_form: 'tablet',    price_range: '₦200–₦500'  },
  { drug_name: 'Quinine Sulfate 300mg',        category: 'Antimalarial',     dosage_form: 'tablet',    price_range: '₦300–₦700'  },

  // Cardiovascular
  { drug_name: 'Amlodipine 5mg',              category: 'Antihypertensive',  dosage_form: 'tablet',    price_range: '₦700–₦1200' },
  { drug_name: 'Lisinopril 10mg',             category: 'Antihypertensive',  dosage_form: 'tablet',    price_range: '₦800–₦1500' },
  { drug_name: 'Losartan 50mg',               category: 'Antihypertensive',  dosage_form: 'tablet',    price_range: '₦600–₦1200' },
  { drug_name: 'Atenolol 50mg',               category: 'Beta-blocker',      dosage_form: 'tablet',    price_range: '₦300–₦700'  },
  { drug_name: 'Hydrochlorothiazide 25mg',    category: 'Diuretic',          dosage_form: 'tablet',    price_range: '₦200–₦500'  },
  { drug_name: 'Furosemide 40mg',             category: 'Diuretic',          dosage_form: 'tablet',    price_range: '₦150–₦400'  },
  { drug_name: 'Simvastatin 20mg',            category: 'Statin',            dosage_form: 'tablet',    price_range: '₦500–₦1000' },
  { drug_name: 'Atorvastatin 20mg',           category: 'Statin',            dosage_form: 'tablet',    price_range: '₦600–₦1200' },

  // Diabetes
  { drug_name: 'Metformin 850mg',             category: 'Antidiabetic',      dosage_form: 'tablet',    price_range: '₦800–₦1500' },
  { drug_name: 'Glibenclamide 5mg',           category: 'Antidiabetic',      dosage_form: 'tablet',    price_range: '₦200–₦500'  },
  { drug_name: 'Insulin Actrapid 100IU/ml',   category: 'Antidiabetic',      dosage_form: 'injection', price_range: '₦12000–₦20000' },
  { drug_name: 'Insulin Mixtard 30/70',       category: 'Antidiabetic',      dosage_form: 'injection', price_range: '₦10000–₦18000' },

  // GI / Stomach
  { drug_name: 'Omeprazole 20mg',             category: 'Proton Pump Inhibitor', dosage_form: 'capsule', price_range: '₦500–₦1000' },
  { drug_name: 'Antacid (Aluminum Hydroxide)', category: 'Antacid',          dosage_form: 'tablet',    price_range: '₦150–₦400'  },
  { drug_name: 'Oral Rehydration Salts',      category: 'Electrolyte',       dosage_form: 'powder',    price_range: '₦100–₦300'  },
  { drug_name: 'Loperamide 2mg',              category: 'Antidiarrheal',     dosage_form: 'tablet',    price_range: '₦200–₦500'  },
  { drug_name: 'Buscopan 10mg',               category: 'Antispasmodic',     dosage_form: 'tablet',    price_range: '₦300–₦700'  },

  // Respiratory
  { drug_name: 'Salbutamol 4mg',              category: 'Bronchodilator',    dosage_form: 'tablet',    price_range: '₦200–₦500'  },
  { drug_name: 'Salbutamol Inhaler 100mcg',   category: 'Bronchodilator',    dosage_form: 'inhaler',   price_range: '₦1500–₦3000' },
  { drug_name: 'Prednisolone 5mg',            category: 'Corticosteroid',    dosage_form: 'tablet',    price_range: '₦150–₦400'  },
  { drug_name: 'Cetirizine 10mg',             category: 'Antihistamine',     dosage_form: 'tablet',    price_range: '₦150–₦400'  },
  { drug_name: 'Loratadine 10mg',             category: 'Antihistamine',     dosage_form: 'tablet',    price_range: '₦200–₦500'  },

  // Vitamins / Supplements
  { drug_name: 'Folic Acid 5mg',              category: 'Vitamin',           dosage_form: 'tablet',    price_range: '₦100–₦300'  },
  { drug_name: 'Ferrous Sulphate 200mg',      category: 'Iron Supplement',   dosage_form: 'tablet',    price_range: '₦150–₦400'  },
  { drug_name: 'Vitamin C 500mg',             category: 'Vitamin',           dosage_form: 'tablet',    price_range: '₦150–₦400'  },
  { drug_name: 'Vitamin B Complex',           category: 'Vitamin',           dosage_form: 'tablet',    price_range: '₦200–₦600'  },
  { drug_name: 'Zinc Sulfate 20mg',           category: 'Mineral Supplement', dosage_form: 'tablet',   price_range: '₦200–₦500'  },

  // IV / Hospital
  { drug_name: 'IV Normal Saline 500ml',      category: 'IV Fluid',          dosage_form: 'infusion',  price_range: '₦1200–₦2000' },
  { drug_name: 'IV Dextrose 5% 500ml',        category: 'IV Fluid',          dosage_form: 'infusion',  price_range: '₦1200–₦2000' },
  { drug_name: 'Ringers Lactate 500ml',       category: 'IV Fluid',          dosage_form: 'infusion',  price_range: '₦1500–₦2500' },

  // Skin / Topical
  { drug_name: 'Hydrocortisone Cream 1%',     category: 'Topical Steroid',   dosage_form: 'cream',     price_range: '₦300–₦700'  },
  { drug_name: 'Clotrimazole Cream 1%',       category: 'Antifungal',        dosage_form: 'cream',     price_range: '₦400–₦900'  },
  { drug_name: 'Gentian Violet Solution',     category: 'Antiseptic',        dosage_form: 'solution',  price_range: '₦150–₦400'  },

  // Reproductive / Women's Health
  { drug_name: 'Misoprostol 200mcg',          category: 'Prostaglandin',     dosage_form: 'tablet',    price_range: '₦500–₦1200' },
  { drug_name: 'Combined Oral Contraceptive', category: 'Contraceptive',     dosage_form: 'tablet',    price_range: '₦300–₦800'  },
  { drug_name: 'Progesterone-only Pill',      category: 'Contraceptive',     dosage_form: 'tablet',    price_range: '₦300–₦700'  },
]

/* Nigerian brand name cross-reference (partial — common NAFDAC-registered brands) */
const BRAND_MAP = {
  'Paracetamol 500mg':            'Panadol, Emzor Paracetamol',
  'Ibuprofen 400mg':              'Advil, Nurofen, Emvil',
  'Amoxicillin 500mg':            'Amoxil, Ranmoxy, Clomox',
  'Augmentin 625mg':              'Augmentin (GSK), Clavulin',
  'Ciprofloxacin 500mg':          'Ciprobay, Cifran, Ciplox',
  'Metronidazole 200mg':          'Flagyl, Metrozol',
  'Azithromycin 500mg':           'Zithromax, Azee, Azibact',
  'Artemether-Lumefantrine 80/480mg': 'Coartem, Lonart, Lumartem',
  'Amlodipine 5mg':               'Norvasc, Amlogard, Stamlo',
  'Metformin 850mg':              'Glucophage, Formet, Metrol',
  'Insulin Actrapid 100IU/ml':    'Actrapid (Novo Nordisk), Humulin R',
  'Omeprazole 20mg':              'Losec, Prilosec, Omecap',
  'Salbutamol Inhaler 100mcg':    'Ventolin, Salamol, Asthalin',
  'Cetirizine 10mg':              'Zyrtec, Cetril, Allercet',
}

function parseCsvPharmacies() {
  if (!fs.existsSync(CSV_IN)) {
    console.warn(`Warning: ${CSV_IN} not found. Run fetch-lagos-pharmacies.js first.`)
    console.warn('Generating SQL without pharmacy stock assignments...')
    return []
  }
  const lines = fs.readFileSync(CSV_IN, 'utf8').trim().split('\n').slice(1) // skip header
  return lines.slice(0, 200).map((line, i) => {
    const parts = line.split(',')
    return { id: i + 1, name: parts[0] || `Pharmacy ${i + 1}` }
  })
}

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }
function escape(s) { return String(s || '').replace(/'/g, "''") }

function main() {
  const pharmacies = parseCsvPharmacies()
  const lines = []

  lines.push('-- PharmaConnect Drug Catalog Seed')
  lines.push('-- Generated from WHO EML 23rd edition (2023) + Nigerian brand cross-reference')
  lines.push('-- DELETE FROM pharmacy_stock WHERE is_seed_data = 1; to clean on launch\n')

  lines.push('CREATE TABLE IF NOT EXISTS drugs (')
  lines.push('  id INTEGER PRIMARY KEY AUTOINCREMENT,')
  lines.push('  drug_name TEXT NOT NULL,')
  lines.push('  category TEXT,')
  lines.push('  dosage_form TEXT,')
  lines.push('  price_range TEXT,')
  lines.push('  brand_names TEXT,')
  lines.push('  is_common INTEGER DEFAULT 1,')
  lines.push('  is_seed_data INTEGER DEFAULT 1')
  lines.push(');\n')

  lines.push('CREATE TABLE IF NOT EXISTS pharmacy_stock (')
  lines.push('  id INTEGER PRIMARY KEY AUTOINCREMENT,')
  lines.push('  pharmacy_id INTEGER NOT NULL,')
  lines.push('  drug_id INTEGER NOT NULL,')
  lines.push('  stock_quantity INTEGER DEFAULT 0,')
  lines.push('  status TEXT DEFAULT "In Stock",')
  lines.push('  is_seed_data INTEGER DEFAULT 1')
  lines.push(');\n')

  // Drug inserts
  for (const d of DRUGS) {
    const brands = BRAND_MAP[d.drug_name] || ''
    lines.push(`INSERT INTO drugs (drug_name,category,dosage_form,price_range,brand_names,is_common,is_seed_data) VALUES ('${escape(d.drug_name)}','${escape(d.category)}','${escape(d.dosage_form)}','${escape(d.price_range)}','${escape(brands)}',1,1);`)
  }

  lines.push('')

  // Pharmacy stock — assign random subset to each pharmacy
  if (pharmacies.length > 0) {
    for (const pharm of pharmacies) {
      const subset = [...DRUGS].sort(() => Math.random() - 0.5).slice(0, rand(15, 35))
      for (let i = 0; i < subset.length; i++) {
        const drugId = DRUGS.indexOf(subset[i]) + 1
        const qty = rand(0, 200)
        const status = qty === 0 ? 'Out of Stock' : qty < 20 ? 'Low Stock' : 'In Stock'
        lines.push(`INSERT INTO pharmacy_stock (pharmacy_id,drug_id,stock_quantity,status,is_seed_data) VALUES (${pharm.id},${drugId},${qty},'${status}',1);`)
      }
    }
  }

  fs.writeFileSync(SQL_OUT, lines.join('\n'), 'utf8')

  console.log(`Drug catalog seed written to: ${SQL_OUT}`)
  console.log(`Total drugs              : ${DRUGS.length}`)
  console.log(`Drugs with brand names   : ${Object.keys(BRAND_MAP).length}`)
  console.log(`Pharmacies seeded        : ${pharmacies.length}`)
  console.log(`\nCleanup command (run at launch):`)
  console.log(`  DELETE FROM pharmacy_stock WHERE is_seed_data = 1;`)
  console.log(`  DELETE FROM drugs WHERE is_seed_data = 1;`)
}

main()
