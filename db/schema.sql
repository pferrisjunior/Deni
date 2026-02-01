CREATE EXTENSION IF NOT EXISTS pgcrypto;

--
-- PostgreSQL database dump
--

\restrict PRRD9BgJ5WB9Y5ptGxXfy992OmOvef1wVSYowHsqPnL1nd6yeVeNnHZB1KkFXfo

-- Dumped from database version 14.19 (Homebrew)
-- Dumped by pg_dump version 14.19 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: jonblancett
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO jonblancett;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: jonblancett
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: event_media; Type: TABLE; Schema: public; Owner: jonblancett
--

CREATE TABLE public.event_media (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    event_id uuid NOT NULL,
    url text NOT NULL,
    media_type text DEFAULT 'image'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT event_media_media_type_check CHECK ((media_type = 'image'::text))
);


ALTER TABLE public.event_media OWNER TO jonblancett;

--
-- Name: events; Type: TABLE; Schema: public; Owner: jonblancett
--

CREATE TABLE public.events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_by_user_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    start_time timestamp with time zone NOT NULL,
    end_time timestamp with time zone,
    location_name text NOT NULL,
    address_text text,
    lat numeric(9,6) NOT NULL,
    lng numeric(9,6) NOT NULL,
    category text NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    trust_score integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT events_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'published'::text, 'archived'::text])))
);


ALTER TABLE public.events OWNER TO jonblancett;

--
-- Name: food_trucks; Type: TABLE; Schema: public; Owner: jonblancett
--

CREATE TABLE public.food_trucks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    owner_user_id uuid NOT NULL,
    name text NOT NULL,
    description text,
    phone text,
    email text,
    website_url text,
    status text DEFAULT 'active'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT food_trucks_status_check CHECK ((status = ANY (ARRAY['active'::text, 'inactive'::text])))
);


ALTER TABLE public.food_trucks OWNER TO jonblancett;

--
-- Name: truck_media; Type: TABLE; Schema: public; Owner: jonblancett
--

CREATE TABLE public.truck_media (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    food_truck_id uuid NOT NULL,
    url text NOT NULL,
    media_type text DEFAULT 'image'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT truck_media_media_type_check CHECK ((media_type = 'image'::text))
);


ALTER TABLE public.truck_media OWNER TO jonblancett;

--
-- Name: truck_stops; Type: TABLE; Schema: public; Owner: jonblancett
--

CREATE TABLE public.truck_stops (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    food_truck_id uuid NOT NULL,
    created_by_user_id uuid NOT NULL,
    start_time timestamp with time zone NOT NULL,
    end_time timestamp with time zone,
    location_name text NOT NULL,
    address_text text,
    lat numeric(9,6) NOT NULL,
    lng numeric(9,6) NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    trust_score integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT truck_stops_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'published'::text, 'archived'::text])))
);


ALTER TABLE public.truck_stops OWNER TO jonblancett;

--
-- Name: users; Type: TABLE; Schema: public; Owner: jonblancett
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    display_name text NOT NULL,
    role text DEFAULT 'user'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT users_role_check CHECK ((role = ANY (ARRAY['user'::text, 'host'::text, 'admin'::text])))
);


ALTER TABLE public.users OWNER TO jonblancett;

--
-- Name: verification_submissions; Type: TABLE; Schema: public; Owner: jonblancett
--

CREATE TABLE public.verification_submissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    submitted_by_user_id uuid NOT NULL,
    target_type text NOT NULL,
    target_id uuid NOT NULL,
    method text NOT NULL,
    evidence_url text,
    note text,
    verdict text DEFAULT 'pending'::text NOT NULL,
    reviewed_by_user_id uuid,
    reviewed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT verification_submissions_method_check CHECK ((method = ANY (ARRAY['photo'::text, 'link'::text, 'check_in'::text, 'host_claim'::text]))),
    CONSTRAINT verification_submissions_target_type_check CHECK ((target_type = ANY (ARRAY['event'::text, 'truck_stop'::text]))),
    CONSTRAINT verification_submissions_verdict_check CHECK ((verdict = ANY (ARRAY['pending'::text, 'accepted'::text, 'rejected'::text])))
);


ALTER TABLE public.verification_submissions OWNER TO jonblancett;

--
-- Name: event_media event_media_pkey; Type: CONSTRAINT; Schema: public; Owner: jonblancett
--

