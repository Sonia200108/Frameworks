using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using test.Model;
using test.Data;

namespace test.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NewMessagesMemoryController : Controller
    {
        NieuwsberichtRepository repository;

        public NewMessagesMemoryController(NieuwsberichtRepository repo)
        {
            repository = repo;
        }

        [HttpGet]
        public IEnumerable<Nieuwsbericht> Get()
        {
            return repository.messages;

        }

        [HttpGet("{id}")]
        public ActionResult<Nieuwsbericht> Get(int id)
        {
            if (!repository.IdExists(id))
            {
                return NotFound();
            }
            return repository[id];
        }

        // POST api/<NewsMessagesMemoryController>
        [HttpPost]
        public ActionResult<Nieuwsbericht> Post([FromBody] Nieuwsbericht bericht)
        {
            Nieuwsbericht nieuwbericht = repository.Add(bericht);
            return CreatedAtAction("Get", new { id = nieuwbericht.Id }, nieuwbericht);
        }

        // PUT api/<NewsMessagesMemoryController>/5
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] Nieuwsbericht nieuwsbericht)
        {
            if (nieuwsbericht.Id == id)
            {
                repository.Update(nieuwsbericht);
                return NoContent();
            }

            else
            {
                // Use methods of ControllerBase to return status to client
                return BadRequest();
            }
        }

        // DELETE api/<NewsMessagesMemoryController>/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            if (repository.IdExists(id))
            {
                repository.Delete(id);
                // Use methods of ControllerBase to return status to client
                return NoContent();
            }
            else
            {
                // Use methods of ControllerBase to return status to client
                return NotFound();
            }

        }
    }
}
