using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace BookReviewApp.Models
{
    public class UserBook
    {
        [Required]
        public string Id { get; set; }
        public string Review { get; set; }
        public DateTime ReviewedOn { get; set; }
        public bool IsFavorite { get; set; }
        [Required]
        public string UserId { get; set; }

        public virtual ApplicationUser ApplicationUser { get; set; }
    }
}
