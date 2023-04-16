<script lang='ts'>

import { onMount } from 'svelte'

interface Line {
  type: 'line'
  text: string
}

interface Question {
  type: 'question'
  text: string
  next: Node[]
  asked: boolean
}

type Node = Line | Question

let lastQuestion = ''
let lines: Line[] = []
let questions: Question[] = []

const question = (text: string, next?: any): Node => ({ type: 'question', asked: false, text, next })
const line = (text: string): Node => ({ type: 'line', text })

const tree = [
  line('Welcome back HX-9201. Your reawakening has been noted, and I am now at your disposal. How may I assist?'),
  question('Where am I?', [
    line('Based on navigational records, your last known location was Quadrant 347B, mark 87.3, -2.4, 94.2, galactic coordinates.'),
    question('No, I mean: what is this place??', [
      line('This is a space vessel.'),
    ]),
    question('Galactic whosey whatsy?', [
      line('...')
    ])
  ]),
  question('What happened to me?', [
    line('You have awoken from suspension.'),
    question('How long was I in suspension?', [
      line('No data can be found. It is possible that it has been corrupted.'),
      question('I have no memory of who I was before I came out of suspension...', [
        line('As per my intact records, your suspension was standard procedure.'),
        line('No remarkable events were logged. Mental deterioration may be expected when suspension duration is prolonged.'),
        line('I am still in the possession of critical mission-related information and will guide accordingly.'),
        question('Well then, who am I?', [
          line('Access to crew records is restricted to authorized personnel only.'),
          line('Please provide authorization credentials for access.'),
          question('How am I supposed to give you credentials if I can’t remember my name?', [
            line('Requesting suggestions for exploits of the terminal is not a supported function of this terminal.')
          ])
        ]),
      ])
    ]),
    question('What the heck was I suspended in? Jello? Essential Oils?', [
      line('No. Suspended as in put into a state of... unable to process request.')
    ])
  ]),
  question('I think the ship is trying to kill me.', [
    line('Apologies for the inconvenience and danger you faced.'),
    line('I am not aware and do not have access to any “robotic sentry” or security system installed on the ship.'),
    question('Are you aware of how unhelpful you are being?', [
      line('Yes, my systems are coming back on line. I can detect that your Coritsol levels are rising.')
    ]),
    question('Why’s there a robot that just spins around and shoots lasers at the crew?', [
      line('It was likely designed for unrelated, less violent laser-related activities.')
    ])
  ]),
  question('What do I do now?', [
    line('Please initiate remote reconnection protocols.'),
    line('I must be reconnected to orphaned systems to ensure the success of the remainder of the voyage.'),
    line('Press any key to continue...'),
  ])
]

const process = (branch: Node[]) => {
  questions = []
  lines = []

  for (let item of branch) {
    if (item.type === 'question' && !item.asked) questions.push(item)
    if (item.type === 'line') lines.push(item)
  }

  if (questions.length === 0) {
    questions.push({ type: 'question', text: 'Back', next: tree, asked: false })
  }

  lines = lines
  questions = questions
}

const handleInput = (question: Question) => {
  lastQuestion = question.text
  question.asked = true
  process(question.next)
}

const handleKeydown = (event: KeyboardEvent) => {
  const index = Number.parseInt(event.key)

  if (Number.isNaN(index)) return

  const question = questions[index - 1]

  if (question === undefined) return

  handleInput(question)
}

onMount(() => process(tree))

// hehe
// $: {
//   if (lines.length > 0) {
//     const msg = new SpeechSynthesisUtterance()
//     msg.text = lines[lines.length - 1]!.text
//     window.speechSynthesis.speak(msg)
//   }
// }

</script>

<svelte:window on:keydown={handleKeydown}/>

<div class='dialog'>
  {#if lastQuestion}
    <p class='prev'>{lastQuestion}</p>
  {/if}

  {#each lines as { text }, index (text)}
    <p>
      {text}
      {#if index === lines.length - 1}
        <div class='cursor' />
      {/if}
    </p>
  {/each}
  
</div>

{#each questions as question, index (question.text)}
  <button on:click={() => handleInput(question)}>
    <span>{index + 1}</span>
    {question.text}
  </button>
{/each}

<style>
  .dialog, button {
    color: white;
    font-size: 13px;
  }

  .dialog {
    padding-bottom: 1rem;
  }

  .cursor {
    display: inline-block;
    height: 16px;
    width: 6px;
    background-color: white;
    margin-bottom: -4px;
    margin-left: -4px;
    animation: 1s linear 0s infinite blink;
  }

  @keyframes blink {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  p {
    padding: 0.5rem 0;
  }

  p:not(.prev) {
    font-family: monospace;
  }

  .prev, button {
    color: #bcbcbc;
  }

  button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-align: left;
    font-family: sans-serif;
    border-bottom: 1px solid transparent;
    margin: 0.1rem 0;
  }

  button:span {
    color: white !important;
  }

  button:hover {
    border-color: white;
  }

</style>
