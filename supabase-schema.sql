-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  client_name VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  is_paid BOOLEAN DEFAULT FALSE,
  payment_date TIMESTAMP,
  payment_reference VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Daily progress table
CREATE TABLE IF NOT EXISTS daily_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(job_id, date)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_jobs_is_paid ON jobs(is_paid);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_daily_progress_job_id ON daily_progress(job_id);
CREATE INDEX IF NOT EXISTS idx_daily_progress_date ON daily_progress(date);

-- Enable Row Level Security (RLS)
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_progress ENABLE ROW LEVEL SECURITY;

-- Policies (for now, allow all operations - you can add auth later)
CREATE POLICY "Allow all operations on jobs" ON jobs FOR ALL USING (true);
CREATE POLICY "Allow all operations on daily_progress" ON daily_progress FOR ALL USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
