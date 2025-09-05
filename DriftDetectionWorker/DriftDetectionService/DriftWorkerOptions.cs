using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DriftDetectionService
{
    public class DriftWorkerOptions
    {
        public int PollingIntervalSeconds { get; set; } = 60; // worker wake-up
    }
}
