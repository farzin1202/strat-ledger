CREATE EXTENSION IF NOT EXISTS "pg_graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "plpgsql";
CREATE EXTENSION IF NOT EXISTS "supabase_vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: create_admin_user(text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.create_admin_user(p_username text, p_password text) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO public.admin_users (username, password_hash)
  VALUES (p_username, crypt(p_password, gen_salt('bf')))
  RETURNING id INTO new_id;
  RETURN new_id;
END;
$$;


--
-- Name: delete_api_key(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.delete_api_key(p_key_id uuid) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  DELETE FROM public.api_keys WHERE id = p_key_id;
  RETURN FOUND;
END;
$$;


--
-- Name: generate_api_key(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.generate_api_key(p_key_name text) RETURNS text
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  new_key TEXT;
BEGIN
  new_key := encode(gen_random_bytes(32), 'hex');
  INSERT INTO public.api_keys (key_name, api_key)
  VALUES (p_key_name, new_key);
  RETURN new_key;
END;
$$;


--
-- Name: get_api_keys(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_api_keys() RETURNS TABLE(id uuid, key_name text, api_key text, is_active boolean, created_at timestamp with time zone)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  RETURN QUERY
  SELECT ak.id, ak.key_name, ak.api_key, ak.is_active, ak.created_at
  FROM public.api_keys ak
  ORDER BY ak.created_at DESC;
END;
$$;


--
-- Name: toggle_api_key(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.toggle_api_key(p_key_id uuid) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  UPDATE public.api_keys SET is_active = NOT is_active WHERE id = p_key_id;
  RETURN FOUND;
END;
$$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


--
-- Name: verify_admin_login(text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.verify_admin_login(p_username text, p_password text) RETURNS TABLE(success boolean, admin_id uuid)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    true AS success,
    au.id AS admin_id
  FROM public.admin_users au
  WHERE au.username = p_username 
    AND au.password_hash = crypt(p_password, au.password_hash);
END;
$$;


SET default_table_access_method = heap;

--
-- Name: admin_users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admin_users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    username text NOT NULL,
    password_hash text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: api_keys; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.api_keys (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    key_name text NOT NULL,
    api_key text NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: months; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.months (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    strategy_id uuid NOT NULL,
    name text NOT NULL,
    year integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: strategies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.strategies (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: trades; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.trades (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    month_id uuid NOT NULL,
    date date NOT NULL,
    pair text NOT NULL,
    direction text NOT NULL,
    entry_price numeric(20,8) DEFAULT 0 NOT NULL,
    exit_price numeric(20,8) DEFAULT 0 NOT NULL,
    risk_reward numeric(10,2) DEFAULT 2 NOT NULL,
    result text NOT NULL,
    profit_loss_dollar numeric(20,2) DEFAULT 0 NOT NULL,
    profit_loss_percent numeric(10,2) DEFAULT 0 NOT NULL,
    trade_count integer DEFAULT 1 NOT NULL,
    max_percent numeric(10,2) DEFAULT NULL::numeric,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT trades_direction_check CHECK ((direction = ANY (ARRAY['long'::text, 'short'::text]))),
    CONSTRAINT trades_result_check CHECK ((result = ANY (ARRAY['win'::text, 'loss'::text])))
);


--
-- Name: admin_users admin_users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_pkey PRIMARY KEY (id);


--
-- Name: admin_users admin_users_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_username_key UNIQUE (username);


--
-- Name: api_keys api_keys_api_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_api_key_key UNIQUE (api_key);


--
-- Name: api_keys api_keys_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_pkey PRIMARY KEY (id);


--
-- Name: months months_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.months
    ADD CONSTRAINT months_pkey PRIMARY KEY (id);


--
-- Name: strategies strategies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.strategies
    ADD CONSTRAINT strategies_pkey PRIMARY KEY (id);


--
-- Name: trades trades_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trades
    ADD CONSTRAINT trades_pkey PRIMARY KEY (id);


--
-- Name: strategies update_strategies_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_strategies_updated_at BEFORE UPDATE ON public.strategies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: months months_strategy_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.months
    ADD CONSTRAINT months_strategy_id_fkey FOREIGN KEY (strategy_id) REFERENCES public.strategies(id) ON DELETE CASCADE;


--
-- Name: trades trades_month_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trades
    ADD CONSTRAINT trades_month_id_fkey FOREIGN KEY (month_id) REFERENCES public.months(id) ON DELETE CASCADE;


--
-- Name: months Anyone can delete months; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can delete months" ON public.months FOR DELETE USING (true);


--
-- Name: strategies Anyone can delete strategies; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can delete strategies" ON public.strategies FOR DELETE USING (true);


--
-- Name: trades Anyone can delete trades; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can delete trades" ON public.trades FOR DELETE USING (true);


--
-- Name: months Anyone can insert months; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can insert months" ON public.months FOR INSERT WITH CHECK (true);


--
-- Name: strategies Anyone can insert strategies; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can insert strategies" ON public.strategies FOR INSERT WITH CHECK (true);


--
-- Name: trades Anyone can insert trades; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can insert trades" ON public.trades FOR INSERT WITH CHECK (true);


--
-- Name: months Anyone can read months; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can read months" ON public.months FOR SELECT USING (true);


--
-- Name: strategies Anyone can read strategies; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can read strategies" ON public.strategies FOR SELECT USING (true);


--
-- Name: trades Anyone can read trades; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can read trades" ON public.trades FOR SELECT USING (true);


--
-- Name: months Anyone can update months; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can update months" ON public.months FOR UPDATE USING (true);


--
-- Name: strategies Anyone can update strategies; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can update strategies" ON public.strategies FOR UPDATE USING (true);


--
-- Name: trades Anyone can update trades; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can update trades" ON public.trades FOR UPDATE USING (true);


--
-- Name: admin_users No direct access to admin_users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "No direct access to admin_users" ON public.admin_users USING (false);


--
-- Name: api_keys No direct access to api_keys; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "No direct access to api_keys" ON public.api_keys USING (false);


--
-- Name: admin_users; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

--
-- Name: api_keys; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

--
-- Name: months; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.months ENABLE ROW LEVEL SECURITY;

--
-- Name: strategies; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.strategies ENABLE ROW LEVEL SECURITY;

--
-- Name: trades; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


