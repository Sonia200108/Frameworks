using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using test.Data;
using test.Model;

namespace test.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NewsMessageController : ControllerBase
    {
        private readonly NieuwsContext _context;

        public NewsMessageController(NieuwsContext context)
        {
            _context = context;
        }

        // GET: api/NewsMessage
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Nieuwsbericht>>> GetNieuwsbericht()
        {
            return await _context.Nieuwsbericht.ToListAsync();
        }

        // GET: api/NewsMessage/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Nieuwsbericht>> GetNieuwsbericht(int? id)
        {
            var nieuwsbericht = await _context.Nieuwsbericht.FindAsync(id);

            if (nieuwsbericht == null)
            {
                return NotFound();
            }

            return nieuwsbericht;
        }

        // PUT: api/NewsMessage/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutNieuwsbericht(int? id, Nieuwsbericht nieuwsbericht)
        {
            if (id != nieuwsbericht.Id)
            {
                return BadRequest();
            }

            _context.Entry(nieuwsbericht).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NieuwsberichtExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/NewsMessage
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Nieuwsbericht>> PostNieuwsbericht(Nieuwsbericht nieuwsbericht)
        {
            _context.Nieuwsbericht.Add(nieuwsbericht);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetNieuwsbericht", new { id = nieuwsbericht.Id }, nieuwsbericht);
        }

        // DELETE: api/NewsMessage/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNieuwsbericht(int? id)
        {
            var nieuwsbericht = await _context.Nieuwsbericht.FindAsync(id);
            if (nieuwsbericht == null)
            {
                return NotFound();
            }

            _context.Nieuwsbericht.Remove(nieuwsbericht);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool NieuwsberichtExists(int? id)
        {
            return _context.Nieuwsbericht.Any(e => e.Id == id);
        }
    }
}
