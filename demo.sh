#!/bin/bash

# Display system information
echo "System Information"
echo "------------------"
echo "Hostname: $(hostname)"
echo "Current User: $(whoami)"
echo "Uptime: $(uptime -p)"
echo "Disk Usage:"
df -h | grep '^/dev/'

# End of script
