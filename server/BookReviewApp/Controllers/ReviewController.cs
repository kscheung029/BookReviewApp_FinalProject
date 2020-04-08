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
    //[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ReviewController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        //private readonly string _userId;

        public ReviewController(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;

            //var bearer = httpContextAccessor.HttpContext.Request.Headers["Authorization"];
            //var handler = new JwtSecurityTokenHandler();
            //var token = handler.ReadJwtToken(bearer.ToString().Replace("Bearer ", ""));
            //_userId = token.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value;
        }

        public class ReviewBook
        {
            public string Id { get; set; }
            public string Review { get; set; }
        }

        // GET: api/Review
        [HttpGet("{id}")]
        public IEnumerable<UserBook> GetReview(string id)
        {
            List<UserBook> reviewBooks = _context.UserBooks.Where(book => book.Id == id && book.Review != null).Select(b => new UserBook()
            {
                Id = b.Id,
                Review = b.Review,
                ReviewedOn = b.ReviewedOn,
                IsFavorite = b.IsFavorite,
                UserId = b.ApplicationUser.Email
            }).ToList();

            return reviewBooks;
        }

        // PUT: api/Review
        [HttpPut]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public ReviewBook PutReview(ReviewBook reviewBook)
        {
            var _userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var entity = _context.UserBooks.SingleOrDefault(item => item.Id == reviewBook.Id && item.UserId == _userId);

            if (entity == null)
            {
                UserBook newBook = new UserBook
                {
                    Id = reviewBook.Id,
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
                _context.SaveChanges();
            }
            catch (DbUpdateException)
            {
                throw;
            }

            return reviewBook;
        }

        // DELETE: api/Review/5
        [HttpDelete("{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<UserBook>> DeleteReview(string id)
        {
            var userBook = _context.UserBooks.SingleOrDefault(b => b.Id == id);
            if (userBook == null)
            {
                return NotFound();
            }

            if (userBook.IsFavorite == false)
            {
                _context.UserBooks.Remove(userBook);
            }
            else
            {
                userBook.Review = null;
            }

            await _context.SaveChangesAsync();

            return userBook;
        }
    }
}