import { createContext, useContext, useState, useCallback } from 'react'

export const STORE_KEY = 'stoop_data_v1'
export const NAV_KEY   = 'stoop_nav_v1'

export function seedData() {
  const properties = [
    { id: 'p1', name: 'Maple Court Duplex',   address: '412 Maple Ave, Portland, OR 97214', units: 2 },
    { id: 'p2', name: 'Birchwood Apartments', address: '88 Birch St, Portland, OR 97211',   units: 3 },
    { id: 'p3', name: '123 Main St',           address: '123 Main St, Portland, OR 97201',   units: 1 },
  ]

  const tenants = [
    { id:'t1', propertyId:'p1', unit:'Unit A',     name:'John Doe',       email:'john.doe@email.com',      phone:'(503) 555-0142', emergency:'Jane Doe — (503) 555-0143',         moveIn:'2024-08-01', leaseStart:'2025-08-01', leaseEnd:'2026-07-31', rent:1500, status:'active'   },
    { id:'t2', propertyId:'p1', unit:'Unit B',     name:'Maria Alvarez',  email:'maria.alvarez@email.com', phone:'(503) 555-0188', emergency:'Luis Alvarez — (503) 555-0189',    moveIn:'2025-11-01', leaseStart:'2025-11-01', leaseEnd:'2026-10-31', rent:1650, status:'active'   },
    { id:'t3', propertyId:'p2', unit:'Unit #2',    name:'David Chen',     email:'d.chen@email.com',         phone:'(503) 555-0119', emergency:'Grace Chen — (503) 555-0120',       moveIn:'2025-09-15', leaseStart:'2025-09-15', leaseEnd:'2026-09-14', rent:1200, status:'active'   },
    { id:'t4', propertyId:'p2', unit:'Unit #4',    name:'Sarah Whitfield',email:'s.whitfield@email.com',   phone:'(503) 555-0173', emergency:'Mark Whitfield — (503) 555-0174',  moveIn:'2024-07-01', leaseStart:'2025-07-01', leaseEnd:'2026-06-30', rent:1350, status:'active'   },
    { id:'t5', propertyId:'p3', unit:'Main House', name:'Robert Hughes',  email:'r.hughes@email.com',       phone:'(503) 555-0150', emergency:'Susan Hughes — (503) 555-0151',    moveIn:'2025-12-01', leaseStart:'2025-12-01', leaseEnd:'2026-11-30', rent:1800, status:'active'   },
    { id:'t6', propertyId:'p2', unit:'Unit #1',    name:'Emily Park',     email:'emily.park@email.com',     phone:'(503) 555-0166', emergency:'Daniel Park — (503) 555-0167',     moveIn:'2024-03-01', leaseStart:'2025-03-01', leaseEnd:'2026-02-28', rent:1250, status:'inactive' },
  ]

  const payments = []
  let pid = 0
  const addP = (tenantId, due, amount, status, paidDate = null, daysOverdue = 0, lateFee = 0) =>
    payments.push({ id: 'r' + (++pid), tenantId, dueDate: due, amount, status, paidDate, daysOverdue, lateFee })

  // John Doe ($1,500)
  addP('t1', '2026-03-01', 1500, 'paid', '2026-03-01')
  addP('t1', '2026-04-01', 1500, 'paid', '2026-04-02')
  addP('t1', '2026-05-01', 1500, 'paid', '2026-05-01')
  addP('t1', '2026-06-01', 1500, 'paid', '2026-06-01')
  // Maria Alvarez ($1,650) — LATE in June
  addP('t2', '2026-03-01', 1650, 'paid', '2026-03-03')
  addP('t2', '2026-04-01', 1650, 'paid', '2026-04-01')
  addP('t2', '2026-05-01', 1650, 'late', '2026-05-08', 7, 50)
  addP('t2', '2026-06-01', 1650, 'late', null, 10, 50)
  // David Chen ($1,200)
  addP('t3', '2026-04-01', 1200, 'paid', '2026-04-01')
  addP('t3', '2026-05-01', 1200, 'paid', '2026-05-02')
  addP('t3', '2026-06-01', 1200, 'paid', '2026-06-04')
  // Sarah Whitfield ($1,350)
  addP('t4', '2026-04-05', 1350, 'paid', '2026-04-05')
  addP('t4', '2026-05-05', 1350, 'paid', '2026-05-06')
  addP('t4', '2026-06-05', 1350, 'paid', '2026-06-05')
  // Robert Hughes ($1,800)
  addP('t5', '2026-04-01', 1800, 'paid', '2026-04-01')
  addP('t5', '2026-05-01', 1800, 'paid', '2026-05-01')
  addP('t5', '2026-06-01', 1800, 'paid', '2026-06-01')
  // Upcoming July (not yet due)
  addP('t1', '2026-07-01', 1500, 'due')
  addP('t3', '2026-07-01', 1200, 'due')
  addP('t5', '2026-07-01', 1800, 'due')

  const maintenance = [
    { id:'m1', propertyId:'p1', tenantId:'t1', title:'Leaky faucet in kitchen',       description:'Under-sink faucet dripping slowly. Tenant placed a bowl underneath for now.',  status:'reported',    priority:'low',    reported:'2026-06-05', completed:null,         estCost:150, actualCost:null, notes:'' },
    { id:'m2', propertyId:'p1', tenantId:'t2', title:'Garbage disposal jammed',        description:"Disposal hums but won't turn. Possible stuck object.",                          status:'reported',    priority:'medium', reported:'2026-06-09', completed:null,         estCost:120, actualCost:null, notes:'' },
    { id:'m3', propertyId:'p2', tenantId:'t3', title:'Heater not igniting',            description:'Furnace fails to ignite on cold mornings. No heat in living room.',             status:'assigned',    priority:'high',   reported:'2026-06-02', completed:null,         estCost:400, actualCost:null, notes:'HVAC tech (Cascade Heating) scheduled Thursday 9am.' },
    { id:'m4', propertyId:'p2', tenantId:'t4', title:'Running toilet, master bath',    description:'Toilet runs continuously after flush. Flapper likely worn.',                     status:'in-progress', priority:'medium', reported:'2026-05-28', completed:null,         estCost:90,  actualCost:null, notes:'Flapper & fill valve ordered, arriving Wed.' },
    { id:'m5', propertyId:'p3', tenantId:'t5', title:'Broken window latch, bedroom',  description:"Latch snapped; window won't lock. Security concern.",                            status:'completed',   priority:'low',    reported:'2026-06-01', completed:'2026-06-08', estCost:70,  actualCost:75,   notes:'Replaced latch hardware. Receipt filed.' },
    { id:'m6', propertyId:'p1', tenantId:'t2', title:'Dishwasher leaking onto floor', description:'Water pooling in front of dishwasher during cycle.',                              status:'completed',   priority:'high',   reported:'2026-04-20', completed:'2026-04-25', estCost:200, actualCost:210,  notes:'Replaced door gasket. Tested two cycles, dry.' },
  ]

  return { properties, tenants, payments, maintenance, onboarded: true }
}

