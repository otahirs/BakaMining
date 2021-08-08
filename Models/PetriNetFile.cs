using System;
using ProcessM.NET.Model;

namespace BakaMining.Models
{
    public class PetriNetFile
    {
        public string Name { get; set; }
        public long Size { get; set; }
        public DateTimeOffset Modified { get; set; }
        public IPetriNet PetriNet { get; set; }
    }
}
