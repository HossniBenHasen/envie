CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TYPE travel_history_action_enum AS ENUM ('added', 'move', 'remove', 'awaiting');
CREATE TYPE company_activitytype_enum AS ENUM ('1', '2', '3');
CREATE TYPE family_activitytype_enum AS ENUM ('1', '2', '3');
CREATE TYPE user_role_enum AS ENUM ('admin', 'super-admin', 'warehouseman', 'operator', 'user');
CREATE TYPE company_vatrate_enum AS ENUM ('20', '10', '5.5', '2.1', '0');
CREATE TYPE order_status_enum AS ENUM ('waiting', 'in_progress', 'reserved_full', 'reserved_incomplete', 'delivered', 'canceled');
CREATE TYPE preparation_statut_enum AS ENUM ('in_progress', 'finished');

DROP TABLE IF EXISTS "bike";
DROP SEQUENCE IF EXISTS bike_id_seq;
CREATE SEQUENCE bike_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."bike" (
    "id" integer DEFAULT nextval('bike_id_seq') NOT NULL,
    "state" character varying(30) NOT NULL,
    "weight" double precision NOT NULL,
    "excludingTaxesPrice" double precision NOT NULL,
    "indicativePriceOfNewPiece" double precision NOT NULL,
    "comments" character varying(200),
    "designation" character varying(30) NOT NULL,
    "model" character varying(60) NOT NULL,
    "subfamilyId" uuid,
    "brandId" uuid,
    "storageLocationId" uuid,
    CONSTRAINT "PK_e4a433f76768045f7a2efca66e2" PRIMARY KEY ("id")
) WITH (oids = false);


DROP TABLE IF EXISTS "brand";
CREATE TABLE "public"."brand" (
    "id" uuid NOT NULL,
    "brandName" character varying NOT NULL,
    CONSTRAINT "PK_a5d20765ddd942eb5de4eee2d7f" PRIMARY KEY ("id")
) WITH (oids = false);


DROP TABLE IF EXISTS "company";
DROP SEQUENCE IF EXISTS company_id_seq;
CREATE SEQUENCE company_id_seq INCREMENT 1 MINVALUE 3 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."company" (
    "id" integer DEFAULT nextval('company_id_seq') NOT NULL,
    "activityType" company_activitytype_enum,
    "name" character varying(40) NOT NULL,
    "siretNumber" character varying(14) NOT NULL,
    "street" character varying(45) NOT NULL,
    "zipCode" character varying(12) NOT NULL,
    "city" character varying(68) NOT NULL,
    "country" character varying(45) NOT NULL,
    "phoneNumber" character varying(12) NOT NULL,
    "mailAddress" character varying NOT NULL,
    "vatRate" company_vatrate_enum,
    CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id"),
    CONSTRAINT "UQ_70ffcfde701e2c9645e34be27d6" UNIQUE ("siretNumber"),
    CONSTRAINT "UQ_a76c5cd486f7779bd9c319afd27" UNIQUE ("name")
) WITH (oids = false);

DROP TABLE IF EXISTS "user";
CREATE TABLE "public"."user" (
    "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
    "username" character varying NOT NULL,
    "password" character varying NOT NULL,
    "role" user_role_enum DEFAULT 'admin',
    "companyId" integer NOT NULL,
    CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY  ("id"),
    CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username")
) WITH (oids = false);



DROP TABLE IF EXISTS "family";
CREATE TABLE "public"."family" (
    "id" uuid NOT NULL,
    "familyName" character varying NOT NULL,
    "activityType" family_activitytype_enum NOT NULL,
    CONSTRAINT "PK_ba386a5a59c3de8593cda4e5626" PRIMARY KEY ("id"),
    CONSTRAINT "UQ_2e3260e5265fee23836ae447cd1" UNIQUE ("familyName")
) WITH (oids = false);


DROP TABLE IF EXISTS "order";
DROP SEQUENCE IF EXISTS order_id_seq;
CREATE SEQUENCE order_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."order" (
    "id" integer DEFAULT nextval('order_id_seq') NOT NULL,
    "createdAt" timestamp DEFAULT now() NOT NULL,
    "status" order_status_enum DEFAULT 'waiting' NOT NULL,
    "comment" text,
    "userId" uuid NOT NULL,
    CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id")
) WITH (oids = false);


DROP TABLE IF EXISTS "preparation";
DROP SEQUENCE IF EXISTS preparation_id_seq;
CREATE SEQUENCE preparation_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."preparation" (
    "id" integer DEFAULT nextval('preparation_id_seq') NOT NULL,
    "createdAt" timestamp DEFAULT now() NOT NULL,
    "statut" preparation_statut_enum DEFAULT 'in_progress' NOT NULL,
    "name" character varying NOT NULL,
    "comment" text,
    "userId" uuid NOT NULL,
    CONSTRAINT "PK_c8270f360081237a441fcea17b6" PRIMARY KEY ("id")
) WITH (oids = false);


