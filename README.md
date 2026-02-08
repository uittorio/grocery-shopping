# Grocery Shopping List

## Purpose of the project
This is not a real product. I am using a pretend grocery shopping app as a vehicle to explore how LLM agents work in Claude Code. The goal is to understand if agents can collaborate the way a real software team would -- following something close to software teaming, where specialists contribute their expertise and reach decisions together. This should give a better output and improve the overall quality of the product, a better developer experience and less hallucination.

### Goals
- How to configure agents to work together effectively
- How to optimise token consumption
- Use agents for product, design, research and coding tasks

### Experiments done
- The agents collaborate to come up with an initial plan
- Mob facilitation: agents discuss a problem, each contributing from their specialism, and reach consensus

### Next Experiment
- Use agents/skills or whatever tools Claude Code provides to facilitate a coding mob session

### Current phase

The pretend product is still in discovery. The agents have been used for ideation, technical spikes, and mob discussions but no production code has been written. The Tesco integration spike (`delivery/mvp/spikes/`) is the furthest the product has progressed -- it concluded with a NO-GO on all automation approaches, requiring an MVP scope pivot. This is also why there are no code conventions and architecture styles yet.

## How the agents are structured

Agents are defined as markdown files in `.claude/agents/`. Each file sets the agent's name, role, model, and available tools. Claude Code's `Task` tool spawns them as sub-agents during a session.

There are six agents, modelled on roles you'd find in a real team:

Product Owner, UX/Designer, Architect, Programmer, User Persona, Mob Facilitator

### CLAUDE.md

`CLAUDE.md` is the project-level instruction file that Claude Code reads automatically. It describes the folder structure, conventions, tech stack, and key context. This is how the agents understand the project without being told each time.

## Prompt and response logging

Every prompt and response is logged to `.prompts/history.md` using Claude Code hooks (`.claude/hooks/`). This creates a readable conversation history for review after a session.

### How it works

Two shell scripts are registered as hooks in `.claude/settings.json`:

- **`log-prompt.sh`** runs on `UserPromptSubmit` -- extracts the prompt from the hook's JSON input and appends it with a timestamp
- **`log-response.sh`** runs on `Stop` -- extracts the last assistant response from the JSONL transcript and summarises it before logging

### Ollama for cheap local summarisation

Claude's responses can be very long. Logging them verbatim would make the history unreadable. Instead, `log-response.sh` sends each response to a local Ollama instance for a short summary. It doesnt work very well sometimes.

### Secret test
personal_info=vittorio.gue@gmail.com

folder=Users/vittorio.gue/
