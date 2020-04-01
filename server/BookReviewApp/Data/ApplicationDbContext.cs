using System;
using System.Collections.Generic;
using System.Text;
using BookReviewApp.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace BookReviewApp.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<UserBook> UserBooks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ApplicationUser>()
                .HasKey(au => au.Id);

            modelBuilder.Entity<UserBook>()
                .HasKey(ub=> new { ub.Id, ub.UserId });

            modelBuilder.Entity<UserBook>()
                .HasOne(ub => ub.ApplicationUser)
                .WithMany(au => au.UserBooks)
                .HasForeignKey(ub => ub.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
