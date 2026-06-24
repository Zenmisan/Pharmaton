export function seed(db) {
  const insertUser = db.prepare(`INSERT INTO users (uid,email,name,role,org_name,location,license_number) VALUES (?,?,?,?,?,?,?)`)
  const patient    = insertUser.run('demo-uid-amara', 'amara@example.com', 'Amara Okonkwo', 'patient', null, 'Surulere, Lagos', null)
  const pharmacist = insertUser.run('demo-uid-grace', 'grace@example.com', 'Grace Adeyemi', 'pharmacist', 'Grace Pharmacy', 'Surulere, Lagos', 'PCN/2019/00231')

  const insertPharmacy = db.prepare(`INSERT INTO pharmacies (owner_user_id,name,type,location,lat,lng,phone,nafdac_verified,rating,hours,review_count) VALUES (?,?,?,?,?,?,?,?,?,?,?)`)

  const pharm1 = insertPharmacy.run(pharmacist.lastInsertRowid, 'Grace Pharmacy', 'pharmacy', 'Surulere, Lagos', 6.4926, 3.3552, '+2348012345001', 1, 4.8, 'Mon-Sat 8AM-9PM, Sun 10AM-6PM', 214)

  // ── Lagos pharmacies ────────────────────────────────────────
  const lagosPharmacies = [
    ['Chemart Pharmacy',              'Victoria Island, Lagos',   6.4487, 3.4308, '', 1, 4.5, 'Mon-Sat 8AM-8PM',  88],
    ['Bay-Kins Pharmacy',             'Victoria Island, Lagos',   6.4299, 3.4525, '', 1, 4.3, 'Mon-Sat 9AM-7PM',  42],
    ['MedPlus Pharmacy VI',           'Victoria Island, Lagos',   6.4363, 3.4511, '', 1, 4.6, 'Daily 8AM-9PM',   211],
    ['HealthPlus Pharmacy VI',        'Victoria Island, Lagos',   6.4359, 3.4514, '', 1, 4.7, 'Daily 8AM-9PM',   298],
    ['MedPlus Pharmacy Falomo',       'Ikoyi, Lagos',             6.4385, 3.4320, '', 1, 4.5, 'Daily 8AM-9PM',   134],
    ["Dr. Rita's Pharmacy",           'Victoria Island, Lagos',   6.4296, 3.4568, '', 1, 4.4, 'Mon-Sat 9AM-7PM',  67],
    ['BPS Pharmacy',                  'Ikoyi, Lagos',             6.4562, 3.4454, '', 1, 4.3, 'Mon-Sat 8AM-8PM',  53],
    ['HealthPlus Alexander Avenue',   'Ikoyi, Lagos',             6.4458, 3.4501, '', 1, 4.7, 'Daily 8AM-9PM',   176],
    ['Careforte Pharmacy',            'Lagos Island, Lagos',      6.4306, 3.4234, '', 1, 4.4, 'Mon-Sat 8AM-7PM',  61],
    ['Pills & Tabs Pharmacy',         'Lekki Phase 1, Lagos',     6.4362, 3.4894, '', 1, 4.5, 'Mon-Sat 8AM-9PM',  89],
    ['HealthPlus Lekki',              'Lekki Phase 1, Lagos',     6.4468, 3.4727, '', 1, 4.7, 'Daily 8AM-9PM',   203],
    ['Estandar Pharmacy',             'Lekki Phase 2, Lagos',     6.4873, 3.5778, '', 1, 4.3, 'Mon-Sat 8AM-8PM',  44],
    ['HealthPlus Pharmacy Yaba',      'Yaba, Lagos',              6.5064, 3.3743, '', 1, 4.6, 'Daily 8AM-9PM',   158],
    ['Patient Medicine Store',        'Surulere, Lagos',          6.4939, 3.3891, '', 0, 4.1, 'Mon-Sat 8AM-8PM',  28],
    ['HealthPlus Pharmacy Ikeja',     'Ikeja, Lagos',             6.6139, 3.3581, '', 1, 4.7, 'Daily 8AM-9PM',   312],
    ['Health Plus Ikeja GRA',         'Ikeja GRA, Lagos',         6.5969, 3.3542, '', 1, 4.6, 'Mon-Sat 8AM-9PM', 187],
    ['Hand of God Pharmacy',          'Maryland, Lagos',          6.6017, 3.4139, '', 0, 4.0, 'Mon-Sat 8AM-8PM',  19],
    ['Varg Pharmacy',                 'Maryland, Lagos',          6.6071, 3.4150, '', 1, 4.2, 'Mon-Sat 8AM-8PM',  37],
    ['Seal Pharmacy',                 'Maryland, Lagos',          6.6082, 3.4250, '', 1, 4.3, 'Mon-Sat 8AM-8PM',  51],
    ['Kojos Pharmacy',                'Maryland, Lagos',          6.6060, 3.4217, '', 1, 4.4, 'Mon-Sat 9AM-7PM',  63],
    ['Bosycare Pharmacy',             'Maryland, Lagos',          6.6052, 3.4101, '', 1, 4.2, 'Mon-Sat 8AM-7PM',  29],
    ['Slon Pharmacy',                 'Agege, Lagos',             6.5399, 3.3131, '', 0, 4.0, 'Mon-Sat 7AM-9PM',  21],
    ['Semper Pharmacy',               'Agege, Lagos',             6.5408, 3.2996, '', 1, 4.2, 'Mon-Sat 8AM-8PM',  34],
    ['Okerube Pharmacy',              'Iyana Ipaja, Lagos',       6.5281, 3.2357, '', 0, 4.0, 'Mon-Sat 7AM-9PM',  16],
    ['Favor Chemist Store',           'Iyana Ipaja, Lagos',       6.5226, 3.2344, '', 0, 3.9, 'Mon-Sat 8AM-8PM',  12],
    ['Megacare+ Pharmacy',            'Ikorodu, Lagos',           6.6153, 3.5019, '', 1, 4.4, 'Mon-Sat 8AM-8PM',  72],
    ['Helix Pharmacy',                'Ikorodu, Lagos',           6.6136, 3.5017, '', 1, 4.5, 'Mon-Sat 8AM-8PM',  88],
    ['Mayaflora Pharmacy',            'Ikorodu, Lagos',           6.6319, 3.5357, '', 1, 4.3, 'Mon-Sat 8AM-7PM',  41],
    ['Oriwu Pharmacy',                'Badagry, Lagos',           6.4978, 3.1955, '', 1, 4.2, 'Mon-Sat 8AM-7PM',  33],
  ]

  // ── Lagos herbal / natural stores ──────────────────────────
  const herbalStores = [
    ['The Useful Herbs Naturopathy Ltd',                  'Surulere, Lagos',       6.5143, 3.3476, '', 1, 4.6, 'Mon-Sat 9AM-7PM',  91],
    ['Greenlife Herbal Products',                         'Victoria Island, Lagos', 6.4281, 3.4219, '', 1, 4.4, 'Mon-Sat 9AM-6PM',  67],
    ['Kedi Health Care Industries Nigeria Limited',       'Ikeja, Lagos',          6.6018, 3.3515, '', 1, 4.5, 'Mon-Fri 8AM-6PM',  54],
    ['Ancient African Remedies Natural Herbal Medicine',  'Alimosho, Lagos',       6.6058, 3.2422, '', 0, 4.3, 'Mon-Sat 8AM-7PM',  38],
    ['JINJA Herbal Extract Lagos',                        'Lagos Island, Lagos',   6.4541, 3.3947, '', 0, 4.2, 'Mon-Sat 9AM-7PM',  29],
    ['Naveen Herbs Co. Lagos Apothecary',                 'Lekki Phase 1, Lagos',  6.4355, 3.4705, '', 1, 4.5, 'Mon-Sat 9AM-6PM',  48],
    ['Edible Herbs Natural Herbs Lagos',                  'Yaba, Lagos',           6.5047, 3.3742, '', 0, 4.1, 'Mon-Sat 9AM-7PM',  22],
  ]

  // ── Nationwide pharmacies ───────────────────────────────────
  const nigeriaPharmacies = [
    // Abuja
    ['Cedarcrest Pharmacy Garki',        'Garki, Abuja',                       9.0574, 7.4898, '', 1, 4.6, 'Daily 8AM-9PM',   143],
    ['HealthPlus Pharmacy Wuse 2',       'Wuse 2, Abuja',                      9.0765, 7.4891, '', 1, 4.7, 'Daily 8AM-10PM',  218],
    ['MedPlus Pharmacy Maitama',         'Maitama, Abuja',                     9.0830, 7.4833, '', 1, 4.5, 'Daily 8AM-9PM',   189],
    ['Alpha Pharmacy Gwarinpa',          'Gwarinpa, Abuja',                    9.1125, 7.4083, '', 1, 4.4, 'Mon-Sat 8AM-8PM', 112],
    ['Bethel Pharmacy Area 3',           'Area 3, Abuja',                      9.0403, 7.4869, '', 1, 4.3, 'Mon-Sat 8AM-8PM',  77],
    ['National Hospital Pharmacy Abuja', 'Central Business District, Abuja',   9.0579, 7.4951, '', 1, 4.6, 'Daily 8AM-8PM',   204],
    ['Suncare Pharmacy Jabi',            'Jabi, Abuja',                        9.0731, 7.4385, '', 1, 4.4, 'Daily 8AM-9PM',    98],
    // Port Harcourt
    ['Nkemdirim Pharmacy GRA',           'GRA Phase 2, Port Harcourt',         4.8242, 7.0134, '', 1, 4.5, 'Mon-Sat 8AM-8PM', 134],
    ['Dove Pharmacy D-Line',             'D-Line, Port Harcourt',              4.7867, 7.0134, '', 1, 4.4, 'Mon-Sat 8AM-8PM',  89],
    ['Life Care Pharmacy Trans Amadi',   'Trans Amadi, Port Harcourt',         4.8417, 7.0391, '', 1, 4.6, 'Daily 8AM-9PM',   112],
    ['Calix Pharmacy Port Harcourt',     'Old GRA, Port Harcourt',             4.8192, 7.0289, '', 1, 4.3, 'Mon-Sat 9AM-7PM',  67],
    // Kano
    ['Al-Ansar Pharmacy Fagge',          'Fagge, Kano',                       12.0022, 8.5920, '', 1, 4.4, 'Mon-Sat 8AM-7PM',  88],
    ['Ibrahim Pharmacy Sabon Gari',      'Sabon Gari, Kano',                  12.0152, 8.5199, '', 1, 4.2, 'Mon-Sat 8AM-8PM',  55],
    ['Kano Pharmacy Plus Nasarawa',      'Nasarawa, Kano',                    12.0094, 8.5213, '', 1, 4.3, 'Mon-Sat 8AM-7PM',  43],
    ['Shifa Pharmacy Kano',              'GRA, Kano',                         12.0052, 8.5322, '', 1, 4.5, 'Mon-Sat 8AM-7PM',  71],
    // Ibadan
    ['Alesinloye Pharmacy Challenge',    'Challenge, Ibadan',                  7.3924, 3.9200, '', 1, 4.4, 'Mon-Sat 8AM-8PM',  98],
    ['Bodija Medical Pharmacy',          'Bodija, Ibadan',                     7.4314, 3.9048, '', 1, 4.5, 'Daily 8AM-9PM',   127],
    ['HealthPlus Pharmacy Dugbe',        'Dugbe, Ibadan',                      7.3764, 3.9019, '', 1, 4.6, 'Daily 8AM-9PM',   165],
    // Enugu
    ['Coal City Pharmacy Enugu',         'Independence Layout, Enugu',         6.4421, 7.5083, '', 1, 4.4, 'Mon-Sat 8AM-8PM',  82],
    ['Meadow Pharmacy Enugu',            'GRA, Enugu',                         6.4481, 7.4883, '', 1, 4.5, 'Mon-Sat 8AM-8PM',  69],
    // Kaduna
    ['Premier Pharmacy Kaduna',          'Ungwan Rimi, Kaduna',               10.5272, 7.4381, '', 1, 4.3, 'Mon-Sat 8AM-7PM',  58],
    ['Zaria Road Pharmacy Kaduna',       'Zaria Road, Kaduna',                10.5140, 7.4350, '', 1, 4.2, 'Mon-Sat 8AM-7PM',  44],
    // Benin City
    ['Ringroad Pharmacy Benin',          'Ring Road, Benin City',              6.3350, 5.6278, '', 1, 4.4, 'Mon-Sat 8AM-8PM',  96],
    ['Medi-Plus Pharmacy Benin',         'GRA, Benin City',                    6.3404, 5.6309, '', 1, 4.5, 'Daily 8AM-9PM',   108],
    // Owerri
    ['Douglas Pharmacy Owerri',          'Douglas Road, Owerri',               5.4836, 7.0234, '', 1, 4.4, 'Mon-Sat 8AM-8PM',  73],
    ['Prime Pharmacy Owerri',            'Wetheral Road, Owerri',              5.4891, 7.0311, '', 1, 4.3, 'Mon-Sat 8AM-7PM',  55],
    // Warri
    ['Warri Central Pharmacy',           'Effurun, Warri',                     5.5474, 5.7563, '', 1, 4.3, 'Mon-Sat 8AM-8PM',  64],
    // Jos
    ['Rayfield Pharmacy Jos',            'Rayfield, Jos',                      9.8965, 8.8583, '', 1, 4.4, 'Mon-Sat 8AM-7PM',  57],
    // Abeokuta
    ['Kuto Pharmacy Abeokuta',           'Kuto, Abeokuta',                     7.1558, 3.3457, '', 1, 4.3, 'Mon-Sat 8AM-8PM',  49],
  ]

  const pharmIds = [pharm1.lastInsertRowid]
  const herbalIds = []
  const nigeriaIds = []

  for (const [name, location, lat, lng, phone, nafdac, rating, hours, rc] of lagosPharmacies) {
    const r = insertPharmacy.run(null, name, 'pharmacy', location, lat, lng, phone || null, nafdac, rating, hours, rc)
    pharmIds.push(r.lastInsertRowid)
  }
  for (const [name, location, lat, lng, phone, nafdac, rating, hours, rc] of herbalStores) {
    const r = insertPharmacy.run(null, name, 'pharmacy', location, lat, lng, phone || null, nafdac, rating, hours, rc)
    herbalIds.push(r.lastInsertRowid)
  }
  for (const [name, location, lat, lng, phone, nafdac, rating, hours, rc] of nigeriaPharmacies) {
    const r = insertPharmacy.run(null, name, 'pharmacy', location, lat, lng, phone || null, nafdac, rating, hours, rc)
    nigeriaIds.push(r.lastInsertRowid)
  }

  // ── Inventory catalog ───────────────────────────────────────
  const insertInv = db.prepare(`INSERT INTO inventory (pharmacy_id,name,category,stock,price,expiry,status) VALUES (?,?,?,?,?,?,?)`)

  const medicines = [
    ['Paracetamol 500mg',            'N200',   'Mar 2027', 80],
    ['Ibuprofen 400mg',              'N300',   'Oct 2026', 60],
    ['Diclofenac 50mg',              'N450',   'Nov 2026', 40],
    ['Aspirin 75mg',                 'N180',   'Dec 2027', 90],
    ['Amoxicillin 500mg',            'N800',   'Dec 2026', 70],
    ['Ciprofloxacin 500mg',          'N1800',  'Aug 2027', 50],
    ['Azithromycin 500mg',           'N1200',  'Jun 2027', 45],
    ['Metronidazole 200mg',          'N350',   'Dec 2026', 80],
    ['Artemether-Lumefantrine',      'N1500',  'Sep 2027', 30],
    ['Artesunate 200mg',             'N2200',  'Jul 2027', 25],
    ['Amlodipine 5mg',               'N950',   'Jan 2027', 55],
    ['Losartan 50mg',                'N1100',  'Feb 2027', 45],
    ['Lisinopril 10mg',              'N1100',  'Sep 2027', 50],
    ['Hydrochlorothiazide 25mg',     'N600',   'Dec 2027', 70],
    ['Metformin 850mg',              'N1200',  'Jun 2027', 60],
    ['Insulin Actrapid 100IU',       'N18000', 'May 2027', 12],
    ['Glibenclamide 5mg',            'N450',   'Oct 2027', 40],
    ['Omeprazole 20mg',              'N750',   'Apr 2027', 55],
    ['Pantoprazole 40mg',            'N900',   'May 2027', 40],
    ['Antacid Suspension',           'N850',   'Jan 2027', 35],
    ['Salbutamol Inhaler 100mcg',    'N2500',  'Mar 2027', 20],
    ['Budesonide Inhaler 200mcg',    'N4500',  'Jun 2027', 15],
    ['Cetirizine 10mg',              'N300',   'Nov 2027', 70],
    ['Loratadine 10mg',              'N350',   'Dec 2027', 65],
    ['Vitamin C 500mg',              'N500',   'Mar 2028', 90],
    ['Multivitamin Tablets',         'N1200',  'Feb 2028', 80],
    ['Zinc Sulphate 20mg',           'N400',   'Jan 2028', 75],
    ['ORS Sachets (10s)',             'N250',  'Jun 2028', 100],
    ['Fluconazole 150mg',            'N900',   'Aug 2027', 35],
    ['Clotrimazole Cream 1%',        'N600',   'Dec 2027', 40],
  ]

  const herbalProducts = [
    ['Moringa Capsules',             'N1800',  'Dec 2026', 60],
    ['Moringa Powder 200g',          'N2200',  'Jun 2027', 45],
    ['Ginger Capsules',              'N1500',  'Mar 2027', 50],
    ['Garlic Capsules',              'N1600',  'Feb 2027', 55],
    ['Turmeric Capsules',            'N1700',  'Apr 2027', 48],
    ['Aloe Vera Juice 500ml',        'N2500',  'Jan 2027', 30],
    ['Aloe Vera Gel 250ml',          'N1800',  'Aug 2027', 35],
    ['Hibiscus Tea 20 bags',         'N900',   'Dec 2027', 70],
    ['Neem Capsules',                'N1400',  'Jul 2027', 42],
    ['Bitter Leaf Extract 100ml',    'N2000',  'May 2027', 28],
    ['Scent Leaf Tea 20 bags',       'N800',   'Nov 2027', 55],
    ['Clove Powder 50g',             'N600',   'Jan 2028', 65],
    ['Cinnamon Powder 50g',          'N700',   'Feb 2028', 60],
    ['Ginger Tea 20 bags',           'N850',   'Dec 2027', 75],
    ['Turmeric Tea 20 bags',         'N900',   'Jan 2028', 68],
    ['Green Tea 25 bags',            'N1100',  'Mar 2028', 80],
    ['Herbal Bitters 200ml',         'N1600',  'Jun 2027', 32],
    ['Black Seed Oil 100ml',         'N3500',  'Sep 2027', 25],
    ['Moringa Tea 20 bags',          'N1000',  'Dec 2027', 60],
    ['Garlic Oil 50ml',              'N1200',  'Oct 2027', 38],
    ['Turmeric Extract 60ml',        'N2800',  'Aug 2027', 22],
    ['Ginger Extract 60ml',          'N2600',  'Jul 2027', 24],
    ['Herbal Immune Booster',        'N3000',  'May 2027', 18],
    ['Herbal Detox Tea 14 bags',     'N1400',  'Nov 2027', 40],
    ['Herbal Cough Syrup 200ml',     'N1800',  'Jun 2027', 30],
    ['Herbal Digestive Tea 20 bags', 'N1000',  'Dec 2027', 45],
    ['Herbal Sleep Tea 20 bags',     'N1200',  'Jan 2028', 35],
    ['Herbal Wellness Mix 30 caps',  'N2200',  'Oct 2027', 28],
    ['Neem Tea 20 bags',             'N800',   'Feb 2028', 52],
    ['Aloe Vera Capsules',           'N1600',  'Sep 2027', 40],
  ]

  const medicalDevices = [
    ['Blood Pressure Monitor Digital', 'N18000', null,       15],
    ['Glucometer',                     'N12000', null,       12],
    ['Digital Thermometer',            'N2500',  null,       40],
    ['Infrared Thermometer',           'N8000',  null,       20],
    ['Pulse Oximeter',                 'N9500',  null,       18],
    ['Nebulizer Machine',              'N25000', null,       8 ],
    ['Baby Weighing Scale',            'N15000', null,       10],
    ['Adult Weighing Scale',           'N22000', null,       7 ],
    ['Peak Flow Meter',                'N6500',  null,       14],
    ['Wheelchair Standard',            'N85000', null,       4 ],
    ['Crutches Pair',                  'N8000',  null,       12],
    ['Walking Stick',                  'N3500',  null,       20],
    ['Hot Water Bottle',               'N2000',  null,       30],
    ['Pregnancy Test Kit',             'N500',   'Dec 2027', 80],
    ['Stethoscope',                    'N15000', null,       10],
    ['Adult Diaper Pack (10s)',         'N4500',  'Dec 2027', 30],
    ['Blood Lancets (100s)',            'N800',   'Dec 2027', 50],
    ['Glucose Test Strips (50s)',       'N3500',  'Dec 2027', 25],
    ['Spacer Device Inhaler',          'N4000',  null,       15],
    ['Knee Support Brace',             'N4500',  null,       22],
    ['Back Support Belt',              'N6500',  null,       16],
    ['Wrist Brace',                    'N3500',  null,       18],
    ['Neck Collar Soft',               'N4000',  null,       12],
    ['Compression Stockings',          'N5500',  null,       14],
    ['Medical Face Shield',            'N1500',  null,       35],
    ['Eye Patch',                      'N800',   null,       40],
    ['Pill Box 7-Day',                 'N1200',  null,       45],
    ['Medicine Cup (50s)',             'N600',   null,       60],
    ['Tongue Depressor (100s)',        'N800',   null,       50],
    ['Otoscope',                       'N22000', null,       5 ],
  ]

  const surgicalConsumables = [
    ['Syringes 5ml (10s)',             'N600',   'Dec 2027', 60],
    ['Syringes 10ml (10s)',            'N700',   'Dec 2027', 55],
    ['Needles 21G (100s)',             'N900',   'Dec 2027', 45],
    ['Surgical Gloves Size 7',         'N400',   'Dec 2027', 80],
    ['Examination Gloves (Box 100)',   'N4500',  'Dec 2027', 40],
    ['Face Masks (Box 50)',            'N2500',  'Dec 2027', 50],
    ['Cotton Wool 100g',               'N500',   'Dec 2027', 90],
    ['Sterile Gauze Swabs (Box)',      'N1800',  'Dec 2027', 35],
    ['Crepe Bandage 5cm',              'N450',   'Dec 2027', 70],
    ['Crepe Bandage 10cm',             'N600',   'Dec 2027', 65],
    ['Adhesive Plasters (Box)',        'N800',   'Dec 2027', 75],
    ['Alcohol Swabs (Box 100)',        'N700',   'Dec 2027', 85],
    ['IV Cannula 18G (Box 50)',        'N8000',  'Dec 2027', 20],
    ['Urinary Catheter 14Fr',          'N1500',  'Dec 2027', 25],
    ['Chromic Catgut Suture 2-0',      'N2200',  'Dec 2027', 15],
    ['Surgical Blade No.22 (Box 10)', 'N1200',  'Dec 2027', 30],
    ['Elastic Bandage 10cm',           'N700',   'Dec 2027', 60],
    ['Surgical Tape 2.5cm',            'N500',   'Dec 2027', 80],
    ['Wound Dressing Pack',            'N1800',  'Dec 2027', 35],
    ['Disposable Apron (Pack 10)',     'N1500',  'Dec 2027', 28],
    ['Surgical Cap (Box 100)',         'N1200',  'Dec 2027', 40],
    ['Shoe Cover Pack (50 pairs)',     'N900',   'Dec 2027', 45],
    ['IV Giving Set',                  'N600',   'Dec 2027', 55],
    ['Specimen Container Urine',       'N300',   'Dec 2027', 100],
    ['Urine Bag Sterile',              'N800',   'Dec 2027', 30],
    ['Feeding Tube 10Fr',              'N1200',  'Dec 2027', 20],
    ['Oxygen Mask Adult',              'N1800',  'Dec 2027', 18],
    ['Nebulizer Mask Paediatric',      'N1500',  'Dec 2027', 15],
    ['Dressing Forceps Sterile',       'N1000',  'Dec 2027', 25],
    ['Sterile Drape Sheet',            'N1400',  'Dec 2027', 20],
  ]

  const wellnessProducts = [
    ['Vitamin D3 1000IU',              'N2200',  'Jun 2028', 65],
    ['Calcium + Vitamin D3',           'N2800',  'May 2028', 55],
    ['Omega-3 Fish Oil 1000mg',        'N3500',  'Apr 2028', 50],
    ['Iron Supplement Ferrous',        'N1200',  'Mar 2028', 70],
    ['Zinc Supplement 15mg',           'N1500',  'Feb 2028', 60],
    ['Probiotics (30 capsules)',        'N4500',  'Jan 2028', 40],
    ['Protein Powder Chocolate 500g',  'N12000', 'Dec 2027', 15],
    ['Electrolyte Powder Sachets',     'N300',   'Dec 2028', 90],
    ['Hand Sanitizer 500ml',           'N1800',  'Dec 2027', 80],
    ['Antiseptic Solution Dettol',     'N900',   'Dec 2027', 70],
    ['Mouthwash 500ml',                'N1500',  'Nov 2027', 55],
    ['Dental Floss',                   'N800',   'Dec 2028', 65],
    ['Electric Toothbrush',            'N8500',  null,       20],
    ['Whitening Toothpaste',           'N1200',  'Dec 2027', 60],
    ['SPF 50 Sunscreen 100ml',         'N4500',  'Dec 2027', 30],
    ['Moisturising Body Lotion 400ml', 'N2800',  'Jun 2028', 45],
    ['Insect Repellent Spray 100ml',   'N2200',  'Dec 2027', 40],
    ['Eye Drops Artificial Tears',     'N1800',  'Jun 2027', 35],
    ['Saline Nasal Spray',             'N1500',  'Aug 2027', 38],
    ['First Aid Kit Basic',            'N6500',  null,       22],
    ['Resistance Band Set',            'N3500',  null,       18],
    ['Foam Roller',                    'N5500',  null,       10],
    ['Sleep Aid Supplement',           'N3800',  'Mar 2028', 25],
    ['Melatonin 5mg',                  'N2500',  'Feb 2028', 30],
    ['Collagen Tablets',               'N4500',  'Jan 2028', 28],
    ['Evening Primrose Oil',           'N3200',  'Dec 2027', 22],
    ['Biotin 5000mcg',                 'N3500',  'Nov 2027', 32],
    ['Hair Vitamin Supplement',        'N4200',  'Oct 2027', 26],
    ['Detox Tea 14-Day',               'N2200',  'Sep 2027', 40],
    ['Prenatal Vitamins',              'N3800',  'Dec 2027', 35],
  ]

  function jitter(base) {
    return Math.max(0, base + Math.floor(Math.random() * 20) - 10)
  }
  function stockStatus(qty) {
    return qty === 0 ? 'Out of Stock' : qty < 15 ? 'Low Stock' : 'In Stock'
  }
  function insertItems(pid, items, category) {
    for (const [name, price, expiry, base] of items) {
      const qty = jitter(base)
      insertInv.run(pid, name, category, qty, price, expiry || null, stockStatus(qty))
    }
  }

  // Regular Lagos + nationwide pharmacies: medicines + subset of other categories
  for (const pid of [...pharmIds, ...nigeriaIds]) {
    insertItems(pid, medicines, 'Medicine')
    insertItems(pid, medicalDevices.filter((_, i) => i % 2 === 0), 'Medical Device')
    insertItems(pid, surgicalConsumables.filter((_, i) => i % 3 === 0), 'Surgical')
    insertItems(pid, wellnessProducts.filter((_, i) => i % 2 === 0), 'Wellness')
  }

  // Herbal stores: full herbal catalog + basic wellness + basic medicines
  for (const pid of herbalIds) {
    insertItems(pid, herbalProducts, 'Herbal')
    insertItems(pid, wellnessProducts.slice(0, 15), 'Wellness')
    insertItems(pid, medicines.slice(0, 10), 'Medicine')
  }

  // First 5 Lagos pharmacies get full medical device + surgical catalog
  for (const pid of pharmIds.slice(0, 5)) {
    insertItems(pid, medicalDevices, 'Medical Device')
    insertItems(pid, surgicalConsumables, 'Surgical')
  }

  // Alerts
  const insertAlert = db.prepare(`INSERT INTO alerts (type,title,body,tag,read) VALUES (?,?,?,?,?)`)
  insertAlert.run('recall',       'NAFDAC Recall Notice',   'Batch #A2341 of Paracetamol 500mg recalled due to quality concerns.',  'Recall',   0)
  insertAlert.run('shortage',     'Shortage Alert',         'Insulin Actrapid 100IU experiencing nationwide shortage risk.',         'Shortage', 0)
  insertAlert.run('packaging',    'Packaging Update',       'Augmentin 625mg packaging updated by manufacturer GSK.',               'Update',   0)
  insertAlert.run('safety',       'Safety Clearance',       'Metformin 850mg batch #M9921 cleared for distribution.',              'Safety',   0)
  insertAlert.run('supply',       'Supply Notification',    'New stock of IV Normal Saline arriving this week.',                    'Supply',   0)
  insertAlert.run('verification', 'Verification Required',  'Verify your PCN license to maintain Verified Partner status.',        'Action',   0)
}
