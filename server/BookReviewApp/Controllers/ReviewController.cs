using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BookReviewApp.Data;
using BookReviewApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace BookReviewApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ReviewController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly string _userId;

        public FavoriteController(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;

            var bearer = httpContextAccessor.HttpContext.Request.Headers["Authorization"];
            var handler = new JwtSecurityTokenHandler();
            var token = handler.ReadJwtToken(bearer.ToString().Replace("Bearer ", ""));
            _userId = token.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value;
        }

        // GET: api/Review
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserBook>>> GetUserBooks()
        {
            return await _context.UserBooks.ToListAsync();
        }

        // GET: api/Review/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserBook>> GetUserBook(string id)
        {
            var userBook = await _context.UserBooks.FindAsync(id);

            if (userBook == null)
            {
                return NotFound();
            }

            return userBook;
        }

        // PUT: api/Review/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUserBook(string id, UserBook userBook)
        {
            if (id != userBook.Id)
            {
                return BadRequest();
            }

            _context.Entry(userBook).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserBookExists(id))
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

        // POST: api/Review
        [HttpPost]
        public async Task<ActionResult<UserBook>> PostUserBook(UserBook userBook)
        {
            _context.UserBooks.Add(userBook);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (UserBookExists(userBook.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetUserBook", new { id = userBook.Id }, userBook);
        }

        // DELETE: api/Review/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<UserBook>> DeleteUserBook(string id)
        {
            var userBook = await _context.UserBooks.FindAsync(id);
            if (userBook == null)
            {
                return NotFound();
            }

            _context.UserBooks.Remove(userBook);
            await _context.SaveChangesAsync();

            return userBook;
        }

        private bool UserBookExists(string id)
        {
            return _context.UserBooks.Any(e => e.Id == id);
        }
    }
}
