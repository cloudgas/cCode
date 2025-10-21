# Job Tracker - Invoice & Payment Management SaaS

A full-stack SaaS application for tracking jobs, invoices, and payments with daily progress monitoring.

## Features

- Add and manage job details
- Track payment status and attach payment records
- Mark jobs as paid with payment date and reference
- Daily progress tracking for each job
- Filter jobs by status (All, Paid, Pending)
- Dashboard with financial overview
- Dark mode support
- Responsive design

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cCode
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up the database:
   - Go to your Supabase project dashboard
   - Navigate to the SQL Editor
   - Run the SQL commands from `supabase-schema.sql`

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Schema

The application uses two main tables:

### Jobs Table
- `id`: UUID (Primary Key)
- `title`: Job title
- `description`: Job description
- `client_name`: Client name
- `amount`: Job amount (decimal)
- `is_paid`: Payment status (boolean)
- `payment_date`: Date of payment
- `payment_reference`: Payment reference number
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### Daily Progress Table
- `id`: UUID (Primary Key)
- `job_id`: Foreign key to jobs table
- `date`: Progress date
- `completed`: Completion status (boolean)
- `notes`: Optional notes
- `created_at`: Creation timestamp

## Deployment

### Deploy to Vercel

1. Push your code to GitHub

2. Go to [Vercel](https://vercel.com) and import your repository

3. Add environment variables in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. Deploy!

The app will automatically deploy on every push to your main branch.

## API Routes

- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create a new job
- `GET /api/jobs/[id]` - Get a specific job
- `PATCH /api/jobs/[id]` - Update a job (payment status, etc.)
- `DELETE /api/jobs/[id]` - Delete a job
- `GET /api/jobs/[id]/progress` - Get all progress entries for a job
- `POST /api/jobs/[id]/progress` - Create/update daily progress

## Usage

### Adding a Job
1. Click "Add New Job"
2. Fill in the job details (title, client, amount, description)
3. Click "Create Job"

### Marking as Paid
1. Click "Mark as Paid" on any job card
2. Check the "Mark as paid" checkbox
3. Enter payment date and optional reference
4. Click "Save"

### Tracking Daily Progress
1. Check the "Mark today's progress" checkbox on any job
2. The progress is automatically saved for today's date

### Filtering Jobs
- Click "All" to see all jobs
- Click "Paid" to see only paid jobs
- Click "Pending" to see jobs awaiting payment

## License

ISC
