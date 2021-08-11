using System;
using ProcessM.NET.Model;

namespace BakaMining.Models
{
    public class PetriNetFile
    {
        public FileMetadata Metadata { get; set; }
        public IPetriNet PetriNet { get; set; }
    }
}
