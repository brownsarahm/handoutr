---
description: basic demo of handout worksheet
keywords: example, worksheet
author: Sarah M Brown
---
# Page title Heading 

+++
Date

```date
```

+++

An Example question prompt

```open
pre-seeded content for the textarea, can be `markdown` for *style*
```

hint, rendered as small text
+++

A prompt that instructs the user to make connections in a template diagram

```mermaid
flowchart TD
    tA[term a]
    tB[term b]
    tC[term D]
    d1[definition 1]
    d2[definition 2]
    d3[definition 3]
    %% example connection syntax, add the rest and correct this one
    tA -->d1
```

> hint, rendered as details 

+++ 

A propmt *with markdown* formatting for a question with no seed

```open
```

`hint in *markdown*, like the prompt, that will show up in the text template`

+++

A prompt for a grid, eg to fill in a 2x2:

```grid
* - 
  - column1
  - column two
* - r1 title
  - c1r1
  - c2r1
* - r2 title
  - c1r2
  - c2r2
```