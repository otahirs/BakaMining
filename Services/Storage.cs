using System;
using System.Collections.Generic;
using System.Linq;
using BakaMining.Models;

namespace BakaMining.Services
{
    public class Storage
    {
        private Dictionary<string, PetriNetFile> _nets = new ();
        public void AddPetriNetFile(PetriNetFile file)
        {
            if (_nets.ContainsKey(file.Name))
                throw new ArgumentException();
            _nets[file.Name] = file;
        }

        public void RemovePetriNetFile(string name)
        {
            _nets.Remove(name);
        }

        public List<PetriNetFile> GetAll()
        {
            return _nets.Values.ToList();
        }

        public PetriNetFile Get(string filename)
        {
            return _nets[filename];
        }
    }
}