using Microsoft.EntityFrameworkCore;
using TodoApi.Models;

namespace TodoApi.Models
{
    public class TodoContext : DbContext
    {
        public DbSet<TodoItem> TodoItems { get; set; }

        public DbSet<ItemCategory> ItemCategories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<ItemCategory>().ToTable(nameof(ItemCategories));
            modelBuilder.Entity<TodoItem>().ToTable(nameof(TodoItems));
        }


        public TodoContext(DbContextOptions<TodoContext> options)
           : base(options)
        {
            Database.EnsureCreated();
        }
    }
}
