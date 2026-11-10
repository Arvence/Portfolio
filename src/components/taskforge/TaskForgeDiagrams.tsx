import { ArrowDown, ArrowDownUp, ArrowRight, CornerUpLeft } from 'lucide-react'
import type { ReactNode } from 'react'

function Diagram({ title, children, caption }: { title: string; children: ReactNode; caption: string }) {
  return (
    <figure className="tf-diagram" aria-label={title}>
      <p className="tf-diagram-title" aria-hidden="true">
        {title}
      </p>
      {children}
      <figcaption>{caption}</figcaption>
    </figure>
  )
}

export function ArchitectureDiagram() {
  return (
    <Diagram
      title="The system boundary"
      caption="Client arrows show requests and responses, initiated by clients. API operations and server maintenance use the same SQL store."
    >
      <div className="tf-actors">
        <div className="tf-node">
          <strong>Application backend</strong>
          <span>Submits work · reads results</span>
        </div>
        <div className="tf-node">
          <strong>External worker</strong>
          <span>Runs local business handlers</span>
        </div>
      </div>
      <div className="tf-actor-links">
        <div>
          <span>Submit / query</span>
          <ArrowDownUp size={22} aria-hidden="true" />
        </div>
        <div>
          <span>Wait / report</span>
          <ArrowDownUp size={22} aria-hidden="true" />
        </div>
      </div>
      <div className="tf-server">
        <span className="tf-label">TaskForge server</span>
        <div className="tf-node tf-node-accent">
          <strong>HTTP API</strong>
          <span>Assign work · accept outcomes</span>
        </div>
        <div className="tf-maintenance">
          <span>Background maintenance</span>
          <small>Deadlines + lease recovery</small>
        </div>
      </div>
      <div className="tf-connector">
        <ArrowDownUp size={22} aria-hidden="true" />
        <span>Read / write</span>
      </div>
      <div className="tf-node tf-database">
        <strong>SQL Server</strong>
        <span>Jobs + attempt history</span>
      </div>
    </Diagram>
  )
}

