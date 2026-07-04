import { Link } from 'react-router-dom'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function NotFound() {
  return (
    <Card className="p-10">
      <div className="font-display text-3xl tracking-tight text-white">Page not found</div>
      <div className="mt-2 text-sm text-white/60">
        This route doesn’t exist in the demo. Head back to Explore.
      </div>
      <div className="mt-6">
        <Link to="/">
          <Button>Go home</Button>
        </Link>
      </div>
    </Card>
  )
}

