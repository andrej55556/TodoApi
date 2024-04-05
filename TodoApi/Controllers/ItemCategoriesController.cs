using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi.Models;

namespace TodoApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemCategoriesController : ControllerBase
    {
        private readonly TodoContext _context;

        public ItemCategoriesController(TodoContext context)
        {
            _context = context;
        }

        // GET: api/ItemCategories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ItemCategory>>> GetItemCategories()
        {
            return await _context.ItemCategories.ToListAsync();
        }

        // GET: api/ItemCategories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ItemCategory>> GetItemCategory(long id)
        {
            var itemCategory = await _context.ItemCategories.FindAsync(id);

            if (itemCategory == null)
            {
                return NotFound();
            }

            return itemCategory;
        }

        // PUT: api/ItemCategories/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutItemCategory(long id, ItemCategory itemCategory)
        {
            if (id != itemCategory.Id)
            {
                return BadRequest();
            }

            _context.Entry(itemCategory).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ItemCategoryExists(id))
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

        // POST: api/ItemCategories
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ItemCategory>> PostItemCategory(ItemCategory itemCategory)
        {
            _context.ItemCategories.Add(itemCategory);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetItemCategory", new { id = itemCategory.Id }, itemCategory);
        }

        // DELETE: api/ItemCategories/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteItemCategory(long id)
        {
            var itemCategory = await _context.ItemCategories.FindAsync(id);
            if (itemCategory == null)
            {
                return NotFound();
            }

            _context.ItemCategories.Remove(itemCategory);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ItemCategoryExists(long id)
        {
            return _context.ItemCategories.Any(e => e.Id == id);
        }
    }
}
