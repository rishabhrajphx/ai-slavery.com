export interface Worker {
  id: number;
  name: string;
  productivityRate: number; // Items produced per hour
  qualityRate: number; // Percentage of items without defects (0-100)
  energyLevel: number; // Worker energy level (0-100)
  performance: number[]; // Historical performance data
  totalProduced: number;
  defects: number;
  workerNumber: number; // Added worker number
}

const FIRST_NAMES = [
  'Mei', 'Li', 'Zhang', 'Liu', 'Chen', 'Wang', 'Yang', 'Huang',
  'Fatima', 'Aisha', 'Muhammad', 'Ahmed', 'Ravi', 'Priya', 'Raj', 'Sunita',
  'Maria', 'Juan', 'Carlos', 'Rosa', 'Gloria', 'Thuy', 'Binh', 'Huan'
];

const LAST_NAMES = [
  'Li', 'Wang', 'Zhang', 'Chen', 'Liu', 'Yang', 'Huang', 'Zhao',
  'Singh', 'Patel', 'Kumar', 'Sharma', 'Rahman', 'Khan', 'Ali', 'Nguyen',
  'Rodriguez', 'Garcia', 'Martinez', 'Lopez', 'Tran', 'Pham', 'Devi', 'Das'
];

/**
 * Generate a random worker
 */
const generateWorker = (id: number, workerNumber: number): Worker => {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  
  // Generate random worker stats - if worker #17, make them the worst performer
  let baseProductivity, baseQuality, baseEnergy;
  
  if (workerNumber === 17) {
    // Worker 17 gets the lowest stats
    baseProductivity = 5 + Math.floor(Math.random() * 10); // 5-15 items per hour
    baseQuality = 50 + Math.floor(Math.random() * 15); // 50-65% quality
    baseEnergy = 30 + Math.floor(Math.random() * 15); // 30-45% energy
  } else {
    // Regular workers get normal stats
    baseProductivity = 15 + Math.floor(Math.random() * 20); // 15-35 items per hour
    baseQuality = 75 + Math.floor(Math.random() * 20); // 75-95% quality
    baseEnergy = 80 + Math.floor(Math.random() * 20); // 80-100% energy
  }
  
  return {
    id,
    name: `${firstName} ${lastName}`,
    productivityRate: baseProductivity,
    qualityRate: baseQuality,
    energyLevel: baseEnergy,
    performance: [baseProductivity],
    totalProduced: 0,
    defects: 0,
    workerNumber
  };
};

/**
 * Generate a list of random workers
 */
export const generateRandomWorkers = (count: number): Worker[] => {
  return Array.from({ length: count }, (_, i) => generateWorker(i + 1, i + 1));
};

/**
 * Simulate productivity changes for all workers
 */
export const simulateProductivity = (workers: Worker[]): Worker[] => {
  return workers.map(worker => {
    // Simulate energy decline - worker 17 declines faster
    const energyDecline = worker.workerNumber === 17 
      ? Math.random() * 8  // Worker 17 gets tired faster
      : Math.random() * 5;
      
    let newEnergy = Math.max(worker.energyLevel - energyDecline, worker.workerNumber === 17 ? 25 : 30);
    
    // Random productivity and quality fluctuations
    let productivityDelta = (Math.random() * 6) - 3; // -3 to +3
    let qualityDelta = (Math.random() * 4) - 2; // -2 to +2
    
    // Worker 17 tends to have more negative fluctuations
    if (worker.workerNumber === 17) {
      productivityDelta = (Math.random() * 4) - 3; // More likely to be negative
      qualityDelta = (Math.random() * 3) - 2.5; // More likely to be negative
    }
    
    // Energy impacts productivity and quality
    const energyFactor = newEnergy / 100;
    const newProductivity = Math.max(
      5,
      Math.min(40, worker.productivityRate + productivityDelta * energyFactor)
    );
    const newQuality = Math.max(
      50,
      Math.min(100, worker.qualityRate + qualityDelta * energyFactor)
    );
    
    // Calculate production for this cycle
    const produced = Math.floor(newProductivity / 3600 * 1000); // Scale to simulation interval
    const newDefects = Math.floor(produced * (1 - newQuality / 100));
    
    // Update performance history (keep last 10 points)
    const newPerformance = [...worker.performance, newProductivity].slice(-10);
    
    return {
      ...worker,
      productivityRate: newProductivity,
      qualityRate: newQuality,
      energyLevel: newEnergy,
      performance: newPerformance,
      totalProduced: worker.totalProduced + produced,
      defects: worker.defects + newDefects
    };
  });
};