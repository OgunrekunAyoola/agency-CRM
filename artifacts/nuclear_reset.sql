CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL,
    CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
);

START TRANSACTION;

CREATE TABLE "AdminAlerts" (
    "Id" uuid NOT NULL,
    "Title" text NOT NULL,
    "Message" text NOT NULL,
    "Severity" integer NOT NULL,
    "IsResolved" boolean NOT NULL,
    "ResolutionNotes" text,
    "Source" text,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_AdminAlerts" PRIMARY KEY ("Id")
);

CREATE TABLE "Clients" (
    "Id" uuid NOT NULL,
    "Name" text NOT NULL,
    "LegalName" text NOT NULL,
    "VatNumber" text NOT NULL,
    "BusinessAddress" text NOT NULL,
    "Industry" text NOT NULL,
    "Priority" integer NOT NULL,
    "TenantId" uuid NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_Clients" PRIMARY KEY ("Id")
);

CREATE TABLE "OutboxMessages" (
    "Id" uuid NOT NULL,
    "Type" text NOT NULL,
    "Content" text NOT NULL,
    "ProcessedAt" timestamp with time zone,
    "Error" text,
    "RetryCount" integer NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_OutboxMessages" PRIMARY KEY ("Id")
);

CREATE TABLE "TaskTemplates" (
    "Id" uuid NOT NULL,
    "ServiceType" text NOT NULL,
    "TaskTitle" text NOT NULL,
    "TaskDescription" text NOT NULL,
    "DefaultPriority" text NOT NULL,
    "TenantId" uuid NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_TaskTemplates" PRIMARY KEY ("Id")
);

CREATE TABLE "Tenants" (
    "Id" uuid NOT NULL,
    "Name" text NOT NULL,
    "Industry" text,
    "CompanySize" text,
    "Website" text,
    "LogoUrl" text,
    "BrandColor" text,
    "TargetMonthlyRevenue" numeric NOT NULL,
    "BusinessAddress" text,
    "OnboardingCompleted" boolean NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_Tenants" PRIMARY KEY ("Id")
);

CREATE TABLE "Contacts" (
    "Id" uuid NOT NULL,
    "FirstName" text NOT NULL,
    "LastName" text NOT NULL,
    "Email" text NOT NULL,
    "ClientId" uuid NOT NULL,
    "TenantId" uuid NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_Contacts" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_Contacts_Clients_ClientId" FOREIGN KEY ("ClientId") REFERENCES "Clients" ("Id") ON DELETE CASCADE
);

CREATE TABLE "Users" (
    "Id" uuid NOT NULL,
    "Email" text NOT NULL,
    "FullName" text NOT NULL,
    "JobTitle" text,
    "PhoneNumber" text,
    "AvatarUrl" text,
    "PasswordHash" text NOT NULL,
    "Role" integer NOT NULL,
    "TenantId" uuid NOT NULL,
    "HourlyRate" numeric NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_Users" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_Users_Tenants_TenantId" FOREIGN KEY ("TenantId") REFERENCES "Tenants" ("Id") ON DELETE CASCADE
);

