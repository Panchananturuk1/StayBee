import { Link } from 'react-router-dom'
import Card from '@/components/ui/Card'

const SUPPORT_EMAIL = 'pturuk123@gmail.com'
const LAST_UPDATED = 'August 5, 2026'

export default function Privacy() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <div className="text-xs font-medium tracking-wide text-white/55">Legal</div>
        <h1 className="mt-2 font-display text-4xl tracking-tight text-white">Privacy Policy</h1>
        <p className="mt-3 text-sm text-white/60">Last updated: {LAST_UPDATED}</p>
      </div>

      <Card className="space-y-6 p-6 text-sm leading-relaxed text-white/75 md:p-8">
        <section className="space-y-2">
          <h2 className="font-display text-xl text-white">Overview</h2>
          <p>
            StayBee (&quot;we&quot;, &quot;our&quot;, or &quot;the app&quot;) is a hotel discovery and booking
            application. This Privacy Policy explains what information we collect, how we use it, and your
            choices when you use the StayBee website or Android app.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl text-white">Information we collect</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong className="text-white/90">Account information:</strong> full name and email address when
              you create an account or sign in.
            </li>
            <li>
              <strong className="text-white/90">Booking information:</strong> hotel selections, check-in and
              check-out dates, guest count, and booking status.
            </li>
            <li>
              <strong className="text-white/90">Saved hotels:</strong> hotels you mark as favorites while signed
              in.
            </li>
            <li>
              <strong className="text-white/90">Session data:</strong> authentication tokens used to keep you
              signed in on your device.
            </li>
          </ul>
          <p>We do not collect payment card details. StayBee is a demo booking app and does not process payments.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl text-white">How we use information</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Create and manage your account</li>
            <li>Process and display your hotel bookings</li>
            <li>Sync saved hotels across sessions</li>
            <li>Improve app reliability and security</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl text-white">Where data is stored</h2>
          <p>
            Account, booking, and saved-hotel data is stored in a secure PostgreSQL database hosted by Neon.
            The app and API are hosted on Vercel. Data is transmitted over HTTPS.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl text-white">Data sharing</h2>
          <p>
            We do not sell your personal information. We use service providers (hosting and database) only to
            operate StayBee. We may disclose information if required by law.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl text-white">Data retention</h2>
          <p>
            We retain account and booking data while your account is active. You may request deletion of your
            account and associated data by contacting us.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl text-white">Your choices</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>You can browse hotels without signing in.</li>
            <li>You can sign out at any time to remove the session token from your device.</li>
            <li>
              You can request access, correction, or deletion of your data by emailing{' '}
              <a className="text-honey underline-offset-4 hover:underline" href={`mailto:${SUPPORT_EMAIL}`}>
                {SUPPORT_EMAIL}
              </a>
              .
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl text-white">Children</h2>
          <p>
            StayBee is not directed at children under 13. We do not knowingly collect personal information from
            children.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl text-white">Changes</h2>
          <p>
            We may update this Privacy Policy from time to time. The updated date at the top of this page will
            reflect the latest version.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl text-white">Contact</h2>
          <p>
            For privacy questions or data deletion requests, contact us at{' '}
            <a className="text-honey underline-offset-4 hover:underline" href={`mailto:${SUPPORT_EMAIL}`}>
              {SUPPORT_EMAIL}
            </a>
            .
          </p>
        </section>
      </Card>

      <Link to="/" className="inline-block text-sm text-white/65 underline-offset-4 hover:text-white hover:underline">
        ← Back to StayBee
      </Link>
    </div>
  )
}
