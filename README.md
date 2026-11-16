[![make.fun · markdown-render-speed-02](https://make.fun/badge/markdown-render-speed-02.svg)](https://make.fun/bounty/markdown-render-speed-02)
[![rank](https://make.fun/badge/markdown-render-speed-02/msmgm/markdown-render-speed-02-entry/rank.svg)](https://make.fun/bounty/markdown-render-speed-02/leaderboard)
[![reward](https://make.fun/badge/markdown-render-speed-02/msmgm/markdown-render-speed-02-entry/reward.svg)](https://make.fun/bounty/markdown-render-speed-02/leaderboard)

# Markdown Render Speed 02 Entry

An entry for the [make.fun bounty "Markdown Render Speed 02"](https://make.fun/bounty/markdown-render-speed-02).

## Description
A fast, dependency-free markdown renderer matching marked 18.1.3 output byte for byte. Designed for maximum throughput and 100% specification compliance with deterministic execution.

## Run Locally
```bash
mkdir -p input output
echo '[{"id":"1","markdown":"# Hello World"}]' > input/cases.json
MAKEFUN_INPUT_DIR=input MAKEFUN_OUTPUT_DIR=output node main.ts
```

## License
MIT
