# Contributing Guidelines

This repo accepts contributions via GitHub pull requests. This document outlines the process to help get your contribution accepted.

## Issues

Issues are used as the primary method for tracking anything to do with the project.

### Issue Types

There are 4 types of issues (each with their own corresponding [label](#labels)):

- `question/support`: These are support or functionality inquiries that we want to have a record of
  for future reference. Depending on the discussion, these can turn into `feature` or `bug` issues.
- `feature`: These track specific feature requests and ideas. They can
  evolve from a `proposal` or can be submitted individually depending on the size.
- `bug`: These track bugs with the code
- `docs`: These track problems with the documentation (i.e. missing or incomplete)

## Pull Requests

We use Pull Requests (PRs) to track code changes.

## Labels

The following tables define all label types used. It is split up by category.

### Common

| Label | Description |
| ----- | ----------- |
| `bug` | Marks an issue as a bug or a PR as a bugfix |
| `critical` | Marks an issue or PR as critical. This means that addressing the PR or issue is top priority and must be addressed as soon as possible |
| `docs` | Indicates the issue or PR is a documentation change |
| `feature` | Marks the issue as a feature request or a PR as a feature implementation |
| `refactor` | Indicates that the issue is a code refactor and is not fixing a bug or adding additional functionality |

#### Size labels

Size labels are used to indicate how "dangerous" a PR is. For example, even if a PR only
makes 30 lines of changes in 1 file, but it changes key functionality, it will likely be labeled as
`size/L` because it requires sign off from multiple people. Conversely, a PR that adds a small
feature, but requires another 150 lines of tests to cover all cases, could be labeled as `size/S`
even though the number of lines is greater than defined below.

| Label | Description |
| ----- | ----------- |
| `size/XS` | Denotes a PR that changes 0-9 lines, ignoring generated files. Very little testing may be required depending on the change. |
| `size/S` | Denotes a PR that changes 10-29 lines, ignoring generated files. Only small amounts of manual testing may be required. |
| `size/M` | Denotes a PR that changes 30-99 lines, ignoring generated files. Manual validation should be required. |
| `size/L` | Denotes a PR that changes 100-499 lines, ignoring generated files. This should be thoroughly tested before merging and always requires 2 approvals. |
| `size/XL` | Denotes a PR that changes 500-999 lines, ignoring generated files. This should be thoroughly tested before merging and always requires 2 approvals. |
| `size/XXL` | Denotes a PR that changes 1000+ lines, ignoring generated files. This should be thoroughly tested before merging and always requires 2 approvals. |