CREATE TABLE "Leads" (
    "Id" uuid NOT NULL,
    "Title" text NOT NULL,
    "Description" text NOT NULL,
    "ContactName" text NOT NULL,
    "CompanyName" text NOT NULL,
    "Email" text NOT NULL,
    "Phone" text NOT NULL,
    "Source" integer NOT NULL,
    "Interest" integer NOT NULL,
    "BudgetRange" text NOT NULL,
    "Status" integer NOT NULL,
    "PipelineStage" integer NOT NULL,
    "Probability" integer NOT NULL,
    "DealValue" numeric,
    "OwnerId" uuid,
    "ConvertedClientId" uuid,
    "TenantId" uuid NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_Leads" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_Leads_Clients_ConvertedClientId" FOREIGN KEY ("ConvertedClientId") REFERENCES "Clients" ("Id") ON DELETE SET NULL,
    CONSTRAINT "FK_Leads_Users_OwnerId" FOREIGN KEY ("OwnerId") REFERENCES "Users" ("Id")
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

CREATE TABLE "Offers" (
    "Id" uuid NOT NULL,
    "Title" text NOT NULL,
    "TotalAmount" numeric NOT NULL,
    "Status" integer NOT NULL,
    "Notes" text NOT NULL,
    "ViewedAt" timestamp with time zone,
    "LeadId" uuid NOT NULL,
    "QuoteTemplateId" text,
    "QuoteOpenedAt" timestamp with time zone,
    "HasBeenViewed" boolean NOT NULL,
    "TenantId" uuid NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_Offers" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_Offers_Leads_LeadId" FOREIGN KEY ("LeadId") REFERENCES "Leads" ("Id") ON DELETE CASCADE
);

CREATE TABLE "OfferItems" (
    "Id" uuid NOT NULL,
    "Title" text NOT NULL,
    "Description" text NOT NULL,
    "Amount" numeric NOT NULL,
    "Order" integer NOT NULL,
    "OfferId" uuid NOT NULL,
    "TenantId" uuid NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_OfferItems" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_OfferItems_Offers_OfferId" FOREIGN KEY ("OfferId") REFERENCES "Offers" ("Id") ON DELETE CASCADE
);

CREATE TABLE "Projects" (
    "Id" uuid NOT NULL,
    "Name" text NOT NULL,
    "Description" text NOT NULL,
    "Status" integer NOT NULL,
    "ClientId" uuid,
    "OfferId" uuid,
    "TenantId" uuid NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_Projects" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_Projects_Clients_ClientId" FOREIGN KEY ("ClientId") REFERENCES "Clients" ("Id"),
    CONSTRAINT "FK_Projects_Offers_OfferId" FOREIGN KEY ("OfferId") REFERENCES "Offers" ("Id")
);

CREATE TABLE "Contracts" (
    "Id" uuid NOT NULL,
    "Title" text NOT NULL,
    "TotalAmount" numeric NOT NULL,
    "ClientId" uuid NOT NULL,
    "Terms" text NOT NULL,
    "Kpis" text NOT NULL,
    "StartDate" timestamp with time zone NOT NULL,
    "EndDate" timestamp with time zone NOT NULL,
    "Status" integer NOT NULL,
    "PortalToken" uuid NOT NULL,
    "SignatureData" text,
    "SignedAt" timestamp with time zone,
    "SignerIp" text,
    "ViewedAt" timestamp with time zone,
    "HasBeenViewed" boolean NOT NULL,
    "BaseRetainer" numeric NOT NULL,
    "SuccessFeeType" integer NOT NULL,
    "SuccessFeeValue" numeric NOT NULL,
    "LastInvoicedAt" timestamp with time zone,
    "Version" integer NOT NULL,
    "SignatureStatus" text NOT NULL,
    "IsWaitingSignature" boolean NOT NULL,
    "ProjectId" uuid NOT NULL,
    "TenantId" uuid NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_Contracts" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_Contracts_Clients_ClientId" FOREIGN KEY ("ClientId") REFERENCES "Clients" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_Contracts_Projects_ProjectId" FOREIGN KEY ("ProjectId") REFERENCES "Projects" ("Id") ON DELETE CASCADE
);

CREATE TABLE "ProjectAdAccounts" (
    "Id" uuid NOT NULL,
    "ProjectId" uuid NOT NULL,
    "Platform" integer NOT NULL,
    "ExternalAccountId" text NOT NULL,
    "AccessToken" text,
    "IsActive" boolean NOT NULL,
    "TenantId" uuid NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_ProjectAdAccounts" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_ProjectAdAccounts_Projects_ProjectId" FOREIGN KEY ("ProjectId") REFERENCES "Projects" ("Id") ON DELETE CASCADE
);

CREATE TABLE "ProjectMembers" (
    "Id" uuid NOT NULL,
    "ProjectId" uuid NOT NULL,
    "UserId" uuid NOT NULL,
    "Role" integer NOT NULL,
    "TenantId" uuid NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_ProjectMembers" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_ProjectMembers_Projects_ProjectId" FOREIGN KEY ("ProjectId") REFERENCES "Projects" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_ProjectMembers_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
);

CREATE TABLE "Tasks" (
    "Id" uuid NOT NULL,
    "Title" text NOT NULL,
    "Description" text NOT NULL,
    "Status" text NOT NULL,
    "Priority" text NOT NULL,
    "StartDate" timestamp with time zone NOT NULL,
    "DueDate" timestamp with time zone,
    "IsCompleted" boolean NOT NULL,
    "ProjectId" uuid NOT NULL,
    "TenantId" uuid NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_Tasks" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_Tasks_Projects_ProjectId" FOREIGN KEY ("ProjectId") REFERENCES "Projects" ("Id") ON DELETE CASCADE
);

CREATE TABLE "Invoices" (
    "Id" uuid NOT NULL,
    "InvoiceNumber" text NOT NULL,
    "TotalAmount" numeric NOT NULL,
    "PaidAmount" numeric NOT NULL,
    "Currency" text NOT NULL,
    "DueDate" timestamp with time zone NOT NULL,
    "Status" integer NOT NULL,
    "ContractId" uuid,
    "ProjectId" uuid NOT NULL,
    "ClientId" uuid NOT NULL,
    "TenantId" uuid NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_Invoices" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_Invoices_Clients_ClientId" FOREIGN KEY ("ClientId") REFERENCES "Clients" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_Invoices_Contracts_ContractId" FOREIGN KEY ("ContractId") REFERENCES "Contracts" ("Id"),
    CONSTRAINT "FK_Invoices_Projects_ProjectId" FOREIGN KEY ("ProjectId") REFERENCES "Projects" ("Id") ON DELETE CASCADE
);

CREATE TABLE "AdMetrics" (
    "Id" uuid NOT NULL,
    "ProjectId" uuid NOT NULL,
    "AdAccountId" uuid,
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
    CONSTRAINT "FK_AdMetrics_ProjectAdAccounts_AdAccountId" FOREIGN KEY ("AdAccountId") REFERENCES "ProjectAdAccounts" ("Id") ON DELETE SET NULL,
    CONSTRAINT "FK_AdMetrics_Projects_ProjectId" FOREIGN KEY ("ProjectId") REFERENCES "Projects" ("Id") ON DELETE CASCADE
);

CREATE TABLE "TimeEntries" (
    "Id" uuid NOT NULL,
    "ProjectId" uuid NOT NULL,
    "TaskId" uuid NOT NULL,
    "UserId" uuid NOT NULL,
    "Hours" numeric NOT NULL,
    "Description" text NOT NULL,
    "Date" timestamp with time zone NOT NULL,
    "TenantId" uuid NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_TimeEntries" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_TimeEntries_Projects_ProjectId" FOREIGN KEY ("ProjectId") REFERENCES "Projects" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_TimeEntries_Tasks_TaskId" FOREIGN KEY ("TaskId") REFERENCES "Tasks" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_TimeEntries_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
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

CREATE TABLE "Payments" (
    "Id" uuid NOT NULL,
    "Amount" numeric NOT NULL,
    "PaymentDate" timestamp with time zone NOT NULL,
    "Method" integer NOT NULL,
    "ReferenceNumber" text NOT NULL,
    "Notes" text NOT NULL,
    "InvoiceId" uuid NOT NULL,
    "TenantId" uuid NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_Payments" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_Payments_Invoices_InvoiceId" FOREIGN KEY ("InvoiceId") REFERENCES "Invoices" ("Id") ON DELETE CASCADE
);

CREATE INDEX "IX_AdMetrics_AdAccountId" ON "AdMetrics" ("AdAccountId");

CREATE INDEX "IX_AdMetrics_ProjectId" ON "AdMetrics" ("ProjectId");

CREATE INDEX "IX_Contacts_ClientId" ON "Contacts" ("ClientId");

CREATE INDEX "IX_Contracts_ClientId" ON "Contracts" ("ClientId");

CREATE INDEX "IX_Contracts_ProjectId" ON "Contracts" ("ProjectId");

CREATE INDEX "IX_InvoiceItem_InvoiceId" ON "InvoiceItem" ("InvoiceId");

CREATE INDEX "IX_Invoices_ClientId" ON "Invoices" ("ClientId");

CREATE INDEX "IX_Invoices_ContractId" ON "Invoices" ("ContractId");

CREATE INDEX "IX_Invoices_ProjectId" ON "Invoices" ("ProjectId");

CREATE INDEX "IX_Leads_ConvertedClientId" ON "Leads" ("ConvertedClientId");

CREATE INDEX "IX_Leads_OwnerId" ON "Leads" ("OwnerId");

CREATE INDEX "IX_OfferItems_OfferId" ON "OfferItems" ("OfferId");

CREATE INDEX "IX_Offers_LeadId" ON "Offers" ("LeadId");

CREATE INDEX "IX_Payments_InvoiceId" ON "Payments" ("InvoiceId");

CREATE INDEX "IX_ProjectAdAccounts_ProjectId" ON "ProjectAdAccounts" ("ProjectId");

CREATE INDEX "IX_ProjectMembers_ProjectId" ON "ProjectMembers" ("ProjectId");

CREATE INDEX "IX_ProjectMembers_UserId" ON "ProjectMembers" ("UserId");

CREATE INDEX "IX_Projects_ClientId" ON "Projects" ("ClientId");

CREATE INDEX "IX_Projects_OfferId" ON "Projects" ("OfferId");

CREATE INDEX "IX_RefreshTokens_UserId" ON "RefreshTokens" ("UserId");

CREATE INDEX "IX_Tasks_ProjectId" ON "Tasks" ("ProjectId");

CREATE INDEX "IX_TimeEntries_ProjectId" ON "TimeEntries" ("ProjectId");

CREATE INDEX "IX_TimeEntries_TaskId" ON "TimeEntries" ("TaskId");

CREATE INDEX "IX_TimeEntries_UserId" ON "TimeEntries" ("UserId");

CREATE INDEX "IX_Users_TenantId" ON "Users" ("TenantId");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260408154803_InitialPostgresState', '8.0.11');

COMMIT;

