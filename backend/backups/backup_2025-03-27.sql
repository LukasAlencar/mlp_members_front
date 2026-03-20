--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

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
-- Name: Role; Type: TYPE; Schema: public; Owner: mlp_members
--

CREATE TYPE public."Role" AS ENUM (
    'ADMIN',
    'MEMBER',
    'ELDER',
    'PASTOR',
    'DEACON',
    'AUXILIARY'
);


ALTER TYPE public."Role" OWNER TO mlp_members;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Member; Type: TABLE; Schema: public; Owner: mlp_members
--

CREATE TABLE public."Member" (
    id text NOT NULL,
    email text,
    name text NOT NULL,
    "birthDate" timestamp(3) without time zone NOT NULL,
    rg text NOT NULL,
    cpf text NOT NULL,
    phone text NOT NULL,
    role public."Role" DEFAULT 'MEMBER'::public."Role" NOT NULL,
    "baptismDate" timestamp(3) without time zone,
    "memberSince" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "imagePath" text
);


ALTER TABLE public."Member" OWNER TO mlp_members;

--
-- Name: User; Type: TABLE; Schema: public; Owner: mlp_members
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    name text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO mlp_members;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: mlp_members
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO mlp_members;

--
-- Data for Name: Member; Type: TABLE DATA; Schema: public; Owner: mlp_members
--

COPY public."Member" (id, email, name, "birthDate", rg, cpf, phone, role, "baptismDate", "memberSince", "createdAt", "updatedAt", "imagePath") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: mlp_members
--

COPY public."User" (id, email, password, name, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: mlp_members
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
860288cc-13ca-4bd3-aadd-2845982063e4	0af7cd0713c48071c3a69f4da3753dd65af9a6c4781d168c0acf6cd2d0fe9596	2025-03-27 18:11:15.797283+00	20250315175121_init	\N	\N	2025-03-27 18:11:15.760096+00	1
984d1acf-a2b2-42ed-a852-2418aa3916ef	c5e052dc6a42ff4c2577e68f32ef6f653b79f3fbdf84007d417f9bef7a0c4271	2025-03-27 18:11:15.807661+00	20250315182236_add_auxiliary_role	\N	\N	2025-03-27 18:11:15.800494+00	1
7ca01d3a-37f3-4023-8904-ddd2a8a6e544	b3165fed826d6e8eaa90e7e0309eab6efba84389966190143d4732dce452032e	2025-03-27 18:11:15.829426+00	20250315211412_add_users_configs	\N	\N	2025-03-27 18:11:15.809649+00	1
3ea6b884-39ce-4a48-8bb9-e6344e400d27	c4b26d0263d4ec14f16a6bfd1deff6e2996239c557154213d1b4d035ef0086cc	2025-03-27 18:11:15.844685+00	20250319203134_add_unique_to_fields_rg_cpf	\N	\N	2025-03-27 18:11:15.832803+00	1
152e3085-4481-4bbd-876b-4aaff2660282	54b5ba861783bae350614685c535ac074888c903e9e82b199f2b2beee27e163b	2025-03-27 18:11:15.85295+00	20250323174401_add_field_image_path	\N	\N	2025-03-27 18:11:15.848045+00	1
\.


--
-- Name: Member Member_pkey; Type: CONSTRAINT; Schema: public; Owner: mlp_members
--

ALTER TABLE ONLY public."Member"
    ADD CONSTRAINT "Member_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: mlp_members
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: mlp_members
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Member_cpf_key; Type: INDEX; Schema: public; Owner: mlp_members
--

CREATE UNIQUE INDEX "Member_cpf_key" ON public."Member" USING btree (cpf);


--
-- Name: Member_email_key; Type: INDEX; Schema: public; Owner: mlp_members
--

CREATE UNIQUE INDEX "Member_email_key" ON public."Member" USING btree (email);


--
-- Name: Member_rg_key; Type: INDEX; Schema: public; Owner: mlp_members
--

CREATE UNIQUE INDEX "Member_rg_key" ON public."Member" USING btree (rg);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: mlp_members
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- PostgreSQL database dump complete
--