ALTER TABLE ONLY public.event_media
    ADD CONSTRAINT event_media_pkey PRIMARY KEY (id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: jonblancett
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: food_trucks food_trucks_pkey; Type: CONSTRAINT; Schema: public; Owner: jonblancett
--

ALTER TABLE ONLY public.food_trucks
    ADD CONSTRAINT food_trucks_pkey PRIMARY KEY (id);


--
-- Name: truck_media truck_media_pkey; Type: CONSTRAINT; Schema: public; Owner: jonblancett
--

ALTER TABLE ONLY public.truck_media
    ADD CONSTRAINT truck_media_pkey PRIMARY KEY (id);


--
-- Name: truck_stops truck_stops_pkey; Type: CONSTRAINT; Schema: public; Owner: jonblancett
--

ALTER TABLE ONLY public.truck_stops
    ADD CONSTRAINT truck_stops_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: jonblancett
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: jonblancett
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: verification_submissions verification_submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: jonblancett
--

ALTER TABLE ONLY public.verification_submissions
    ADD CONSTRAINT verification_submissions_pkey PRIMARY KEY (id);


--
-- Name: idx_events_lat_lng; Type: INDEX; Schema: public; Owner: jonblancett
--

CREATE INDEX idx_events_lat_lng ON public.events USING btree (lat, lng);


--
-- Name: idx_events_start_time; Type: INDEX; Schema: public; Owner: jonblancett
--

CREATE INDEX idx_events_start_time ON public.events USING btree (start_time);


--
-- Name: idx_food_trucks_owner; Type: INDEX; Schema: public; Owner: jonblancett
--

CREATE INDEX idx_food_trucks_owner ON public.food_trucks USING btree (owner_user_id);


--
-- Name: idx_truck_media_truck; Type: INDEX; Schema: public; Owner: jonblancett
--

CREATE INDEX idx_truck_media_truck ON public.truck_media USING btree (food_truck_id);


--
-- Name: idx_truck_stops_lat_lng; Type: INDEX; Schema: public; Owner: jonblancett
--

CREATE INDEX idx_truck_stops_lat_lng ON public.truck_stops USING btree (lat, lng);


--
-- Name: idx_truck_stops_start_time; Type: INDEX; Schema: public; Owner: jonblancett
--

CREATE INDEX idx_truck_stops_start_time ON public.truck_stops USING btree (start_time);


--
-- Name: idx_truck_stops_truck; Type: INDEX; Schema: public; Owner: jonblancett
--

CREATE INDEX idx_truck_stops_truck ON public.truck_stops USING btree (food_truck_id);


--
-- Name: idx_verification_submitter; Type: INDEX; Schema: public; Owner: jonblancett
--

CREATE INDEX idx_verification_submitter ON public.verification_submissions USING btree (submitted_by_user_id);


--
-- Name: idx_verification_target; Type: INDEX; Schema: public; Owner: jonblancett
--

CREATE INDEX idx_verification_target ON public.verification_submissions USING btree (target_type, target_id);


--
-- Name: event_media event_media_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jonblancett
--

ALTER TABLE ONLY public.event_media
    ADD CONSTRAINT event_media_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;


--
-- Name: events events_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jonblancett
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: food_trucks food_trucks_owner_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jonblancett
--

ALTER TABLE ONLY public.food_trucks
    ADD CONSTRAINT food_trucks_owner_user_id_fkey FOREIGN KEY (owner_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: truck_media truck_media_food_truck_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jonblancett
--

ALTER TABLE ONLY public.truck_media
    ADD CONSTRAINT truck_media_food_truck_id_fkey FOREIGN KEY (food_truck_id) REFERENCES public.food_trucks(id) ON DELETE CASCADE;


--
-- Name: truck_stops truck_stops_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jonblancett
--

ALTER TABLE ONLY public.truck_stops
    ADD CONSTRAINT truck_stops_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: truck_stops truck_stops_food_truck_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jonblancett
--

ALTER TABLE ONLY public.truck_stops
    ADD CONSTRAINT truck_stops_food_truck_id_fkey FOREIGN KEY (food_truck_id) REFERENCES public.food_trucks(id) ON DELETE CASCADE;


--
-- Name: verification_submissions verification_submissions_reviewed_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jonblancett
--

ALTER TABLE ONLY public.verification_submissions
    ADD CONSTRAINT verification_submissions_reviewed_by_user_id_fkey FOREIGN KEY (reviewed_by_user_id) REFERENCES public.users(id);


--
-- Name: verification_submissions verification_submissions_submitted_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jonblancett
--

ALTER TABLE ONLY public.verification_submissions
    ADD CONSTRAINT verification_submissions_submitted_by_user_id_fkey FOREIGN KEY (submitted_by_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict PRRD9BgJ5WB9Y5ptGxXfy992OmOvef1wVSYowHsqPnL1nd6yeVeNnHZB1KkFXfo

