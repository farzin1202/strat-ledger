-- Add user_id column to strategies table
ALTER TABLE public.strategies 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop existing overly permissive policies on strategies
DROP POLICY IF EXISTS "Anyone can delete strategies" ON public.strategies;
DROP POLICY IF EXISTS "Anyone can insert strategies" ON public.strategies;
DROP POLICY IF EXISTS "Anyone can read strategies" ON public.strategies;
DROP POLICY IF EXISTS "Anyone can update strategies" ON public.strategies;

-- Create proper RLS policies for strategies (owner-based)
CREATE POLICY "Users can read their own strategies" 
ON public.strategies FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own strategies" 
ON public.strategies FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own strategies" 
ON public.strategies FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own strategies" 
ON public.strategies FOR DELETE 
USING (auth.uid() = user_id);

-- Drop existing overly permissive policies on months
DROP POLICY IF EXISTS "Anyone can delete months" ON public.months;
DROP POLICY IF EXISTS "Anyone can insert months" ON public.months;
DROP POLICY IF EXISTS "Anyone can read months" ON public.months;
DROP POLICY IF EXISTS "Anyone can update months" ON public.months;

-- Create a security definer function to check strategy ownership
CREATE OR REPLACE FUNCTION public.owns_strategy(_strategy_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.strategies
    WHERE id = _strategy_id
      AND user_id = auth.uid()
  )
$$;

-- Create proper RLS policies for months (inherit ownership from strategy)
CREATE POLICY "Users can read their own months" 
ON public.months FOR SELECT 
USING (public.owns_strategy(strategy_id));

CREATE POLICY "Users can insert months to their strategies" 
ON public.months FOR INSERT 
WITH CHECK (public.owns_strategy(strategy_id));

CREATE POLICY "Users can update their own months" 
ON public.months FOR UPDATE 
USING (public.owns_strategy(strategy_id));

CREATE POLICY "Users can delete their own months" 
ON public.months FOR DELETE 
USING (public.owns_strategy(strategy_id));

-- Drop existing overly permissive policies on trades
DROP POLICY IF EXISTS "Anyone can delete trades" ON public.trades;
DROP POLICY IF EXISTS "Anyone can insert trades" ON public.trades;
DROP POLICY IF EXISTS "Anyone can read trades" ON public.trades;
DROP POLICY IF EXISTS "Anyone can update trades" ON public.trades;

-- Create a security definer function to check month ownership (through strategy)
CREATE OR REPLACE FUNCTION public.owns_month(_month_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.months m
    JOIN public.strategies s ON m.strategy_id = s.id
    WHERE m.id = _month_id
      AND s.user_id = auth.uid()
  )
$$;

-- Create proper RLS policies for trades (inherit ownership from month -> strategy)
CREATE POLICY "Users can read their own trades" 
ON public.trades FOR SELECT 
USING (public.owns_month(month_id));

CREATE POLICY "Users can insert trades to their months" 
ON public.trades FOR INSERT 
WITH CHECK (public.owns_month(month_id));

CREATE POLICY "Users can update their own trades" 
ON public.trades FOR UPDATE 
USING (public.owns_month(month_id));

CREATE POLICY "Users can delete their own trades" 
ON public.trades FOR DELETE 
USING (public.owns_month(month_id));