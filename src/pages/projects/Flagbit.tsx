import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { useEffect } from 'react'
import { Link } from 'react-router'
import {
  FlagbitArchitecture,
  FlagbitEvaluationExample,
  FlagbitDecisionGates,
  FlagbitRollout,
  FlagbitDependencies,
  FlagbitStorage,
  FlagbitClientBoundary,
} from '../../components/flagbit/FlagbitDiagrams'
import './flagbit.css'

const source = 'https://github.com/Arvence/Flagbit/tree/e5b9241cfabe9a092b52d7aaee62d12cfb3552af'

export default function Flagbit() {
  useEffect(() => {
    document.title = 'Flagbit | Portfolio'
  }, [])

  return (
    <article className="flagbit-walkthrough">
      <Link to="/#projects" className="fb-back">
        <ArrowLeft size={16} aria-hidden="true" /> Back to projects
      </Link>

      <header className="fb-hero">
        <p className="eyebrow">Feature Flag Service</p>
        <h1>Flagbit</h1>
        <p className="fb-hero-summary">
          A feature flag service with centralized management, contextual evaluation, percentage rollouts, and an
          optional .NET SDK.
        </p>
        <a
          className="fb-source-link"
          href="https://github.com/Arvence/Flagbit"
          target="_blank"
          rel="noopener noreferrer"
        >
          Explore the source <ArrowUpRight size={15} aria-hidden="true" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </header>

      <div className="fb-story-intro">
        <span className="fb-kicker">Implementation walkthrough</span>
        <span>From a flag definition to a contextual decision</span>
      </div>

      <ol className="fb-sections" aria-label="Flagbit implementation walkthrough" role="list">
        <li>
          <section className="fb-section" aria-labelledby="fb-system">
            <div className="fb-copy">
              <p className="fb-section-number" aria-hidden="true">
                01 / The system
              </p>
              <h2 id="fb-system">Configure centrally. Decide per request.</h2>
              <p>
                Flagbit separates a feature's configuration from the application behavior it controls. The server stores
                the definition and evaluates a boolean; the consuming application chooses what to do with it.
              </p>
              <ul>
                <li>
                  <strong>Management</strong> creates, reads, configures, enables, disables, and deletes flags.
                </li>
                <li>
                  <strong>Evaluation</strong> combines the stored definition with user, environment, and attribute
                  context.
                </li>
                <li>
                  <strong>Access</strong> uses <code>X-Api-Key</code>. Management keys can manage and evaluate;
                  evaluation keys can only evaluate.
                </li>
              </ul>
              <p className="fb-note">
                Generated application keys are stored as hashes and checked against PostgreSQL on each request.
                Revocation takes effect on subsequent requests; these keys do not create separate flag namespaces.
              </p>
            </div>
            <FlagbitArchitecture />
          </section>
        </li>

        <li>
          <section className="fb-section" aria-labelledby="fb-example">
            <div className="fb-copy">
              <p className="fb-section-number" aria-hidden="true">
                02 / One evaluation
              </p>
              <h2 id="fb-example">A checkout decision, end to end</h2>
              <p>
                Consider an enabled <code>new-checkout</code> flag restricted to production and the enterprise plan,
                with a 50% rollout. No user list, schedule, or dependencies are configured in this example.
              </p>
              <ol>
                <li>
                  <strong>Send context.</strong> An authenticated client posts the user ID, environment, and string
                  attributes to the evaluation endpoint.
                </li>
                <li>
                  <strong>Resolve and evaluate.</strong> The server loads the flag and its settings from PostgreSQL. For{' '}
                  <code>user-123</code>, rollout bucket 44 passes; the environment and plan also match.
                </li>
                <li>
                  <strong>Return a decision.</strong> The API returns the requested key and <code>isEnabled: true</code>
                  . The client applies that decision locally.
                </li>
              </ol>
              <p className="fb-note">
                This is a worked contract example, not a live request. Evaluation does not change the flag's stored
                enabled state.
              </p>
            </div>
            <FlagbitEvaluationExample />
          </section>
        </li>

        <li>
          <section className="fb-section" aria-labelledby="fb-gates">
            <div className="fb-copy">
              <p className="fb-section-number" aria-hidden="true">
                03 / Decision logic
              </p>
              <h2 id="fb-gates">Every configured restriction must pass</h2>
              <p>
                Evaluation stops at the first failed check. A targeted user receives no override: percentage,
                environment, rules, schedule, and dependencies still apply.
              </p>
              <ul>
                <li>
                  Empty targeting, environment, rule, and dependency lists impose no restriction. An unset percentage
                  and absent schedule bounds also pass.
                </li>
                <li>
                  All rules must match. String comparisons ignore case and support <code>Equals</code>,{' '}
                  <code>NotEquals</code>, <code>Contains</code>, <code>StartsWith</code>, and <code>EndsWith</code>.
                </li>
                <li>
                  A missing attribute fails its rule, including <code>NotEquals</code>. A configured user or environment
                  restriction requires matching context.
                </li>
                <li>
                  Schedule start and end are inclusive. The HTTP API uses server time, captured once for the evaluation
                  and its dependencies.
                </li>
              </ul>
              <p className="fb-note">
                Missing or disabled flags evaluate to <code>false</code>. Invalid input is different: attribute names
                that differ only by case are rejected with <code>400</code> before lookup.
              </p>
            </div>
            <FlagbitDecisionGates />
          </section>
        </li>

        <li>
          <section className="fb-section" aria-labelledby="fb-rollout">
            <div className="fb-copy">
              <p className="fb-section-number" aria-hidden="true">
                04 / Percentage rollout
              </p>
              <h2 id="fb-rollout">Stable buckets for gradual rollout</h2>
              <p>
                For percentages between 1 and 99, the evaluator hashes the stored flag key and supplied user ID into a
                bucket from 0 to 99. The percentage check passes when the bucket is below the configured threshold.
              </p>
              <ul>
                <li>The same stored key and exact user ID produce the same bucket across requests.</li>
                <li>
                  Changing only the lookup key's letter case does not change the stored key. Changing the supplied user
                  ID's case or whitespace can change its bucket.
                </li>
                <li>0% rejects everyone. Any configured percentage, including 100%, requires a nonblank user ID.</li>
              </ul>
              <p className="fb-note">
                A 50% threshold admits 50 of the 100 buckets. It does not promise that exactly half of a particular user
                population will qualify, and all other restrictions still apply.
              </p>
            </div>
            <FlagbitRollout />
          </section>
        </li>

        <li>
          <section className="fb-section" aria-labelledby="fb-dependencies">
            <div className="fb-copy">
              <p className="fb-section-number" aria-hidden="true">
                05 / Dependent decisions
              </p>
              <h2 id="fb-dependencies">Dependencies are evaluated, not just switched on</h2>
              <p>
                A dependency must itself evaluate to true for the same context. Its enabled state alone is insufficient:
                its own targeting, rollout, rules, environment, schedule, and dependencies all participate.
              </p>
              <ul>
                <li>
                  Every dependency must pass. A missing or disabled dependency makes the requesting flag evaluate to{' '}
                  <code>false</code>.
                </li>
                <li>
                  A case-insensitive path set detects cycles during recursion and returns <code>false</code>. Direct
                  self-dependency is rejected when configuring a flag.
                </li>
                <li>
                  The path set is cleared as recursion returns. Shared dependencies are allowed and may be evaluated
                  again on another branch.
                </li>
              </ul>
              <p className="fb-note">
                Dependencies are stored as keys, not foreign keys to another flag. Deleting a referenced flag leaves
                that key in its dependents; subsequent evaluation fails the missing dependency.
              </p>
            </div>
            <FlagbitDependencies />
          </section>
        </li>

        <li>
          <section className="fb-section" aria-labelledby="fb-storage">
            <div className="fb-copy">
              <p className="fb-section-number" aria-hidden="true">
                06 / Configuration and storage
              </p>
              <h2 id="fb-storage">Persist the definition and its constraints</h2>
              <p>
                PostgreSQL stores flag definitions and their related settings through EF Core. Newly created flags
                default to disabled unless the request explicitly enables them.
              </p>
              <ul>
                <li>
                  A unique normalized key enforces case-insensitive flag identity. The original spelling and meaningful
                  whitespace are retained; duplicate creation returns <code>409</code>.
                </li>
                <li>
                  <code>PUT /api/flags/{'{key}'}/evaluation</code> replaces evaluation settings in a transaction.
                  Omitted settings are cleared, while the enabled state is preserved.
                </li>
                <li>
                  Enable and disable operations change only the state. Deleting a flag cascades to its own targeting,
                  environments, rules, and dependency rows.
                </li>
              </ul>
              <p className="fb-note">
                Database constraints also bound rollout to 0–100 and validate schedule order. The local startup script
                applies migrations before launching the API.
              </p>
            </div>
            <FlagbitStorage />
          </section>
        </li>

        <li>
          <section className="fb-section" aria-labelledby="fb-client">
            <div className="fb-copy">
              <p className="fb-section-number" aria-hidden="true">
                07 / The consumer boundary
              </p>
              <h2 id="fb-client">The application owns the behavior</h2>
              <p>
                The optional .NET SDK is an HTTP client, not a local evaluator. Each evaluation or variation call makes
                one request. Variation values stay in the caller and are selected from the server's boolean response.
              </p>
              <ul>
                <li>
                  <code>IsEnabledAsync</code> uses GET with user-only context; <code>EvaluateAsync</code> uses POST with
                  user, environment, and attributes.
                </li>
                <li>
                  The caller owns <code>HttpClient</code>, authentication headers, timeout, and cancellation. The SDK
                  adds no retries, cache, streaming updates, or outage fallback.
                </li>
                <li>
                  The included SampleApi evaluates <code>sample-new-checkout</code> once per checkout request, then
                  selects modern or classic checkout locally.
                </li>
              </ul>
              <p className="fb-note">
                HTTP, transport, and malformed-response errors remain failures. A disabled or missing flag is a valid
                boolean decision; an unavailable service is not.
              </p>
            </div>
            <FlagbitClientBoundary />
          </section>
        </li>
      </ol>

      <footer className="fb-reading">
        <div>
          <p className="fb-kicker">Read the implementation and evidence</p>
          <p>
            Core tests cover decision branches and known buckets. PostgreSQL integration tests cover persistence,
            rollback, and key revocation; SDK and sample tests distinguish disabled decisions from failures. These are
            correctness checks, not production-capacity measurements.
          </p>
          <p>
            Source and tests reviewed at <code>e5b9241</code>.
          </p>
        </div>
        <div className="fb-reading-links">
          <a
            href={`${source}/src/Flagbit.Core/Services/FeatureFlagEvaluator.cs`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Evaluator <ArrowUpRight size={15} aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          <a href={`${source}/docs/http-api.md`} target="_blank" rel="noopener noreferrer">
            HTTP contract <ArrowUpRight size={15} aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          <a href={`${source}/tests`} target="_blank" rel="noopener noreferrer">
            Tests <ArrowUpRight size={15} aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </footer>
    </article>
  )
}
