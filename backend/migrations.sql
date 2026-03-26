START TRANSACTION;

ALTER TABLE "Leads" DROP CONSTRAINT "FK_Leads_Clients_ConvertedClientId";

ALTER TABLE "Invoices" RENAME COLUMN "Amount" TO "TotalAmount";

ALTER TABLE "Users" ADD "PasswordHash" text NOT NULL DEFAULT '';

ALTER TABLE "Users" ADD "Role" integer NOT NULL DEFAULT 0;

ALTER TABLE "Tasks" ADD "Description" text NOT NULL DEFAULT '';

ALTER TABLE "Projects" ADD "ClientId" uuid;

ALTER TABLE "Projects" ADD "Description" text NOT NULL DEFAULT '';

ALTER TABLE "Offers" ADD "Notes" text NOT NULL DEFAULT '';

ALTER TABLE "Offers" ADD "Status" integer NOT NULL DEFAULT 0;

ALTER TABLE "Leads" ADD "Status" integer NOT NULL DEFAULT 0;

ALTER TABLE "Invoices" ADD "ContractId" uuid;

ALTER TABLE "Invoices" ADD "Currency" text NOT NULL DEFAULT '';

ALTER TABLE "Invoices" ADD "DueDate" timestamp with time zone NOT NULL DEFAULT TIMESTAMPTZ '-infinity';

ALTER TABLE "Invoices" ADD "Status" integer NOT NULL DEFAULT 0;

ALTER TABLE "Contracts" ADD "Kpis" text NOT NULL DEFAULT '';

ALTER TABLE "Contracts" ADD "Status" integer NOT NULL DEFAULT 0;

ALTER TABLE "Contracts" ADD "Terms" text NOT NULL DEFAULT '';

ALTER TABLE "Contracts" ADD "TotalAmount" numeric NOT NULL DEFAULT 0.0;

CREATE TABLE "AdMetrics" (
    "Id" uuid NOT NULL,
    "ProjectId" uuid NOT NULL,
    "Platform" integer NOT NULL,
    "Spend" numeric NOT NULL,
    "Impressions" bigint NOT NULL,
    "Clicks" bigint NOT NULL,
    "Conversions" bigint NOT NULL,
    "Date" timestamp with time zone NOT NULL,
    "TenantId" uuid NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_AdMetrics" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_AdMetrics_Projects_ProjectId" FOREIGN KEY ("ProjectId") REFERENCES "Projects" ("Id") ON DELETE CASCADE
);

CREATE TABLE "InvoiceItem" (
    "Id" uuid NOT NULL,
    "Description" text NOT NULL,
    "Quantity" numeric NOT NULL,
    "UnitPrice" numeric NOT NULL,
    "InvoiceId" uuid NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_InvoiceItem" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_InvoiceItem_Invoices_InvoiceId" FOREIGN KEY ("InvoiceId") REFERENCES "Invoices" ("Id") ON DELETE CASCADE
);

CREATE TABLE "RefreshTokens" (
    "Id" uuid NOT NULL,
    "Token" text NOT NULL,
    "Expires" timestamp with time zone NOT NULL,
    "Created" timestamp with time zone NOT NULL,
    "CreatedByIp" text NOT NULL,
    "Revoked" timestamp with time zone,
    "RevokedByIp" text,
    "ReplacedByToken" text,
    "UserId" uuid NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_RefreshTokens" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_RefreshTokens_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
);

CREATE TABLE "TimeEntries" (
    "Id" uuid NOT NULL,
    "ProjectId" uuid NOT NULL,
    "UserId" uuid NOT NULL,
    "Hours" numeric NOT NULL,
    "Description" text NOT NULL,
    "Date" timestamp with time zone NOT NULL,
    "TenantId" uuid NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_TimeEntries" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_TimeEntries_Projects_ProjectId" FOREIGN KEY ("ProjectId") REFERENCES "Projects" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_TimeEntries_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
);

CREATE INDEX "IX_Projects_ClientId" ON "Projects" ("ClientId");

CREATE INDEX "IX_Invoices_ContractId" ON "Invoices" ("ContractId");

CREATE INDEX "IX_AdMetrics_ProjectId" ON "AdMetrics" ("ProjectId");

CREATE INDEX "IX_InvoiceItem_InvoiceId" ON "InvoiceItem" ("InvoiceId");

CREATE INDEX "IX_RefreshTokens_UserId" ON "RefreshTokens" ("UserId");

CREATE INDEX "IX_TimeEntries_ProjectId" ON "TimeEntries" ("ProjectId");

CREATE INDEX "IX_TimeEntries_UserId" ON "TimeEntries" ("UserId");

ALTER TABLE "Invoices" ADD CONSTRAINT "FK_Invoices_Contracts_ContractId" FOREIGN KEY ("ContractId") REFERENCES "Contracts" ("Id");

ALTER TABLE "Leads" ADD CONSTRAINT "FK_Leads_Clients_ConvertedClientId" FOREIGN KEY ("ConvertedClientId") REFERENCES "Clients" ("Id") ON DELETE SET NULL;

ALTER TABLE "Projects" ADD CONSTRAINT "FK_Projects_Clients_ClientId" FOREIGN KEY ("ClientId") REFERENCES "Clients" ("Id");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260325185924_AddAdMetricsAndTimeEntries', '8.0.11');

COMMIT;

START TRANSACTION;

ALTER TABLE "Projects" DROP CONSTRAINT "FK_Projects_Offers_OfferId";

ALTER TABLE "Projects" ALTER COLUMN "OfferId" DROP NOT NULL;

ALTER TABLE "Projects" ADD CONSTRAINT "FK_Projects_Offers_OfferId" FOREIGN KEY ("OfferId") REFERENCES "Offers" ("Id");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260325191105_MakeOfferIdNullable', '8.0.11');

COMMIT;

