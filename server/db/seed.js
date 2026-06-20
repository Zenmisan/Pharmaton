export function seed(db) {
  const insertUser = db.prepare(`INSERT INTO users (uid,email,name,role,org_name,location,license_number) VALUES (?,?,?,?,?,?,?)`)
  const patient    = insertUser.run('demo-uid-amara', 'amara@example.com', 'Amara Okonkwo', 'patient', null, 'Surulere, Lagos', null)
  const pharmacist = insertUser.run('demo-uid-grace', 'grace@example.com', 'Grace Adeyemi', 'pharmacist', 'Grace Pharmacy', 'Surulere, Lagos', 'PCN/2019/00231')

  const insertPharmacy = db.prepare(`INSERT INTO pharmacies (owner_user_id,name,type,location,lat,lng,phone,nafdac_verified,rating,hours,review_count) VALUES (?,?,?,?,?,?,?,?,?,?,?)`)

  const pharm1 = insertPharmacy.run(pharmacist.lastInsertRowid, 'Grace Pharmacy', 'pharmacy', 'Surulere, Lagos', 6.4926, 3.3552, '+2348012345001', 1, 4.8, 'Mon-Sat 8AM-9PM, Sun 10AM-6PM', 214)

  const realPharmacies = [
    ['HealthPlus Pharmacy VI',         'pharmacy', 'Victoria Island, Lagos',  6.4281, 3.4219, '+2341277500',    1, 4.7, 'Daily 8AM-9PM',        312],
    ['Roche Pharmacy',                  'pharmacy', 'Victoria Island, Lagos',  6.4310, 3.4200, '+2348023000100', 1, 4.6, 'Mon-Sat 8AM-8PM',      178],
    ['Quintessence Pharmacy',           'pharmacy', 'Ikoyi, Lagos',            6.4540, 3.4407, '+2348033001200', 1, 4.8, 'Mon-Sat 9AM-7PM',      203],
    ['Pharmarun VI',                    'pharmacy', 'Victoria Island, Lagos',  6.4295, 3.4185, '+2348100200300', 1, 4.5, 'Daily 8AM-10PM',        89],
    ['HealthPlus Pharmacy Lekki',      'pharmacy', 'Lekki Phase 1, Lagos',    6.4698, 3.5620, '+2348055001100', 1, 4.7, 'Daily 8AM-9PM',        267],
    ['Pharmarun Lekki',                 'pharmacy', 'Lekki Phase 1, Lagos',    6.4650, 3.5700, '+2348100200301', 1, 4.6, 'Daily 8AM-10PM',       142],
    ['Sterling Pharmacy Lekki',         'pharmacy', 'Lekki Phase 1, Lagos',    6.4640, 3.5810, '+2348077003300', 1, 4.5, 'Mon-Sat 8AM-9PM',       97],
    ['Pinnacle Pharmacy Ajah',          'pharmacy', 'Ajah, Lagos',             6.4688, 3.6000, '+2348088004400', 1, 4.3, 'Mon-Sat 8AM-8PM',       61],
    ['MedPlus Pharmacy Lekki',          'pharmacy', 'Lekki Phase 2, Lagos',    6.4720, 3.5950, '+2348044002200', 1, 4.6, 'Daily 8AM-9PM',        184],
    ['MedPlus Pharmacy Ikeja',          'pharmacy', 'Ikeja, Lagos',            6.6018, 3.3515, '+2341279300',    1, 4.6, 'Daily 8AM-9PM',        298],
    ['Drugfield Pharmacy Ikeja',        'pharmacy', 'Ikeja, Lagos',            6.6050, 3.3490, '+2348099005500', 1, 4.4, 'Mon-Sat 8AM-8PM',      113],
    ['First Medicare Pharmacy',         'pharmacy', 'Ikeja, Lagos',            6.6000, 3.3800, '+2348066001100', 1, 4.5, 'Mon-Sat 8AM-9PM',      155],
    ['Pharmacy One Ikeja GRA',          'pharmacy', 'Ikeja GRA, Lagos',        6.6100, 3.3600, '+2348077002200', 1, 4.4, 'Mon-Sat 8AM-8PM',       88],
    ['Well Pharmacy Maryland',          'pharmacy', 'Maryland, Lagos',         6.5660, 3.3650, '+2348088005500', 1, 4.3, 'Mon-Sat 8AM-8PM',       72],
    ['JMB Pharmacy Ojota',              'pharmacy', 'Ojota, Lagos',            6.6000, 3.3780, '+2348099006600', 1, 4.2, 'Daily 7AM-9PM',         54],
    ['HealthPlus Pharmacy Surulere',   'pharmacy', 'Surulere, Lagos',         6.4980, 3.3610, '+2348012345002', 1, 4.6, 'Daily 8AM-9PM',        128],
    ['CarePoint Pharmacy',              'pharmacy', 'Surulere, Lagos',         6.4900, 3.3580, '+2348012345003', 1, 4.5, 'Mon-Sat 8AM-8PM',       89],
    ['Total Health Trust Surulere',     'pharmacy', 'Surulere, Lagos',         6.4920, 3.3565, '+2348044001100', 1, 4.5, 'Mon-Sat 8AM-9PM',      103],
    ['Family Medicare Pharmacy Yaba',   'pharmacy', 'Yaba, Lagos',             6.5095, 3.3711, '+2348012345004', 1, 4.3, 'Daily 7AM-10PM',        47],
    ['Sunrise Pharmacy Yaba',           'pharmacy', 'Yaba, Lagos',             6.5100, 3.3750, '+2348066002200', 1, 4.2, 'Mon-Sat 8AM-8PM',       39],
    ['Alpha Pharmacy Lagos Island',     'pharmacy', 'Lagos Island, Lagos',     6.4541, 3.3947, '+2348033002200', 1, 4.6, 'Mon-Sat 8AM-8PM',      167],
    ['City Pharmacy CMS',               'pharmacy', 'Lagos Island, Lagos',     6.4480, 3.3990, '+2348044003300', 1, 4.4, 'Mon-Sat 8AM-7PM',       92],
    ['Optimal Pharmacy Gbagada',        'pharmacy', 'Gbagada, Lagos',          6.5667, 3.3833, '+2348066003300', 1, 4.4, 'Mon-Sat 8AM-8PM',       81],
    ['Guardian Pharmacy Magodo',        'pharmacy', 'Magodo, Lagos',           6.6167, 3.3700, '+2348077004400', 1, 4.5, 'Mon-Sat 8AM-9PM',      118],
    ['Westend Pharmacy Agege',          'pharmacy', 'Agege, Lagos',            6.6163, 3.3223, '+2348088006600', 0, 4.1, 'Mon-Sat 7AM-9PM',       43],
    ['Femi Johnson Pharmacy Apapa',     'pharmacy', 'Apapa, Lagos',            6.4478, 3.3625, '+2348099007700', 1, 4.3, 'Mon-Sat 8AM-7PM',       57],
  ]

  const pharmIds = [pharm1.lastInsertRowid]
  for (const [name, type, location, lat, lng, phone, nafdac, rating, hours, review_count] of realPharmacies) {
    const r = insertPharmacy.run(null, name, type, location, lat, lng, phone, nafdac, rating, hours, review_count)
    pharmIds.push(r.lastInsertRowid)
  }

  const insertInv = db.prepare(`INSERT INTO inventory (pharmacy_id,name,stock,price,expiry,status) VALUES (?,?,?,?,?,?)`)
  const meds = [
    ['Amoxicillin 500mg',      240, 'N800',    'Dec 2026'],
    ['Paracetamol 500mg',       18, 'N200',    'Mar 2027'],
    ['Augmentin 625mg',          0, 'N2400',   null      ],
    ['Metformin 850mg',        120, 'N1200',   'Jun 2027'],
    ['Amlodipine 5mg',           5, 'N950',    'Jan 2027'],
    ['Lisinopril 10mg',         80, 'N1100',   'Sep 2027'],
    ['Diclofenac 50mg',          3, 'N450',    'Nov 2026'],
    ['Omeprazole 20mg',          0, 'N750',    null      ],
    ['Ciprofloxacin 500mg',     60, 'N1800',   'Aug 2027'],
    ['Ibuprofen 400mg',         35, 'N300',    'Oct 2026'],
    ['Insulin Actrapid 100IU',  12, 'N18000',  'May 2027'],
    ['IV Normal Saline 500ml',  80, 'N1500',   'Jul 2027'],
  ]

  for (const pid of pharmIds) {
    for (const [name, stock, price, expiry] of meds) {
      const jitter = Math.max(0, stock + Math.floor(Math.random() * 20) - 10)
      const st = jitter === 0 ? 'Out of Stock' : jitter < 15 ? 'Low Stock' : 'In Stock'
      insertInv.run(pid, name, jitter, price, expiry || '-', st)
    }
  }

  const insertAlert = db.prepare(`INSERT INTO alerts (type,title,body,tag,read) VALUES (?,?,?,?,?)`)
  insertAlert.run('recall',       'NAFDAC Recall Notice',   'Batch #A2341 of Paracetamol 500mg recalled due to quality concerns.',  'Recall',   0)
  insertAlert.run('shortage',     'Shortage Alert',          'Insulin Actrapid 100IU experiencing nationwide shortage risk.',        'Shortage', 0)
  insertAlert.run('packaging',    'Packaging Update',        'Augmentin 625mg packaging updated by manufacturer GSK.',              'Update',   0)
  insertAlert.run('safety',       'Safety Clearance',        'Metformin 850mg batch #M9921 cleared for distribution.',             'Safety',   0)
  insertAlert.run('supply',       'Supply Notification',     'New stock of IV Normal Saline arriving this week.',                   'Supply',   0)
  insertAlert.run('verification', 'Verification Required',   'Verify your PCN license to maintain Verified Partner status.',       'Action',   0)
}
