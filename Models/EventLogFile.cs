using ProcessM.NET.Model;
using ProcessM.NET.Model.DataAnalysis;

namespace BakaMining.Models
{
    public class EventLogFile
    {
        public FileMetadata Metadata { get; set; }
        public WorkflowLog EventLog { get; set; }
    }
}