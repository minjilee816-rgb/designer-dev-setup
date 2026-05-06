import { useState } from 'react'
import Step1Configure from './steps/Step1Configure'
import Step2Dashboard from './steps/Step2Dashboard'
import Step3Triage from './steps/Step3Triage'
import Step4ChangeLog from './steps/Step4ChangeLog'
import Step5SignOff from './steps/Step5SignOff'
import StepNav from './components/StepNav'
import Shell from './components/Shell'

const steps = [
  { id: 1, label: 'Configure Review Cycle', short: 'Configure', sidebar: 'Review Cycles' },
  { id: 2, label: 'Review Dashboard — Monitor Progress', short: 'Dashboard', sidebar: 'Review Cycles' },
  { id: 3, label: 'Comment Triage — Resolve & Incorporate', short: 'Triage', sidebar: 'Comment Queue' },
  { id: 4, label: 'Incorporate Changes — Change Log', short: 'Change Log', sidebar: 'Documents' },
  { id: 5, label: 'Submit for Director Sign-off', short: 'Sign-off', sidebar: 'Documents' },
] as const

export default function App() {
  const [step, setStep] = useState(1)
  const current = steps.find((s) => s.id === step)!

  return (
    <div className="app">
      <div className="app__inner">
        <StepNav steps={steps} current={step} onChange={setStep} />
        <Shell title={current.label} activeNav={current.sidebar}>
          {step === 1 && <Step1Configure onNext={() => setStep(2)} />}
          {step === 2 && <Step2Dashboard onNext={() => setStep(3)} />}
          {step === 3 && <Step3Triage onNext={() => setStep(4)} />}
          {step === 4 && <Step4ChangeLog onNext={() => setStep(5)} />}
          {step === 5 && <Step5SignOff onReset={() => setStep(1)} />}
        </Shell>
      </div>
    </div>
  )
}
