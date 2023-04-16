<script lang='ts'>

import { onMount } from 'svelte';

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
      line('That information is not accessible by my systems.'),
      question('I have no memory of who I was before I came out of suspension...', [
        line('As per my records, your suspension was standard procedure.'),
        line('No remarkable events were logged. Memory loss may be expected when suspension duration is prolonged.'),
        line('I am still in the possession of critical mission-related information and will command accordingly.'),
        question('Well then, who am I?', [
          line('Access to crew records is restricted to authorized personnel only.'),
          line('Please provide authorization credentials for access.'),
        ]),
      ])
    ]),
    question('What the heck was I suspended in? Jello?', [
      line('No. Suspended as in temporally... nevermind.')
    ])
  ]),
  question('I think the ship is trying to kill me.', [
    line('Apologies for the inconvenience and danger you faced.'),
    line('I am not aware and do not have access to any “robotic sentry” or security system installed on the ship.'),
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
    questions.push({ type: 'question', text: 'back', next: tree, asked: false })
  }

  lines = lines
  questions = questions
}

onMount(async () => {
  lines.push()
  process(tree)
})

// hehe
// $: {
//   if (lines.length > 0) {
//     const msg = new SpeechSynthesisUtterance()
//     msg.text = lines[lines.length - 1]!.text
//     window.speechSynthesis.speak(msg)
//   }
// }

</script>

<div>
  {#each lines as { text } (text)}
    <p>{text}</p>
  {/each}
</div>

{#each questions as question (question.text)}
  <button on:click={() => {
    question.asked = true
    process(question.next)
  }}>
    {question.text}
  </button>
{/each}

<style>
  div, button {
    color: white;
  }

  div {
    font-family: monospace;
    padding-bottom: 1rem;
  }

  button {
    display: block;
    text-align: left;
    font-family: sans-serif;
    border-bottom: 1px solid transparent;
  }

  button:hover {
    border-color: white;
  }
  
</style>
