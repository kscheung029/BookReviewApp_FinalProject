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
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace BookReviewApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ReviewController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly string _userId;

        public ReviewController(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;

            var bearer = httpContextAccessor.HttpContext.Request.Headers["Authorization"];
            var handler = new JwtSecurityTokenHandler();
            var token = handler.ReadJwtToken(bearer.ToString().Replace("Bearer ", ""));
            _userId = token.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value;
        }

        public class ReviewBook
        {
            public string Title { get; set; }
            public string Review { get; set; }
        }

        // GET: api/Review
        [HttpGet]
        public IEnumerable<UserBook> GetReview()
        {
            List<UserBook> reviewBooks = _context.UserBooks.Where(book => book.UserId == _userId && book.Review != null).ToList();
            return reviewBooks;
        }

        // PUT: api/Review
        [HttpPut]
        public ReviewBook PutReview(ReviewBook reviewBook)
        {
            var entity = _context.UserBooks.SingleOrDefault(item => item.Title == reviewBook.Title);

            if (entity == null)
            {
                UserBook newBook = new UserBook
                {
                    Title = reviewBook.Title,
                    Review = reviewBook.Review,
                    ReviewedOn = DateTime.Now,
                    UserId = _userId
                };
                _context.UserBooks.Add(newBook);
            }
            else
            {
                entity.Review = reviewBook.Review;
                entity.ReviewedOn = DateTime.Now;
            }

            try
            {
                _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                throw;
            }

            return reviewBook;
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
    }
}