using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace DriftDetection.Data.Models;

public partial class MyTestDbContext : DbContext
{
    public MyTestDbContext()
    {
    }

    public MyTestDbContext(DbContextOptions<MyTestDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<DatasetConfig> DatasetConfigs { get; set; }

    public virtual DbSet<DriftReport> DriftReports { get; set; }

    public virtual DbSet<FileHistory> FileHistories { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=DESKTOP-BEU7SS2\\SQLEXPRESS07;Database=MyTestDB;Trusted_Connection=True;Encrypt=False;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<DatasetConfig>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__DatasetC__3214EC07BFE2AAB6");

            entity.Property(e => e.CheckIntervalCron).HasMaxLength(100);
            entity.Property(e => e.CheckIntervalMinutes).HasDefaultValue(60);
            entity.Property(e => e.ContainerName).HasMaxLength(200);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.FieldDelimiter).HasMaxLength(10);
            entity.Property(e => e.FilePath).HasMaxLength(500);
            entity.Property(e => e.FileType).HasMaxLength(50);
            entity.Property(e => e.Frequency).HasMaxLength(50);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
            entity.Property(e => e.LastCheckedAt).HasColumnType("datetime");
            entity.Property(e => e.ModifiedAt).HasColumnType("datetime");
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.OwningTeam).HasMaxLength(100);
            entity.Property(e => e.StorageType).HasMaxLength(50);
        });

        modelBuilder.Entity<DriftReport>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__DriftRep__3214EC078C027800");

            entity.Property(e => e.DetectedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DriftType).HasMaxLength(50);
            entity.Property(e => e.Severity).HasMaxLength(20);

            entity.HasOne(d => d.Dataset).WithMany(p => p.DriftReports)
                .HasForeignKey(d => d.DatasetId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__DriftRepo__Datas__6E01572D");
        });

        modelBuilder.Entity<FileHistory>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__FileHist__3214EC0778793B70");

            entity.ToTable("FileHistory");

            entity.Property(e => e.FileName).HasMaxLength(500);
            entity.Property(e => e.FilePath).HasMaxLength(1000);
            entity.Property(e => e.ProcessedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.Dataset).WithMany(p => p.FileHistories)
                .HasForeignKey(d => d.DatasetId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__FileHisto__Datas__02FC7413");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
