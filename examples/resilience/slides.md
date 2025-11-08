---
title: Building Resilience and Growth Mindset
theme: default
duration: 45 minutes
download: true
presenter: true
drawing: true
css: uno.css
---

---
layout: cover
title: Building Resilience and Growth Mindset
subtitle: PSHE Secondary 1 · Term 1 · 45 minutes
transition: fade
background: https://source.unsplash.com/1600x900/?person%20climbing%20mountain%20peak%20at%20sunrise
backgroundDim: 0.35
notes: |
  Welcome and agenda overview.
---

---
layout: center
title: Starter: “Famous Failures” Quiz
transition: slide-up
notes: |
  Prompt pair-share, then collect 2–3 answers.
---

# Starter: “Famous Failures” Quiz

> What do they have in common?

- J.K. Rowling — rejected by 12 publishers
- Michael Jordan — cut from high school team
- Walt Disney — fired for 'lacking imagination'
- Oprah Winfrey — told she was 'unfit for TV'

---
layout: two-cols
title: Two Ways of Thinking
transition: slide-up
notes: |
  Normalize both; model reframes.
---

# Two Ways of Thinking

::left::
### Fixed Mindset
- “I’m just not good at math”
- “I give up”
- “This is too hard”
::

::right::
### Growth Mindset
- “I can improve with practice”
- “I’ll try a different strategy”
- “This will take time and effort”
::

---
layout: default
title: The Science of Growth Mindset
transition: slide-left
notes: |
  Keep claims accurate and evidence-aligned.
---

# The Science of Growth Mindset

![Brain neural pathways](https://source.unsplash.com/1600x900/?human%20brain%20glowing%20neural%20pathways%20illustration)

<img query="human brain glowing neural pathways illustration" alt="Brain neural pathways" />

- <span class="text-2xl font-semibold">New connections form when you learn</span>
- <span class="text-2xl font-semibold">Practice strengthens connections</span>
- <span class="text-2xl font-semibold">Mistakes help your brain grow</span>
- <span class="text-2xl font-semibold">Intelligence can develop</span>

---
layout: default
title: Interactive Check
transition: slide-right
notes: |
  Demonstrate Slidev Vue components.
---

# Interactive Check

<QuizMultipleChoice v-bind="{
  question: 'Which statement is a growth mindset reframe?',
  choices: [
    'I’m terrible at drawing.',
    'I can improve my drawing with practice.',
    'I’ll never be as good as them.'
  ],
  correctIndex: 1
}"></QuizMultipleChoice>

<ProgressBar v-bind="{
  value: 60
}"></ProgressBar>

```ts
const mindsetReframe = (statement: string) => {
  return statement.replace('I can\'t', 'I can learn to')
}
console.log(mindsetReframe('I can\'t solve this yet'))
```

---
layout: center
title: The 5 Rs of Resilience
transition: fade
notes: |
  Invite one volunteer to share.
---

# The 5 Rs of Resilience

1. Recognize
2. Reframe
3. Reach out
4. Reflect
5. Retry

:::info
**Exit Ticket:** Write one growth reframe you’ll use this week.
:::
