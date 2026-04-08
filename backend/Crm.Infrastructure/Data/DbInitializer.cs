using Crm.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Crm.Infrastructure.Data;

public static class DbInitializer
{
    public static async Task SeedAsync(IServiceProvider serviceProvider)
    {
        var context = serviceProvider.GetRequiredService<AppDbContext>();

        await SeedTenantsAsync(context);
        await context.SaveChangesAsync();

        await SeedCrmDataAsync(context);
        await context.SaveChangesAsync();
    }

    private static async Task SeedTenantsAsync(AppDbContext context)
    {
        if (await context.Tenants.IgnoreQueryFilters().AnyAsync()) return;

        // Tenant A
        var tenantAId = Guid.Parse("00000000-0000-0000-0000-000000000001");
        var tenantA = new Tenant 
        { 
            Id = tenantAId, 
            Name = "Tenant A - Tech Corp",
            BrandColor = "#0ea5e9", // Sky Blue
            Industry = "Technology",
            OnboardingCompleted = true 
        };
        
        var adminA = new User
        {
            Id = Guid.NewGuid(),
            Email = "admin@tenanta.com",
            FullName = "Admin Tenant A",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
            Role = UserRole.Admin,
            TenantId = tenantAId,
            AvatarUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=AdminA",
            JobTitle = "Security Administrator",
            PhoneNumber = "+1-555-0101",
            HourlyRate = 150.00m
        };

        // Tenant B
        var tenantBId = Guid.Parse("00000000-0000-0000-0000-000000000002");
        var tenantB = new Tenant 
        { 
            Id = tenantBId, 
            Name = "Tenant B - Creative Agency",
            BrandColor = "#f43f5e", // Rose
            Industry = "Advertising",
            OnboardingCompleted = true 
        };
        
        var adminB = new User
        {
            Id = Guid.NewGuid(),
            Email = "admin@tenantb.com",
            FullName = "Admin Tenant B",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
            Role = UserRole.Admin,
            TenantId = tenantBId,
            AvatarUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=AdminB",
            JobTitle = "Creative Director",
            PhoneNumber = "+1-555-0202",
            HourlyRate = 125.00m
        };

        await context.Tenants.AddRangeAsync(tenantA, tenantB);
        await context.Users.AddRangeAsync(adminA, adminB);
    }

    private static async Task SeedCrmDataAsync(AppDbContext context)
    {
        if (await context.Clients.IgnoreQueryFilters().AnyAsync()) return;

        var tenantAId = Guid.Parse("00000000-0000-0000-0000-000000000001");
        var tenantBId = Guid.Parse("00000000-0000-0000-0000-000000000002");

        // Seed Bulk Data for Tenant A
        for (int i = 1; i <= 15; i++)
        {
            var clientId = Guid.NewGuid();
            var client = new Client
            {
                Id = clientId,
                Name = $"Tech Client {i}",
                LegalName = $"Legal Tech Solutions {i} Ltd",
                Industry = i % 2 == 0 ? "Software" : "E-commerce",
                BusinessAddress = $"{i * 100} Digital Way, Silicon Valley",
                VatNumber = $"VAT-US-{i:D3}",
                Priority = (PriorityTier)(i % 3),
                TenantId = tenantAId
            };
            await context.Clients.AddAsync(client);

            var leadId = Guid.NewGuid();
            var lead = new Lead
            {
                Id = leadId,
                Title = $"Tech Project Opportunity {i}",
                Description = $"A high-priority lead for software development services for Tech Client {i}.",
                ContactName = $"John Doe {i}",
                CompanyName = client.Name,
                Email = $"contact{i}@techclient{i}.com",
                Phone = $"+1-555-01{i:D2}",
                Status = (LeadStatus)(i % 4),
                Probability = 20 + (i * 5) % 80,
                DealValue = 5000 + (i * 1500),
                TenantId = tenantAId
            };
            await context.Leads.AddAsync(lead);

            if (i % 2 == 0)
            {
                await context.Offers.AddAsync(new Offer
                {
                    Id = Guid.NewGuid(),
                    Title = $"Development Proposal {i}",
                    TotalAmount = lead.DealValue ?? 5000,
                    LeadId = leadId,
                    Status = (OfferStatus)(i % 3),
                    TenantId = tenantAId,
                    Notes = "Generated from bulk seed data."
                });
            }
        }

        // Seed Bulk Data for Tenant B
        for (int i = 1; i <= 10; i++)
        {
            var client = new Client
            {
                Id = Guid.NewGuid(),
                Name = $"Creative Client {i}",
                LegalName = $"Creative Studio {i} LLC",
                Industry = "Design & Media",
                BusinessAddress = $"{i * 50} Art Plaza, New York",
                VatNumber = $"VAT-NY-{i:D3}",
                Priority = (PriorityTier)(i % 3),
                TenantId = tenantBId
            };
            await context.Clients.AddAsync(client);

            var leadId = Guid.NewGuid();
            var lead = new Lead
            {
                Id = leadId,
                Title = $"Brand Identity Design {i}",
                Description = $"New lead for creative branding and mobile app design for Creative Client {i}.",
                ContactName = $"Jane Smith {i}",
                CompanyName = client.Name,
                Email = $"hello@creative{i}.com",
                Phone = $"+1-212-0{i:D2}",
                Status = (LeadStatus)(i % 4),
                Probability = 10 + (i * 10) % 90,
                DealValue = 3000 + (i * 2000),
                TenantId = tenantBId
            };
            await context.Leads.AddAsync(lead);

            await context.Offers.AddAsync(new Offer
            {
                Id = Guid.NewGuid(),
                Title = $"Branding Quote {i}",
                TotalAmount = lead.DealValue ?? 3000,
                LeadId = leadId,
                Status = (OfferStatus)(i % 3),
                TenantId = tenantBId,
                Notes = "Creative proposal generated from bulk seed data."
            });
        }

        await context.SaveChangesAsync();
    }
}
