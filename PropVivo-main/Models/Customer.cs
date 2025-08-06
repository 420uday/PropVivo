using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PropVivo.Backend.Models
{
    public class Customer
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [StringLength(20)]
        [Index(IsUnique = true)]
        public string PhoneNumber { get; set; }

        [Required]
        public string Name { get; set; }

        public string Email { get; set; }
        public string Address { get; set; }
    }
}