using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BookReviewApp.Data;
using BookReviewApp.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace BookReviewApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class FavoriteController : ControllerBase
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

        public class FavoriteBook
        {
            public string Title { get; set; }
            public bool IsFavorite { get; set; }
        }

        // GET: api/Favorite
        [HttpGet]
        public IEnumerable<UserBook> GetFavorite()
        {
            List<UserBook> favoriteBooks = _context.UserBooks.Where(book => book.UserId == _userId && book.IsFavorite).ToList();
            return favoriteBooks;
        }

        // PUT: api/Favorite
        [HttpPut]
        public FavoriteBook PutFavorite(FavoriteBook favoriteBook)
        {
            var entity = _context.UserBooks.SingleOrDefault(item => item.Title == favoriteBook.Title);

            if (entity == null)
            {
                UserBook newBook = new UserBook
                {
                    Title = favoriteBook.Title,
                    IsFavorite = favoriteBook.IsFavorite,
                    UserId = _userId
                };
                _context.UserBooks.Add(newBook);
            } else
            {
                entity.IsFavorite = favoriteBook.IsFavorite;
            }

            try
            {
                _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                throw;
            }

            return favoriteBook;
        }

        // DELETE: api/Favorite/5
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
