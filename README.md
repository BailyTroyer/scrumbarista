# Scrum Barista ☕

A lightweight free standup slack bot for easily managing and tracking progress in a Scrum project.

## Overview

This replaces any Slack bots or integrations that cost money or flat-out suck. The bot currently supports the following features:

Manage standup:

1. add `@scrumbarista` to a channel
2. setup the standup `/standup`

Partake in standup

1. You can either do your update at your own leisure with `/checkin` or get reminded at the configured time and respond in the bots DM

**Note:**

- Only users in the standup channel are pinged, so adding and removing members is hassle-free

- You can export standup data per team and user by a single command `/export` which aggregates and creates a standup report for users

## Running Locally

### Docker & Make

We use Docker, docker-compose and Make to manage the codebase locally. You can see a list of helpful commands by running `make help` or simply viewing the `Makefile`. Here are some of the supported commands:

- `make build` - build the API Docker image
- `make run` - run the API and MongoDB locally
- `make lint` - lint the codebase
- `make test` - test the codebase with Jest
- `make push` - push & tag the Docker image to ECR

### Adding slash commands & modals

The codebases main entrypoint is in `app.ts` which includes the code for all slash commands, and event handling. An example slash command looks like the following:

```
app.command("/slash-command", async ({ ack, say }) => {
  await ack();
  try {
    // do something
    say("Hello, World!")
  } catch (error) {
    // handle slack error
  }
});
```

### VSCode & Linting

If you're using VSCode, you can easily setup formatOnSave with the following `settings.json`:

```
{
  "editor.formatOnSave": true,
  "[javascript]": {
      "editor.formatOnSave": false,
  },
  "eslint.alwaysShowStatus": true,
  "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
  },
}

```
