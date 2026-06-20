export function seed(db) {
  const insertUser = db.prepare(`INSERT INTO users (uid,email,name,role,org_name,location,license_number) VALUES (?,?,?,?,?,?,?)`)
  const patient    = insertUser.run('demo-uid-amara', 'amara@example.com', 'Amara Okonkwo', 'patient', null, 'Surulere, Lagos', null)
  const pharmacist = insertUser.run('demo-uid-grace', 'grace@example.com', 'Grace Adeyemi', 'pharmacist', 'Grace Pharmacy', 'Surulere, Lagos', 'PCN/2019/00231')

  const insertPharmacy = db.prepare(`INSERT INTO pharmacies (owner_user_id,name,type,location,lat,lng,phone,nafdac_verified,rating,hours,review_count) VALUES (?,?,?,?,?,?,?,?,?,?,?)`)

  // Demo pharmacist pharmacy
  const pharm1 = insertPharmacy.run(pharmacist.lastInsertRowid, 'Grace Pharmacy', 'pharmacy', 'Surulere, Lagos', 6.4926, 3.3552, '+2348012345001', 1, 4.8, 'Mon-Sat 8AM-9PM, Sun 10AM-6PM', 214)

  // Real Lagos pharmacies — sourced from OpenStreetMap (OSM), lat/lng verified
  const realPharmacies = [
    // Victoria Island
    ['Chemart Pharmacy',              'Victoria Island, Lagos',  6.4487, 3.4308, '', 1, 4.5, 'Mon-Sat 8AM-8PM',  88],
    ['Bay-Kins Pharmacy',             'Victoria Island, Lagos',  6.4299, 3.4525, '', 1, 4.3, 'Mon-Sat 9AM-7PM',  42],
    ['MedPlus Pharmacy VI',           'Victoria Island, Lagos',  6.4363, 3.4511, '', 1, 4.6, 'Daily 8AM-9PM',   211],
    ['HealthPlus Pharmacy VI',        'Victoria Island, Lagos',  6.4359, 3.4514, '', 1, 4.7, 'Daily 8AM-9PM',   298],
    ['MedPlus Pharmacy Falomo',       'Ikoyi, Lagos',            6.4385, 3.4320, '', 1, 4.5, 'Daily 8AM-9PM',   134],
    ['Dr. Rita\'s Pharmacy',          'Victoria Island, Lagos',  6.4296, 3.4568, '', 1, 4.4, 'Mon-Sat 9AM-7PM',  67],
    ['BPS Pharmacy',                  'Ikoyi, Lagos',            6.4562, 3.4454, '', 1, 4.3, 'Mon-Sat 8AM-8PM',  53],
    ['HealthPlus Alexander Avenue',   'Ikoyi, Lagos',            6.4458, 3.4501, '', 1, 4.7, 'Daily 8AM-9PM',   176],
    ['Careforte Pharmacy',            'Lagos Island, Lagos',     6.4306, 3.4234, '', 1, 4.4, 'Mon-Sat 8AM-7PM',  61],

    // Lekki / Ajah
    ['Pills & Tabs Pharmacy',         'Lekki Phase 1, Lagos',    6.4362, 3.4894, '', 1, 4.5, 'Mon-Sat 8AM-9PM',  89],
    ['HealthPlus Lekki',              'Lekki Phase 1, Lagos',    6.4468, 3.4727, '', 1, 4.7, 'Daily 8AM-9PM',   203],
    ['Estandar Pharmacy',             'Lekki Phase 2, Lagos',    6.4873, 3.5778, '', 1, 4.3, 'Mon-Sat 8AM-8PM',  44],

    // Yaba / Surulere
    ['HealthPlus Pharmacy Yaba',      'Yaba, Lagos',             6.5064, 3.3743, '', 1, 4.6, 'Daily 8AM-9PM',   158],
    ['Patient Medicine Store',        'Surulere, Lagos',         6.4939, 3.3891, '', 0, 4.1, 'Mon-Sat 8AM-8PM',  28],

    // Ikeja / Maryland
    ['HealthPlus Pharmacy Ikeja',     'Ikeja, Lagos',            6.6139, 3.3581, '', 1, 4.7, 'Daily 8AM-9PM',   312],
    ['Health Plus Ikeja GRA',         'Ikeja GRA, Lagos',        6.5969, 3.3542, '', 1, 4.6, 'Mon-Sat 8AM-9PM', 187],
    ['Hand of God Pharmacy',          'Maryland, Lagos',         6.6017, 3.4139, '', 0, 4.0, 'Mon-Sat 8AM-8PM',  19],
    ['Varg Pharmacy',                 'Maryland, Lagos',         6.6071, 3.4150, '', 1, 4.2, 'Mon-Sat 8AM-8PM',  37],
    ['Seal Pharmacy',                 'Maryland, Lagos',         6.6082, 3.4250, '', 1, 4.3, 'Mon-Sat 8AM-8PM',  51],
    ['Kojos Pharmacy',                'Maryland, Lagos',         6.6060, 3.4217, '', 1, 4.4, 'Mon-Sat 9AM-7PM',  63],
    ['Bosycare Pharmacy',             'Maryland, Lagos',         6.6052, 3.4101, '', 1, 4.2, 'Mon-Sat 8AM-7PM',  29],

    // Agege / Iyana Ipaja
    ['Slon Pharmacy',                 'Agege, Lagos',            6.5399, 3.3131, '', 0, 4.0, 'Mon-Sat 7AM-9PM',  21],
    ['Semper Pharmacy',               'Agege, Lagos',            6.5408, 3.2996, '', 1, 4.2, 'Mon-Sat 8AM-8PM',  34],
    ['Okerube Pharmacy',              'Iyana Ipaja, Lagos',      6.5281, 3.2357, '', 0, 4.0, 'Mon-Sat 7AM-9PM',  16],
    ['Favor Chemist Store',           'Iyana Ipaja, Lagos',      6.5226, 3.2344, '', 0, 3.9, 'Mon-Sat 8AM-8PM',  12],
    ['Pharmaceutical Store Ipaja',    'Iyana Ipaja, Lagos',      6.5292, 3.2353, '', 0, 4.0, 'Mon-Sat 8AM-7PM',  18],

    // Ikorodu
    ['Megacare+ Pharmacy',            'Ikorodu, Lagos',          6.6153, 3.5019, '', 1, 4.4, 'Mon-Sat 8AM-8PM',  72],
    ['Helix Pharmacy',                'Ikorodu, Lagos',          6.6136, 3.5017, '', 1, 4.5, 'Mon-Sat 8AM-8PM',  88],
    ['Mayaflora Pharmacy',            'Ikorodu, Lagos',          6.6319, 3.5357, '', 1, 4.3, 'Mon-Sat 8AM-7PM',  41],

    // Badagry
    ['Oriwu Pharmacy',                'Badagry, Lagos',          6.4978, 3.1955, '', 1, 4.2, 'Mon-Sat 8AM-7PM',  33],
  ]

  const pharmIds = [pharm1.lastInsertRowid]
  for (const [name, location, lat, lng, phone, nafdac, rating, hours, review_count] of realPharmacies) {
    const r = insertPharmacy.run(null, name, 'pharmacy', location, lat, lng, phone || null, nafdac, rating, hours, review_count)
    pharmIds.push(r.lastInsertRowid)
  }

  // Seed inventory for all pharmacies
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
    ['Azithromycin 500mg',      45, 'N1200',   'Jun 2027'],
    ['Metronidazole 200mg',     90, 'N350',    'Dec 2026'],
    ['Artemether-Lumefantrine', 30, 'N1500',   'Sep 2027'],
    ['Cetirizine 10mg',         60, 'N300',    'Nov 2027'],
    ['Salbutamol Inhaler',       8, 'N2500',   'Mar 2027'],
    ['Prednisolone 5mg',        40, 'N350',    'Aug 2027'],
  ]

  for (const pid of pharmIds) {
    for (const [name, stock, price, expiry] of meds) {
      const jitter = Math.max(0, stock + Math.floor(Math.random() * 20) - 10)
      const st = jitter === 0 ? 'Out of Stock' : jitter < 15 ? 'Low Stock' : 'In Stock'
      insertInv.run(pid, name, jitter, price, expiry || '-', st)
    }
  }

  // Alerts
  const insertAlert = db.prepare(`INSERT INTO alerts (type,title,body,tag,read) VALUES (?,?,?,?,?)`)
  insertAlert.run('recall',       'NAFDAC Recall Notice',   'Batch #A2341 of Paracetamol 500mg recalled due to quality concerns.',  'Recall',   0)
  insertAlert.run('shortage',     'Shortage Alert',          'Insulin Actrapid 100IU experiencing nationwide shortage risk.',        'Shortage', 0)
  insertAlert.run('packaging',    'Packaging Update',        'Augmentin 625mg packaging updated by manufacturer GSK.',              'Update',   0)
  insertAlert.run('safety',       'Safety Clearance',        'Metformin 850mg batch #M9921 cleared for distribution.',             'Safety',   0)
  insertAlert.run('supply',       'Supply Notification',     'New stock of IV Normal Saline arriving this week.',                   'Supply',   0)
  insertAlert.run('verification', 'Verification Required',   'Verify your PCN license to maintain Verified Partner status.',       'Action',   0)
}
