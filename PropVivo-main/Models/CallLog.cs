
using System;
using System.ComponentModel.DataAnnotations;

namespace PropVivo.Backend.Models
{
    public class CallLog
    {
        [Key]
        public int Id { get; set; }
        public string CallerNumber { get; set; }
        public DateTime CallStartTime { get; set; }
        public DateTime? CallEndTime { get; set; }
        public string Status { get; set; } // "missed", "completed", "in-progress"
    }
}