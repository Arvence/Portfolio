import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { useEffect } from 'react'
import { Link } from 'react-router'
import {
  ArchitectureDiagram,
  AcquisitionDiagram,
  ExecutionDiagram,
  LifecycleDiagram,
  RecoveryDiagram,
  IdempotencyDiagram,
  PersistenceDiagram,
} from '../../components/taskforge/TaskForgeDiagrams'
import './taskforge.css'

const source = 'https://github.com/Arvence/TaskForge/tree/065c6e6047d8ce0d34180c666af64fe1b8a2417a'

export default function TaskForge() {
  useEffect(() => {
    document.title = 'TaskForge | Portfolio'
  }, [])

  return (
    <article className="taskforge-walkthrough">
      <Link to="/#projects" className="tf-back">
        <ArrowLeft size={16} aria-hidden="true" />
        Back to projects
      </Link>

      <header className="tf-hero">
        <p className="eyebrow">Background Job System</p>
        <h1>TaskForge</h1>
        <p className="tf-hero-summary">
          An HTTP job orchestration server that manages job lifecycles, retries, cancellation, and recovery for external
          workers.
        </p>
        <a
          className="tf-source-link"
          href="https://github.com/Arvence/TaskForge"
          target="_blank"
          rel="noopener noreferrer"
        >
          Explore the source <ArrowUpRight size={15} aria-hidden="true" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </header>

      <div className="tf-story-intro">
        <span className="tf-kicker">Implementation walkthrough</span>
        <span>From a submitted job to a durable outcome</span>
      </div>

      <ol className="tf-sections" aria-label="TaskForge implementation walkthrough">
        <li>
          <section className="tf-section" aria-labelledby="tf-boundary">
            <div className="tf-copy">
              <p className="tf-section-number" aria-hidden="true">
                01 / The system
              </p>
              <h2 id="tf-boundary">Orchestration and execution</h2>
              <p>
                Background work needs a record beyond the request that started it. TaskForge stores that work in SQL
                Server, assigns it to compatible workers, and records what happened to each attempt.
              </p>
              <ul>
                <li>
                  <strong>The server</strong> owns job state, assignment, retry policy, deadlines, and recovery.
                </li>
                <li>
                  <strong>The external worker</strong> runs application-owned handlers and reports the outcome over
                  HTTP.
                </li>
                <li>
                  <strong>The application</strong> decides when to submit work and can read its status and result.
                </li>
              </ul>
              <p className="tf-note">
                Workers initiate requests. The API does not push jobs to callbacks or execute business handlers. The
                .NET SDK is optional.
              </p>
            </div>
            <ArchitectureDiagram />
          </section>
        </li>

        <li>
          <section className="tf-section" aria-labelledby="tf-execution">
            <div className="tf-copy">
              <p className="tf-section-number" aria-hidden="true">
                02 / The path through
              </p>
              <h2 id="tf-execution">From submission to a recorded result</h2>
              <p>
                The core path has three HTTP operations: submit, acquire, and report. The business work happens between
                acquisition and reporting.
              </p>
              <ol>
                <li>
                  <strong>Submit.</strong> The API validates the request, queues the job, and persists it before
                  returning its ID.
                </li>
                <li>
                  <strong>Acquire.</strong> A worker advertises its application ID and supported types. A wait returns
                  one assignment, or <code>204</code> if no work becomes available.
                </li>
                <li>
                  <strong>Execute and report.</strong> The worker runs its local handler, then sends a completion or
                  failure report for that specific attempt.
                </li>
              </ol>
              <p className="tf-note">
                An assignment includes the job, attempt, worker, payload, and fixed execution deadline.
              </p>
            </div>
            <ExecutionDiagram />
          </section>
        </li>

        <li>
          <section className="tf-section" aria-labelledby="tf-acquisition">
            <div className="tf-copy">
              <p className="tf-section-number" aria-hidden="true">
                03 / Assignment
              </p>
              <h2 id="tf-acquisition">Compatible work, claimed atomically</h2>
              <p>
                Acquisition first filters by application and supported job types. Only queued jobs and retries whose
                scheduled time has arrived are eligible.
              </p>
              <ul>
                <li>Higher priority comes first. Ties use eligibility time, creation time, then job ID.</li>
                <li>A SQL transaction, update locks, and a version check protect assignment.</li>
                <li>Job ownership and the new running attempt commit together.</li>
              </ul>
              <p className="tf-note">
                This is selection order among eligible candidates. Concurrent workers can finish in a different order;
                priority does not preempt work already running.
              </p>
            </div>
            <AcquisitionDiagram />
          </section>
        </li>

        <li>
          <section className="tf-section" aria-labelledby="tf-lifecycle">
            <div className="tf-copy">
              <p className="tf-section-number" aria-hidden="true">
                04 / State and history
              </p>
              <h2 id="tf-lifecycle">One job, multiple attempts</h2>
              <p>
                The job describes the overall work. An attempt records one assignment to a worker. An automatic retry
                keeps the job ID and creates a new attempt when acquired.
              </p>
              <ul>
                <li>
                  Retryable failure or timeout moves the job to <code>Retrying</code> while its retry budget remains.
                </li>
                <li>
                  Permanent failure or exhausted retries ends in <code>DeadLettered</code>. <code>Failed</code> is an
                  attempt outcome, not a job state.
                </li>
                <li>
                  Manual replay of a dead-lettered or cancelled job creates a new job ID and preserves the original
                  history.
                </li>
              </ul>
              <p className="tf-note">
                Accepted cancellation closes active ownership. Stopping the remote handler is cooperative; the server
                cannot forcibly stop another process.
              </p>
            </div>
            <LifecycleDiagram />
          </section>
        </li>

        <li>
          <section className="tf-section" aria-labelledby="tf-recovery">
            <div className="tf-copy">
              <p className="tf-section-number" aria-hidden="true">
                05 / Time and recovery
              </p>
              <h2 id="tf-recovery">A deadline that survives the worker</h2>
              <p>
                Execution time starts at acquisition. SQL Server time determines the fixed deadline and whether an
                outcome arrives in time.
              </p>
              <ul>
                <li>
                  The server's maintenance service expires overdue executions and reconciles expired leases, even
                  without connected workers.
                </li>
                <li>
                  Lease grace supports recovery. It does not extend the execution deadline or require worker heartbeats.
                </li>
                <li>
                  Retry delays use capped exponential backoff. A compatible worker must still acquire the retry when it
                  becomes due.
                </li>
              </ul>
              <p className="tf-note">
                With the defaults, three allowed retries mean up to four attempts: the initial attempt, then delays of
                5, 10, and 20 seconds after retryable failures.
              </p>
            </div>
            <RecoveryDiagram />
          </section>
        </li>

        <li>
          <section className="tf-section" aria-labelledby="tf-idempotency">
            <div className="tf-copy">
              <p className="tf-section-number" aria-hidden="true">
                06 / Repeated requests
              </p>
              <h2 id="tf-idempotency">Three different kinds of duplication</h2>
              <p>
                A lost response does not necessarily mean an operation failed. TaskForge treats repeated submissions and
                repeated outcome reports separately from repeated business effects.
              </p>
              <ul>
                <li>
                  An <code>Idempotency-Key</code> is scoped to an application. Matching submission content returns the
                  existing job; changed content returns <code>409</code>.
                </li>
                <li>
                  Reports identify the application, job, attempt, and worker. An identical accepted report can be
                  acknowledged again; conflicting or stale outcomes cannot replace current state.
                </li>
                <li>
                  Handlers need their own durable business key or an idempotent receiving service to protect external
                  effects across retries and replays.
                </li>
              </ul>
              <p className="tf-note">TaskForge does not guarantee exactly-once external execution or side effects.</p>
            </div>
            <IdempotencyDiagram />
          </section>
        </li>

        <li>
          <section className="tf-section" aria-labelledby="tf-evidence">
            <div className="tf-copy">
              <p className="tf-section-number" aria-hidden="true">
                07 / Persistence and evidence
              </p>
              <h2 id="tf-evidence">The record outlives the process</h2>
              <p>
                Jobs and their attempts live in SQL Server, mapped through EF Core. Schema migrations run before the API
                serves requests. After a restart, maintenance works from persisted ownership and deadlines.
              </p>
              <ul>
                <li>Unit tests exercise domain transitions and retry policy.</li>
                <li>
                  Integration tests use a real SQL Server container for concurrent claims, transaction rollback,
                  deadline races, and restart recovery.
                </li>
                <li>Independent-client tests exercise the HTTP boundary and application-owned handler execution.</li>
              </ul>
              <p className="tf-note">
                These are correctness checks, not production-capacity measurements. Application IDs route work; the
                current API has no authentication or authorization.
              </p>
            </div>
            <PersistenceDiagram />
          </section>
        </li>
      </ol>

      <footer className="tf-reading">
        <div>
          <p className="tf-kicker">Continue in the repository</p>
          <p>
            Implementation and tests reviewed at <code>065c6e6</code>.
          </p>
        </div>
        <div className="tf-reading-links">
          <a href={`${source}/docs/architecture.md`} target="_blank" rel="noopener noreferrer">
            Architecture <ArrowUpRight size={15} aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          <a href={`${source}/docs/http-api.md`} target="_blank" rel="noopener noreferrer">
            HTTP contract <ArrowUpRight size={15} aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          <a href={`${source}/tests/TaskForge.IntegrationTests`} target="_blank" rel="noopener noreferrer">
            Integration tests <ArrowUpRight size={15} aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </footer>
    </article>
  )
}
