import { Link } from 'react-router'

export default function NotFound() {
  return (
    <div className="space-y-4">
      <title>Page not found | Portfolio</title>
      <h1>Page not found</h1>
      <p>The requested page does not exist.</p>
      <Link to="/" className="inline-block underline">
        Back to home
      </Link>
    </div>
  )
}
