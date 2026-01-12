using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using test.Model;

namespace test.Data
{
    public class NieuwsContext : DbContext
    {
        public NieuwsContext (DbContextOptions<NieuwsContext> options)
            : base(options)
        {
        }

        public DbSet<test.Model.Nieuwsbericht> Nieuwsbericht { get; set; } = default!;
    }
}
