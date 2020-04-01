using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookReviewApp.Models
{
    public class ApplicationUser : IdentityUser
    {
        public virtual ICollection<UserBook> UserBooks { get; set; }
    }
}