export function ExecutionDiagram() {
  const steps = [
    { actor: 'Application → API', action: 'POST /api/jobs', result: '201 · Queued', label: 'New submission' },
    {
      actor: 'Worker → API',
      action: 'POST /api/executions/wait',
      result: '200 · Assignment',
      label: 'Compatible work available',
    },
    {
      actor: 'Inside the worker',
      action: 'Execute application handler',
      result: 'Local result',
      label: 'Business execution',
    },
    {
      actor: 'Worker → API',
      action: 'Report completion for the attempt',
      result: '200 · Completed',
      label: 'Accepted before the deadline',
    },
  ]
  return (
    <Diagram
      title="One successful execution"
      caption="Assignment is the response to the worker's wait request. No matching work returns 204 instead."
    >
      <ol className="tf-execution-flow">
        {steps.map((step, index) => (
          <li key={step.action}>
            <span className="tf-flow-dot" aria-hidden="true">
              {index + 1}
            </span>
            <div>
              <span className="tf-label">{step.actor}</span>
              <strong>{step.action}</strong>
              <div className="tf-flow-result">
                <span>{step.result}</span>
                <small>{step.label}</small>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </Diagram>
  )
}

export function AcquisitionDiagram() {
  return (
    <Diagram
      title="Selection, then commitment"
      caption="Eligibility time is the retry due time or queued time. Ordering selects a candidate; it does not guarantee completion order."
    >
      <div className="tf-node">
        <span className="tf-label">Match first</span>
        <strong>Application ID + supported types</strong>
        <span>Queued work or a due retry</span>
      </div>
      <div className="tf-connector">
        <ArrowDown size={20} aria-hidden="true" />
      </div>
      <ol className="tf-priority" aria-label="Priority from highest to lowest">
        {['Critical', 'High', 'Normal', 'Low'].map((priority, index) => (
          <li key={priority}>
            <span className="tf-priority-rank">0{index + 1}</span>
            <strong>{priority}</strong>
            <span className="tf-priority-bar" style={{ width: `${100 - index * 22}%` }} aria-hidden="true" />
          </li>
        ))}
      </ol>
      <p className="tf-small">Then: eligibility time → creation time → ID</p>
      <div className="tf-connector">
        <ArrowDown size={20} aria-hidden="true" />
      </div>
      <div className="tf-transaction">
        <span className="tf-label">One SQL transaction</span>
        <div>
          <strong>Processing job</strong>
          <span aria-hidden="true">+</span>
          <strong>Running attempt</strong>
        </div>
        <span className="tf-small">Commit together</span>
      </div>
    </Diagram>
  )
}

export function LifecycleDiagram() {
  return (
    <Diagram
      title="Persisted job lifecycle"
      caption="Submission moves the constructed Pending job to Queued before saving. Queued and Retrying jobs can also be cancelled."
    >
      <div className="tf-state-entry">
        <span className="tf-state">Queued</span>
        <span className="tf-state-arrow">
          <small>Acquire</small>
          <ArrowRight size={22} aria-hidden="true" />
        </span>
        <span className="tf-state tf-node-accent">Processing</span>
      </div>
      <p className="tf-branch-label tf-small">From Processing</p>
      <ul className="tf-state-branches">
        <li>
          <span className="tf-state">Completed</span>
          <span>Accepted result</span>
        </li>
        <li>
          <span className="tf-state">Retrying</span>
          <span>Retryable failure / timeout; budget remains</span>
          <p className="tf-return">
            <CornerUpLeft size={16} aria-hidden="true" /> Due + acquired → Processing
          </p>
        </li>
        <li>
          <span className="tf-state">DeadLettered</span>
          <span>Permanent failure / exhausted retries</span>
        </li>
        <li>
          <span className="tf-state">Cancelled</span>
          <span>Accepted cancellation</span>
        </li>
      </ul>
    </Diagram>
  )
}

export function RecoveryDiagram() {
  return (
    <Diagram
      title="Time belongs to the assignment"
      caption="The timeline is schematic. Deadline expiry can be reconciled before the lease grace ends; grace is not additional execution time."
    >
      <div className="tf-deadline">
        <div className="tf-time-labels">
          <div>
            <strong>Acquired</strong>
            <span>Start</span>
          </div>
          <div>
            <strong>Deadline</strong>
            <span>Start + timeout</span>
          </div>
        </div>
        <div className="tf-time-track" aria-hidden="true">
          <span />
          <span />
        </div>
        <p className="tf-small">Fixed execution window</p>
        <div className="tf-grace">
          <span>Lease expiry</span>
          <strong>Deadline + grace</strong>
          <small>30 seconds of grace by default</small>
        </div>
      </div>
      <div className="tf-backoff">
        <span className="tf-label">Default retry delays</span>
        <div className="tf-delay-steps">
          <div>
            <strong>5s</strong>
            <span>Retry 1</span>
          </div>
          <ArrowRight size={16} aria-hidden="true" />
          <div>
            <strong>10s</strong>
            <span>Retry 2</span>
          </div>
          <ArrowRight size={16} aria-hidden="true" />
          <div>
            <strong>20s</strong>
            <span>Retry 3</span>
          </div>
        </div>
        <p className="tf-small">Exponential delay · configurable · capped at 300s by default</p>
      </div>
    </Diagram>
  )
}

export function IdempotencyDiagram() {
  return (
    <Diagram
      title="Where repetition is handled"
      caption="Attempt IDs change on automatic retry. Manual replay also changes the job ID, so protection across replays needs a business operation key."
    >
      <div className="tf-idempotency">
        <div>
          <span className="tf-label">01 · Submission</span>
          <strong>Application + idempotency key</strong>
          <span>Same content → existing job</span>
          <span>Changed content → 409 conflict</span>
        </div>
        <div>
          <span className="tf-label">02 · Outcome report</span>
          <strong>Exact assignment identity</strong>
          <span>Identical accepted report → acknowledgment</span>
          <span>Conflicting result → rejection</span>
        </div>
        <div className="tf-application-owned">
          <span className="tf-label">03 · Business effect</span>
          <strong>Application-owned protection</strong>
          <span>A durable operation key or an idempotent receiver</span>
        </div>
      </div>
    </Diagram>
  )
}

export function PersistenceDiagram() {
  return (
    <Diagram
      title="A job and its execution history"
      caption="JobAttempts.JobId references Jobs.Id. The (JobId, AttemptNumber) pair is unique; attempt history can be read through the HTTP API."
    >
      <div className="tf-record">
        <div className="tf-record-heading">
          <strong>Jobs</strong>
          <span>Overall work</span>
        </div>
        <dl>
          <div>
            <dt>Id</dt>
            <dd>Job identity</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>Current lifecycle state</dd>
          </div>
          <div>
            <dt>RetryCount</dt>
            <dd>Retryable failures / timeouts</dd>
          </div>
          <div>
            <dt>ResultJson</dt>
            <dd>Accepted result</dd>
          </div>
        </dl>
      </div>
      <div className="tf-record-relation">
        <span>One job</span>
        <ArrowDown size={26} aria-hidden="true" />
        <span>Many attempts</span>
      </div>
      <div className="tf-record">
        <div className="tf-record-heading">
          <strong>JobAttempts</strong>
          <span>Each assignment</span>
        </div>
        <dl>
          <div>
            <dt>JobId</dt>
            <dd>Parent job</dd>
          </div>
          <div>
            <dt>AttemptNumber</dt>
            <dd>Increasing per job</dd>
          </div>
          <div>
            <dt>WorkerId</dt>
            <dd>Assigned worker</dd>
          </div>
          <div>
            <dt>Outcome</dt>
            <dd>Attempt result</dd>
          </div>
        </dl>
      </div>
    </Diagram>
  )
}
