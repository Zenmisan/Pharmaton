import bcrypt from 'bcryptjs'

export function seed(db) {
  const hash = bcrypt.hashSync('password123', 10)

  const insertUser = db.prepare(`INSERT INTO users (email,password_hash,name,role,org_name,location,license_number) VALUES (?,?,?,?,?,?,?)`)
  const patient    = insertUser.run('amara@example.com', hash, 'Amara Okonkwo', 'patient', null, 'Surulere, Lagos', null)
  const pharmacist = insertUser.run('grace@example.com', hash, 'Grace Adeyemi', 'pharmacist', 'Grace Pharmacy', 'Surulere, Lagos', 'PCN/2019/00231')
  const hospital    = insertUser.run('emeka@example.com', hash, 'Dr. Emeka Nwosu', 'hospital', 'General Hospital Lagos', 'Lagos Island', null)
  const supplier    = insertUser.run('medisupply@example.com', hash, 'MediSupply Wholesalers', 'supplier', 'MediSupply Wholesalers', 'Ikeja, Lagos', 'CAC/BN/2018/004521')

  const insertPharmacy = db.prepare(`INSERT INTO pharmacies (owner_user_id,name,type,location,lat,lng,phone,nafdac_verified,rating) VALUES (?,?,?,?,?,?,?,?,?)`)
  const pharm1 = insertPharmacy.run(pharmacist.lastInsertRowid, 'Grace Pharmacy', 'pharmacy', 'Surulere, Lagos', 6.4926, 3.3552, '+2348012345001', 1, 4.8)
  const pharm2 = insertPharmacy.run(null, 'HealthPlus Pharmacy', 'pharmacy', 'Surulere, Lagos', 6.4980, 3.3610, '+2348012345002', 1, 4.6)
  const pharm3 = insertPharmacy.run(null, 'CarePoint Pharmacy', 'pharmacy', 'Lagos Island', 6.4550, 3.3920, '+2348012345003', 1, 4.5)
  const pharm4 = insertPharmacy.run(null, 'MedLine Pharmacy', 'pharmacy', 'Yaba, Lagos', 6.5095, 3.3711, '+2348012345004', 0, 4.2)
  const hosp1  = insertPharmacy.run(hospital.lastInsertRowid, 'General Hospital Lagos', 'hospital', 'Lagos Island', 6.4541, 3.3947, '+2348012345005', 1, 4.7)
  const sup1   = insertPharmacy.run(supplier.lastInsertRowid, 'MediSupply Wholesalers', 'supplier', 'Ikeja, Lagos', 6.6018, 3.3515, '+2348012345006', 1, 4.9)
  insertPharmacy.run(null, 'PharmaDist Ltd', 'supplier', 'Victoria Island, Lagos', 6.4281, 3.4219, '+2348012345007', 1, 4.7)
  insertPharmacy.run(null, 'NovaMed Distributors', 'supplier', 'Yaba, Lagos', 6.5095, 3.3711, '+2348012345008', 1, 4.5)

  const insertInv = db.prepare(`INSERT INTO inventory (pharmacy_id,name,stock,price,expiry,status) VALUES (?,?,?,?,?,?)`)
  const meds = [
    ['Amoxicillin 500mg',   240, '₦800',    'Dec 2026', 'In Stock'],
    ['Paracetamol 500mg',   18,  '₦200',    'Mar 2026', 'Low Stock'],
    ['Augmentin 625mg',     0,   '₦2,400',  '—',        'Out of Stock'],
    ['Metformin 850mg',     120, '₦1,200',  'Jun 2026', 'In Stock'],
    ['Amlodipine 5mg',      5,   '₦950',    'Jan 2026', 'Low Stock'],
    ['Lisinopril 10mg',     80,  '₦1,100',  'Sep 2026', 'In Stock'],
    ['Diclofenac 50mg',     3,   '₦450',    'Nov 2026', 'Low Stock'],
    ['Omeprazole 20mg',     0,   '₦750',    '—',        'Out of Stock'],
    ['Ciprofloxacin 500mg', 60,  '₦1,800',  'Aug 2026', 'In Stock'],
    ['Ibuprofen 400mg',     35,  '₦300',    'Oct 2026', 'In Stock'],
    ['Insulin Actrapid 100IU', 12, '₦18,000','May 2026', 'Low Stock'],
    ['IV Normal Saline 500ml', 80, '₦1,500','Jul 2026', 'In Stock'],
  ]
  for (const pid of [pharm1.lastInsertRowid, pharm2.lastInsertRowid, pharm3.lastInsertRowid, pharm4.lastInsertRowid, sup1.lastInsertRowid]) {
    for (const [name, stock, price, expiry, status] of meds) {
      // vary stock slightly per location so search results differ
      const jitter = Math.max(0, stock + Math.floor(Math.random() * 20) - 10)
      const st = jitter === 0 ? 'Out of Stock' : jitter < 15 ? 'Low Stock' : 'In Stock'
      insertInv.run(pid, name, jitter, price, expiry, st)
    }
  }

  const insertOrder = db.prepare(`INSERT INTO orders (order_code,buyer_id,supplier_id,medicine,qty,status,eta,value) VALUES (?,?,?,?,?,?,?,?)`)
  insertOrder.run('ORD-001', pharmacist.lastInsertRowid, supplier.lastInsertRowid, 'Metformin 850mg', '1000 tabs', 'In Transit', 'Today 3PM', '₦1.2M')
  insertOrder.run('ORD-002', hospital.lastInsertRowid,   supplier.lastInsertRowid, 'Amlodipine 5mg', '500 tabs', 'Confirmed', 'Tomorrow', '₦475K')
  insertOrder.run('ORD-003', pharmacist.lastInsertRowid, supplier.lastInsertRowid, 'IV Normal Saline', '100 bags', 'Delivered', 'Completed', '₦150K')
  insertOrder.run('ORD-004', hospital.lastInsertRowid,   supplier.lastInsertRowid, 'Augmentin 625mg', '200 packs', 'Processing', '3-5 days', '₦480K')
  insertOrder.run('ORD-005', pharmacist.lastInsertRowid, supplier.lastInsertRowid, 'Insulin Actrapid', '50 vials', 'In Transit', 'Tomorrow 6PM', '₦900K')

  const insertReq = db.prepare(`INSERT INTO supplier_requests (supplier_id,from_name,medicine,qty,urgent,status) VALUES (?,?,?,?,?,?)`)
  insertReq.run(supplier.lastInsertRowid, 'HealthPlus Pharmacy', 'Augmentin 625mg', '500 tabs', 1, 'pending')
  insertReq.run(supplier.lastInsertRowid, 'General Hospital Lagos', 'IV Normal Saline', '200 bags', 1, 'pending')
  insertReq.run(supplier.lastInsertRowid, 'CarePoint Pharmacy', 'Metformin 850mg', '1000 tabs', 0, 'pending')
  insertReq.run(supplier.lastInsertRowid, 'MedLine Pharmacy', 'Amoxicillin 500mg', '300 tabs', 0, 'pending')

  const insertAlert = db.prepare(`INSERT INTO alerts (type,title,body,tag,read) VALUES (?,?,?,?,?)`)
  insertAlert.run('recall', 'NAFDAC Recall Notice', 'Batch #A2341 of Paracetamol 500mg recalled due to quality concerns.', 'Recall', 0)
  insertAlert.run('shortage', 'Shortage Alert', 'Insulin Actrapid 100IU experiencing nationwide shortage risk.', 'Shortage', 0)
  insertAlert.run('packaging', 'Packaging Update', 'Augmentin 625mg packaging updated by manufacturer GSK.', 'Update', 0)
  insertAlert.run('safety', 'Safety Clearance', 'Metformin 850mg batch #M9921 cleared for distribution.', 'Safety', 0)
  insertAlert.run('supply', 'Supply Notification', 'New stock of IV Normal Saline arriving this week.', 'Supply', 0)
  insertAlert.run('verification', 'Verification Required', 'Please verify your PCN license to maintain Verified Partner status.', 'Action', 0)

  const insertNeed = db.prepare(`INSERT INTO hospital_needs (hospital_id,name,qty,priority,status) VALUES (?,?,?,?,?)`)
  insertNeed.run(hospital.lastInsertRowid, 'Insulin Actrapid 100IU', '500 vials', 'CRITICAL', 'Sourcing')
  insertNeed.run(hospital.lastInsertRowid, 'IV Normal Saline 500ml', '200 bags', 'HIGH', 'Ordered')
  insertNeed.run(hospital.lastInsertRowid, 'Morphine 10mg/ml', '50 ampoules', 'CRITICAL', 'Pending')
  insertNeed.run(hospital.lastInsertRowid, 'Ceftriaxone 1g Injection', '100 vials', 'MEDIUM', 'Located')
}
