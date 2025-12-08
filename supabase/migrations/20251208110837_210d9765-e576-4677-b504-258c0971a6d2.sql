-- Add notes column to strategies table
ALTER TABLE public.strategies ADD COLUMN notes TEXT DEFAULT '';

-- Add notes column to months table
ALTER TABLE public.months ADD COLUMN notes TEXT DEFAULT '';