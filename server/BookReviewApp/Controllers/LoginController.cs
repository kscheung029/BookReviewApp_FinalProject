﻿using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using BookReviewApp.Areas.Identity.Pages.Account;
using BookReviewApp.Data;
using BookReviewApp.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace BookReviewApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IServiceProvider _serviceProvider;
        private readonly IConfiguration _config;
        private readonly ApplicationDbContext _context;

        public LoginController(
            SignInManager<ApplicationUser> signInManager,
            IServiceProvider serviceProvider,
            IConfiguration config,
            ApplicationDbContext context
            )
        {
            _signInManager = signInManager;
            _serviceProvider = serviceProvider;
            _config = config;
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> OnPostAsync([FromBody]LoginModel.InputModel input)
        {
            var result = await _signInManager.PasswordSignInAsync(input.Email.ToLower(), input.Password, isPersistent: false, lockoutOnFailure: true);

            if (result.Succeeded)
            {
                var UserManager = _serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
                var user = await UserManager.FindByEmailAsync(input.Email);

                if (user != null)
                {
                    var tokenString = GenerateJSONWebToken(user);
                    return Ok(new { token = tokenString, status = 200, title = "Logged in successfully." });
                }
            }

            if (result.IsLockedOut)
            {
                return BadRequest(new { status = 400, errors = "Account has been locked out due to too many attempts." });
            }

            return Unauthorized(new { status = 401, errors = "Invalid login information." });
        }

        private string GenerateJSONWebToken(ApplicationUser user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id)
            };
            var token = new JwtSecurityToken(
                _config["Jwt:Issuer"],
                _config["Jwt:Issuer"],
                claims,
                expires: DateTime.Now.AddMinutes(120),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}