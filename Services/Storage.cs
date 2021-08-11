using System;
using System.Collections.Generic;
using System.Linq;
using BakaMining.Models;
using ProcessM.NET.Model;

namespace BakaMining.Services
{
    public class Storage
    {
        private Dictionary<string, PetriNetFile> _nets = new ();
        private Dictionary<string, EventLogFile> _logs = new ();
        public void AddPetriNetFile(PetriNetFile file)
        {
            if (_nets.ContainsKey(file.Metadata.Name))
                throw new ArgumentException();
            _nets[file.Metadata.Name] = file;
        }

        public void RemovePetriNetFile(string name)
        {
            _nets.Remove(name);
        }

        public List<PetriNetFile> GetAllNets()
        {
            return _nets.Values.ToList();
        }

        public PetriNetFile GetPetriNet(string filename)
        {
            return _nets[filename];
        }
        
        //
        public void AddEventLogFile(EventLogFile file)
        {
            if (_nets.ContainsKey(file.Metadata.Name))
                throw new ArgumentException();
            _logs[file.Metadata.Name] = file;
        }
        public void RemoveLogFile(string name)
        {
            _logs.Remove(name);
        }

        public List<EventLogFile> GetAllLogs()
        {
            return _logs.Values.ToList();
        }

        public EventLogFile GetEventLog(string filename)
        {
            return _logs[filename];
        }
    }
}