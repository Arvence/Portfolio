import { ArrowDown, ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'

function Figure({ title, caption, children }: { title: string; caption: string; children: ReactNode }) {
  return (
    <figure className="fb-diagram" aria-label={title}>
      <p className="fb-diagram-title" aria-hidden="true">
        {title}
      </p>
      {children}
      <figcaption>{caption}</figcaption>
    </figure>
  )
}

export function FlagbitArchitecture() {
  return (
    <Figure
      title="Two operations, one service"
      caption="Arrows trace server calls and storage access; results return to the requesting client. SDK and CLI access stays on the HTTP side of the boundary."
    >
      <div className="fb-box fb-centered">
        <strong>HTTP clients</strong>
        <span>Application / optional SDK / CLI</span>
      </div>
      <div className="fb-connector">
        <ArrowDown size={20} aria-hidden="true" />
        <span>Request + X-Api-Key</span>
      </div>
      <div className="fb-server">
        <span className="fb-label">Flagbit API</span>
        <div className="fb-box fb-centered fb-accent-box">
          <strong>Authenticate + authorize</strong>
          <span>Management or evaluation access</span>
        </div>
        <div className="fb-lanes">
          <div>
            <ArrowDown size={20} aria-hidden="true" />
            <span className="fb-label">Management</span>
            <strong>Core manager</strong>
            <span>Validate and change definitions</span>
          </div>
          <div>
            <ArrowDown size={20} aria-hidden="true" />
            <span className="fb-label">Evaluation</span>
            <strong>Core evaluator</strong>
            <span>Apply contextual checks</span>
          </div>
        </div>
        <div className="fb-merge" aria-hidden="true">
          <ArrowDown size={20} />
          <ArrowDown size={20} />
        </div>
        <div className="fb-box fb-centered">
          <strong>Infrastructure store</strong>
          <span>IFeatureFlagStore · EF Core</span>
        </div>
      </div>
      <div className="fb-connector">
        <ArrowDown size={20} aria-hidden="true" />
        <span>Read / write</span>
      </div>
      <div className="fb-box fb-centered fb-database">
        <strong>PostgreSQL</strong>
        <span>Flag definitions + related settings</span>
      </div>
    </Figure>
  )
}

export function FlagbitEvaluationExample() {
  return (
    <Figure
      title="Context meets configuration"
      caption="The API returns a boolean, not a checkout implementation. This example leaves user targeting, schedule bounds, and dependencies unset."
    >
      <div className="fb-example-request">
        <span className="fb-label">Authenticated POST</span>
        <code>/api/flags/new-checkout/evaluate</code>
        <pre>
          <code>
            {
              '{\n  "userId": "user-123",\n  "environment": "production",\n  "attributes": {\n    "plan": "enterprise"\n  }\n}'
            }
          </code>
        </pre>
      </div>
      <div className="fb-example-config">
        <span className="fb-label">Stored new-checkout definition</span>
        <dl>
          <div>
            <dt>Enabled</dt>
            <dd>true</dd>
          </div>
          <div>
            <dt>Environment</dt>
            <dd>production</dd>
          </div>
          <div>
            <dt>Rule</dt>
            <dd>plan Equals enterprise</dd>
          </div>
          <div>
            <dt>Rollout</dt>
            <dd>50% · bucket 44 passes</dd>
          </div>
        </dl>
      </div>
      <div className="fb-connector">
        <ArrowDown size={20} aria-hidden="true" />
        <span>All checks pass</span>
      </div>
      <div className="fb-example-response">
        <span className="fb-label">200 OK</span>
        <pre>
          <code>{'{\n  "key": "new-checkout",\n  "isEnabled": true\n}'}</code>
        </pre>
      </div>
    </Figure>
  )
}

export function FlagbitDecisionGates() {
  const gates = [
    'Flag exists and is enabled?',
    'User targeting passes?',
    'Percentage check passes?',
    'Environment passes?',
    'Every attribute rule passes?',
    'Inside the schedule?',
    'Every dependency evaluates true?',
  ]
  return (
    <Figure
      title="The evaluator's actual check order"
      caption="For valid input, the first No returns false. Unconfigured restrictions pass. All Yes results produce true; there is no allow-list override or first-matching-rule winner."
    >
      <p className="fb-gate-intro">
        Valid context <ArrowDown size={16} aria-hidden="true" /> Continue on Yes
      </p>
      <ol className="fb-gate-flow" role="list">
        {gates.map((gate, index) => (
          <li key={gate}>
            <div className="fb-gate-question">
              <span aria-hidden="true">0{index + 1}</span>
              <strong>{gate}</strong>
            </div>
            <span className="fb-gate-reject">
              No <ArrowRight size={13} aria-hidden="true" />
              <code>false</code>
            </span>
          </li>
        ))}
      </ol>
      <div className="fb-gate-accepted">
        <ArrowDown size={20} aria-hidden="true" />
        <span>
          All Yes <ArrowRight size={16} aria-hidden="true" /> <code>true</code>
        </span>
      </div>
    </Figure>
  )
}

export function FlagbitRollout() {
  return (
    <Figure
      title="A deterministic 0–99 bucket"
      caption="The 44 and 84 buckets are pinned by the evaluator's tests. These examples compare only the rollout check at a 50% threshold."
    >
      <div className="fb-box fb-centered">
        <span className="fb-label">Hash input · exact text</span>
        <code>new-checkout:user-123</code>
      </div>
      <div className="fb-connector">
        <ArrowDown size={20} aria-hidden="true" />
        <span>UTF-8 → SHA-256</span>
      </div>
      <div className="fb-hash-result">
        <span>First 32 bits, big-endian</span>
        <strong>
          value % 100 = <em>44</em>
        </strong>
      </div>
      <div className="fb-bucket-scale" aria-label="A 50 percent threshold admits buckets zero through forty-nine">
        <div className="fb-bucket-labels">
          <span>0</span>
          <span>50% threshold</span>
          <span>99</span>
        </div>
        <div className="fb-bucket-bar" aria-hidden="true">
          <span />
          <span />
        </div>
        <div className="fb-bucket-legend">
          <span>0–49 · pass</span>
          <span>50–99 · fail</span>
        </div>
      </div>
      <dl className="fb-bucket-examples">
        <div>
          <dt>
            <code>user-123</code>
          </dt>
          <dd>
            <strong>44</strong>
            <span>Pass</span>
          </dd>
        </div>
        <div>
          <dt>
            <code>USER-123</code>
          </dt>
          <dd>
            <strong>84</strong>
            <span>Fail</span>
          </dd>
        </div>
      </dl>
    </Figure>
  )
}

export function FlagbitDependencies() {
  return (
    <Figure
      title="A shared dependency is not a cycle"
      caption="Arrows mean depends on. This graph comes from the nested-dependency test: both branches must pass, using the same user, environment, attributes, and evaluation time."
    >
      <div className="fb-dependency-root fb-box fb-centered fb-accent-box">
        <strong>new-checkout</strong>
        <span>Requires both branches</span>
      </div>
      <svg className="fb-dependency-lines" viewBox="0 0 400 42" preserveAspectRatio="none" aria-hidden="true">
        <path d="M200 0V12H100V38M200 12H300V38" />
        <path d="m95 32 5 6 5-6m190 0 5 6 5-6" />
      </svg>
      <div className="fb-dependency-pair">
        <div className="fb-box fb-centered">
          <strong>accounts</strong>
        </div>
        <div className="fb-box fb-centered">
          <strong>recommendations</strong>
        </div>
      </div>
      <svg className="fb-dependency-lines" viewBox="0 0 400 42" preserveAspectRatio="none" aria-hidden="true">
        <path d="M100 0V14H200V38M300 0V14H200" />
        <path d="m195 32 5 6 5-6" />
      </svg>
      <div className="fb-dependency-root fb-box fb-centered">
        <strong>identity</strong>
        <span>Evaluated on each visited branch</span>
      </div>
      <div className="fb-cycle">
        <span className="fb-label">A cycle returns false</span>
        <p>
          <code>first → second → third → first</code>
        </p>
        <span>Revisiting a key on the active path stops recursion.</span>
      </div>
    </Figure>
  )
}

export function FlagbitStorage() {
  return (
    <Figure
      title="A definition with owned settings"
      caption="Each child collection has a foreign key to its owning flag. Dependency target keys are resolved by the evaluator; they are not foreign keys to target flags."
    >
      <div className="fb-schema-parent">
        <strong>feature_flags</strong>
        <dl>
          <div>
            <dt>key</dt>
            <dd>Original spelling</dd>
          </div>
          <div>
            <dt>normalized_key</dt>
            <dd>Unique lookup identity</dd>
          </div>
          <div>
            <dt>is_enabled</dt>
            <dd>Stored state</dd>
          </div>
          <div>
            <dt>rollout / schedule</dt>
            <dd>Optional restrictions</dd>
          </div>
        </dl>
      </div>
      <div className="fb-connector">
        <ArrowDown size={20} aria-hidden="true" />
        <span>One flag → many owned rows</span>
      </div>
      <div className="fb-schema-children">
        <div>
          <strong>Target users</strong>
          <span>User identifiers</span>
        </div>
        <div>
          <strong>Environments</strong>
          <span>Allowed names</span>
        </div>
        <div>
          <strong>Rules</strong>
          <span>Attribute · operator · value</span>
        </div>
        <div>
          <strong>Dependencies</strong>
          <span>Referenced flag keys</span>
        </div>
      </div>
      <div className="fb-write-boundary">
        <span className="fb-label">Evaluation settings update</span>
        <strong>Replace settings in one transaction</strong>
        <span>Enabled state stays unchanged</span>
      </div>
    </Figure>
  )
}

export function FlagbitClientBoundary() {
  return (
    <Figure
      title="One request in the included SampleApi"
      caption="These are SampleApi outcomes, not Flagbit API status mappings. The SDK propagates failures; the sample chooses its 502/504 responses instead of silently selecting classic checkout."
    >
      <div className="fb-box fb-centered">
        <strong>GET /checkout</strong>
        <span>User · environment · plan</span>
      </div>
      <div className="fb-connector">
        <ArrowDown size={20} aria-hidden="true" />
        <span>SDK EvaluateAsync</span>
      </div>
      <div className="fb-box fb-centered fb-accent-box">
        <strong>Flagbit API</strong>
        <code>sample-new-checkout</code>
        <span>One contextual HTTP evaluation</span>
      </div>
      <div className="fb-response-branches">
        <div>
          <span className="fb-label">Valid response</span>
          <dl>
            <div>
              <dt>
                <code>true</code>
              </dt>
              <dd>
                <ArrowRight size={15} aria-hidden="true" /> modern
              </dd>
            </div>
            <div>
              <dt>
                <code>false</code>
              </dt>
              <dd>
                <ArrowRight size={15} aria-hidden="true" /> classic
              </dd>
            </div>
          </dl>
          <span className="fb-small">200 · application selects checkout</span>
        </div>
        <div>
          <span className="fb-label">Evaluation failure</span>
          <dl>
            <div>
              <dt>HTTP / network / JSON</dt>
              <dd>502</dd>
            </div>
            <div>
              <dt>Upstream timeout</dt>
              <dd>504</dd>
            </div>
          </dl>
          <span className="fb-small">No checkout fallback</span>
        </div>
      </div>
    </Figure>
  )
}
