import { Link } from 'react-router'

export default function NotFound() {
  return (
    <div className="space-y-5 py-8">
      <title>Page not found | Portfolio</title>
      <p className="eyebrow">404</p>
      <h1>Page not found</h1>
      <p>The requested page does not exist.</p>
      <Link to="/" className="button-primary">
        Back to home
      </Link>
    </div>
  )
}