DROP TABLE IF EXISTS "preparation_replacement_pieces_replacement_piece";
CREATE TABLE "public"."preparation_replacement_pieces_replacement_piece" (
    "preparationId" integer NOT NULL,
    "replacementPieceId" integer NOT NULL,
    CONSTRAINT "PK_0691fbc7b17c11a74cb61c63122" PRIMARY KEY ("preparationId", "replacementPieceId")
) WITH (oids = false);

CREATE INDEX "IDX_60e89de30b078cfb370a5eb64e" ON "public"."preparation_replacement_pieces_replacement_piece" USING btree ("replacementPieceId");

CREATE INDEX "IDX_b348712956d1ff5c389491720e" ON "public"."preparation_replacement_pieces_replacement_piece" USING btree ("preparationId");

DROP TABLE IF EXISTS "replacement_piece";
DROP SEQUENCE IF EXISTS replacement_piece_id_seq;
CREATE SEQUENCE replacement_piece_id_seq INCREMENT 1 MINVALUE 161 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."replacement_piece" (
    "id" integer DEFAULT nextval('replacement_piece_id_seq') NOT NULL,
    "state" character varying(30) NOT NULL,
    "supplier" character varying(10) NOT NULL,
    "weight" double precision,
    "excludingTaxesPrice" double precision,
    "indicativePriceOfNewPiece" double precision,
    "comments" character varying(200),
    "manufacturerReferenceOfPiece" character varying(20) NOT NULL,
    "designationInterne" character varying(30) NOT NULL,
    "designationFournisseur" character varying(30) NOT NULL,
    "model" character varying(60) NOT NULL,
    "technicalReferenceDevice" character varying(20) NOT NULL,
    "serialNumber" character varying(30) NOT NULL,
    "dismantlingDate" timestamp,
    "entryStockDate" timestamp DEFAULT now() NOT NULL,
    "releaseStockDate" timestamp DEFAULT now() NOT NULL,
    "subfamilyId" uuid,
    "userId" uuid,
    "brandId" uuid,
    "storageLocationId" uuid,
    "orderId" integer,
    "companyId" integer,
    CONSTRAINT "PK_0ccfd1c54f90809ce156ffa6765" PRIMARY KEY ("id")
) WITH (oids = false);


DROP TABLE IF EXISTS "storage";
CREATE TABLE "public"."storage" (
    "id" uuid NOT NULL,
    "name" character varying NOT NULL,
    "internalName" character varying NOT NULL,
    "street" character varying(45) NOT NULL,
    "zipCode" character varying NOT NULL,
    "city" character varying(68) NOT NULL,
    "country" character varying(42) NOT NULL,
    "phoneNumber" character varying NOT NULL,
    "mailAddress" character varying NOT NULL,
    "responsiblePerson" character varying NOT NULL,
    "numberOfRows" integer NOT NULL,
    "columnPerRow" integer NOT NULL,
    "shelfPerColumn" integer NOT NULL,
    "locationPerShelf" integer NOT NULL,
    "companyId" integer,
    CONSTRAINT "PK_f9b67a9921474d86492aad2e027" PRIMARY KEY ("id"),
    CONSTRAINT "UQ_252edd3cbb39e121d8131966097" UNIQUE ("name"),
    CONSTRAINT "UQ_58c884c224d8f25988172a5dd76" UNIQUE ("internalName")
) WITH (oids = false);


DROP TABLE IF EXISTS "storage_location";
CREATE TABLE "public"."storage_location" (
    "id" uuid NOT NULL,
    "rowNumber" integer NOT NULL,
    "columnNumber" integer NOT NULL,
    "shelfNumber" integer NOT NULL,
    "locationNumber" integer NOT NULL,
    "storageId" uuid,
    CONSTRAINT "IDX_8b58870335b2dd34c51f5426e9" UNIQUE ("storageId", "rowNumber", "columnNumber", "shelfNumber", "locationNumber"),
    CONSTRAINT "PK_4c6e10a5d14468e331311842d3c" PRIMARY KEY ("id")
) WITH (oids = false);


DROP TABLE IF EXISTS "subfamily";
CREATE TABLE "public"."subfamily" (
    "id" uuid NOT NULL,
    "subfamilyName" character varying NOT NULL,
    "familyId" uuid,
    CONSTRAINT "IDX_fe0aa167249133310449455b93" UNIQUE ("subfamilyName", "familyId"),
    CONSTRAINT "PK_6022059066e369bab1616cdfaa5" PRIMARY KEY ("id")
) WITH (oids = false);


