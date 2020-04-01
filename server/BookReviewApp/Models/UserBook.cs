using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookReviewApp.Models
{
    public class UserBook
    {
        public string Id { get; set; }
        public string Review { get; set; }     
        public DateTime ReviewedOn { get; set; }
        public bool IsFavourite { get; set; }
        public string UserId { get; set; }

        public virtual ApplicationUser ApplicationUser { get; set; }
    }
}
