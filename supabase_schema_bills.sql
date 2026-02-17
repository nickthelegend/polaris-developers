-- Create a table for bills
create table bills (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  amount numeric not null,
  currency text not null default 'USD',
  description text,
  status text default 'pending', -- pending, paid, cancelled
  merchant_id uuid references merchant_apps(id),
  metadata jsonb,
  shopify_order_id text,
  checkout_url text
);

-- RLS policies
alter table bills enable row level security;

create policy "Enable read access for all users" on bills for select using (true);
create policy "Enable insert for authenticated users" on bills for insert with check (true);