DROP TABLE IF EXISTS "travel_history";
DROP SEQUENCE IF EXISTS travel_history_id_seq;
CREATE SEQUENCE travel_history_id_seq INCREMENT 1 MINVALUE 74 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."travel_history" (
    "id" integer DEFAULT nextval('travel_history_id_seq') NOT NULL,
    "action" travel_history_action_enum,
    "referringUser" character varying NOT NULL,
    "createdAt" timestamp DEFAULT now() NOT NULL,
    "replacementPieceId" integer,
    "storageLocationId" uuid,
    CONSTRAINT "PK_f73adcba1ffebd5ad0e951bfff3" PRIMARY KEY ("id")
) WITH (oids = false);


ALTER TABLE ONLY "public"."bike" ADD CONSTRAINT "FK_a21bcd3ca5c7986ba273dd45843" FOREIGN KEY ("subfamilyId") REFERENCES subfamily(id) NOT DEFERRABLE;
ALTER TABLE ONLY "public"."bike" ADD CONSTRAINT "FK_a6de22da107a5d7c84d0d74ef1f" FOREIGN KEY ("brandId") REFERENCES brand(id) NOT DEFERRABLE;
ALTER TABLE ONLY "public"."bike" ADD CONSTRAINT "FK_b1f6e2d8b548052e15445e79caf" FOREIGN KEY ("storageLocationId") REFERENCES storage_location(id) NOT DEFERRABLE;

ALTER TABLE ONLY "public"."order" ADD CONSTRAINT "FK_caabe91507b3379c7ba73637b84" FOREIGN KEY ("userId") REFERENCES "user"(id) NOT DEFERRABLE;

ALTER TABLE ONLY "public"."preparation" ADD CONSTRAINT "FK_17ff546b3b31e3a4b962e7456fa" FOREIGN KEY ("userId") REFERENCES "user"(id) NOT DEFERRABLE;

ALTER TABLE ONLY "public"."preparation_replacement_pieces_replacement_piece" ADD CONSTRAINT "FK_60e89de30b078cfb370a5eb64e7" FOREIGN KEY ("replacementPieceId") REFERENCES replacement_piece(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;
ALTER TABLE ONLY "public"."preparation_replacement_pieces_replacement_piece" ADD CONSTRAINT "FK_b348712956d1ff5c389491720e6" FOREIGN KEY ("preparationId") REFERENCES preparation(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."replacement_piece" ADD CONSTRAINT "FK_26344de7bf1d575b4f9eb1d55e8" FOREIGN KEY ("companyId") REFERENCES company(id) NOT DEFERRABLE;
ALTER TABLE ONLY "public"."replacement_piece" ADD CONSTRAINT "FK_6a220132ad07e463e4d23150501" FOREIGN KEY ("orderId") REFERENCES "order"(id) NOT DEFERRABLE;
ALTER TABLE ONLY "public"."replacement_piece" ADD CONSTRAINT "FK_7d78477889e8093232541f134bc" FOREIGN KEY ("storageLocationId") REFERENCES storage_location(id) NOT DEFERRABLE;
ALTER TABLE ONLY "public"."replacement_piece" ADD CONSTRAINT "FK_c6ee654a87c86cd082345992cda" FOREIGN KEY ("subfamilyId") REFERENCES subfamily(id) NOT DEFERRABLE;
ALTER TABLE ONLY "public"."replacement_piece" ADD CONSTRAINT "FK_e0c506a3675f4e23d3b19862d66" FOREIGN KEY ("brandId") REFERENCES brand(id) NOT DEFERRABLE;

ALTER TABLE ONLY "public"."storage" ADD CONSTRAINT "FK_845c96d32bddb0d41d98ce564ec" FOREIGN KEY ("companyId") REFERENCES company(id) NOT DEFERRABLE;

ALTER TABLE ONLY "public"."storage_location" ADD CONSTRAINT "FK_fe497ecdbe87e0fdfb2a820b161" FOREIGN KEY ("storageId") REFERENCES storage(id) NOT DEFERRABLE;

ALTER TABLE ONLY "public"."subfamily" ADD CONSTRAINT "FK_9cb902d58fe1a5b726b13782cc5" FOREIGN KEY ("familyId") REFERENCES family(id) NOT DEFERRABLE;

ALTER TABLE ONLY "public"."travel_history" ADD CONSTRAINT "FK_3f3dc5803f3da12206c192e27ab" FOREIGN KEY ("replacementPieceId") REFERENCES replacement_piece(id) NOT DEFERRABLE;
ALTER TABLE ONLY "public"."travel_history" ADD CONSTRAINT "FK_957af320e67599cabe8c928b33c" FOREIGN KEY ("storageLocationId") REFERENCES storage_location(id) NOT DEFERRABLE;

ALTER TABLE ONLY "public"."user" ADD CONSTRAINT "FK_86586021a26d1180b0968f98502" FOREIGN KEY ("companyId") REFERENCES company(id) NOT DEFERRABLE;
