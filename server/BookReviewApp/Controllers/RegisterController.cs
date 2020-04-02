using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BookReviewApp.Areas.Identity.Pages.Account;
using BookReviewApp.Data;
using BookReviewApp.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace BookReviewApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegisterController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _context;

        public RegisterController(
            UserManager<ApplicationUser> userManager,
            ApplicationDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> OnPostAsync([FromBody]RegisterModel.InputModel input)
        {
            var user = new ApplicationUser { UserName = input.Email.ToLower(), Email = input.Email };
            var result = await _userManager.CreateAsync(user, input.Password);
            var errors = new List<string>();

            if (result.Succeeded)
            {
                return Ok(new { status = 200, detail = "Registered successfully." });
            }

            foreach(IdentityError error in result.Errors)
            {
                errors.Add(error.Description);
            }

            return BadRequest(new { status = 400, detail = errors });
        }
    }
}