function loadData() {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

function persist(data) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(data)) } catch {}
}

const StoreCtx = createContext(null)

/**
 * @typedef {Object} StoreValue
 * @property {Object|null} data        - Live app state (mirrors localStorage)
 * @property {Function}    update      - Mutate state: `update(d => ({ ...d, tenants: [...] }))`
 * @property {Function}    reset       - Reload seed data, keep onboarded flag
 * @property {Function}    startDemo   - Seed full demo dataset and mark as onboarded
 * @property {Function}    clear       - Wipe all data and navigate back to landing
 */

/** @returns {StoreValue} */
export function useStore() { return useContext(StoreCtx) }

export function StoreProvider({ children }) {
  const [data, setData] = useState(() => loadData() ?? seedData())

  const update = useCallback((fn) => {
    setData(prev => {
      const next = typeof fn === 'function' ? fn(prev) : fn
      persist(next)
      return next
    })
  }, [])

  const reset = useCallback(() => {
    const s = seedData(); persist(s); setData(s)
  }, [])

  const startDemo = useCallback((extra) => {
    const s = seedData()
    if (extra?.property) s.properties[0] = { ...s.properties[0], ...extra.property }
    persist(s); setData(s)
  }, [])

  const clear = useCallback(() => {
    localStorage.removeItem(STORE_KEY); setData(null)
  }, [])

  return (
    <StoreCtx.Provider value={{ data, update, reset, startDemo, clear }}>
      {children}
    </StoreCtx.Provider>
  )
}
