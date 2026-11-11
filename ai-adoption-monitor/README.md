# AI Adoption and Performance Monitoring

A simple dashboard that tracks how many people use each AI tool (adoption)
and how well each tool performs (accuracy, response time, hours saved).

## How to run
Open `index.html` in any web browser. No installation or internet needed.

## Files
- index.html - page layout
- style.css  - styling (light and dark mode)
- script.js  - logic: adoption rate, status, charts, add/update/remove tools

## Targets (change in script.js, `TARGET`)
- Adoption: 60%
- Accuracy: 85%
- Response time: 2.0 seconds

## Status rules
Healthy = meets all targets, Watch = misses one, At risk = misses two or more.

## Note
Data is stored in memory only and resets when the page is reloaded.
